import axios from "axios";
import prisma from "../../prisma";
import { hashOtp } from "../../utils/hashOtp.util";
import { sendOtpEmail } from "../../utils/email.util";

const API_KEY = process.env.TWO_FACTOR_API_KEY;

// ── SMS OTP via 2Factor ──

export async function sendSmsOtp(phone: string): Promise<string> {
  const formattedPhone = `91${phone}`;
  const url = `https://2factor.in/API/V1/${API_KEY}/SMS/${formattedPhone}/AUTOGEN3/naturalplus_1`;

  const response = await axios.get(url);

  if (response.data.Status !== "Success") {
    throw new Error("Failed to send OTP via SMS");
  }

  return response.data.Details; // sessionId
}

export async function verifySmsOtp(
  sessionId: string,
  otp: string
): Promise<boolean> {
  const url = `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY3/${sessionId}/${otp}`;

  const response = await axios.get(url);

  if (response.data.Status !== "Success") {
    throw new Error("Invalid OTP");
  }

  return true;
}

// ── Email OTP (stored in DB) ──

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendEmailOtp(email: string): Promise<void> {
  // Rate limit: 60 second cooldown
  const recentOtp = await prisma.loginOtp.findFirst({
    where: {
      identifier: email,
      createdAt: {
        gt: new Date(Date.now() - 60 * 1000),
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (recentOtp) {
    throw new Error("Please wait 60 seconds before requesting another OTP");
  }

  const otp = generateOtp();
  const hashedOtp = hashOtp(otp);

  await prisma.loginOtp.create({
    data: {
      identifier: email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    },
  });

  await sendOtpEmail(email, otp);
}

export async function verifyEmailOtp(
  email: string,
  otp: string
): Promise<boolean> {
  const hashedOtp = hashOtp(otp);

  const record = await prisma.loginOtp.findFirst({
    where: {
      identifier: email,
      used: false,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    throw new Error("OTP not found. Please request a new one.");
  }

  if (record.expiresAt < new Date()) {
    throw new Error("OTP expired. Please request a new one.");
  }

  if (record.attempts >= 5) {
    throw new Error("Too many failed attempts. Request a new OTP.");
  }

  if (record.otp !== hashedOtp) {
    await prisma.loginOtp.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    throw new Error("Invalid OTP");
  }

  // Mark as used
  await prisma.loginOtp.update({
    where: { id: record.id },
    data: { used: true },
  });

  return true;
}

// ── Rate limiting check for SMS ──

const smsOtpCooldowns = new Map<string, number>();

export function checkSmsRateLimit(phone: string): void {
  const lastSent = smsOtpCooldowns.get(phone);
  if (lastSent && Date.now() - lastSent < 60 * 1000) {
    throw new Error("Please wait 60 seconds before requesting another OTP");
  }
}

export function recordSmsSent(phone: string): void {
  smsOtpCooldowns.set(phone, Date.now());

  // Cleanup old entries every 100 records
  if (smsOtpCooldowns.size > 1000) {
    const now = Date.now();
    for (const [key, val] of smsOtpCooldowns) {
      if (now - val > 120 * 1000) smsOtpCooldowns.delete(key);
    }
  }
}