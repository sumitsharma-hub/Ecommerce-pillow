// auth.service.ts

import prisma from "../../prisma";
import { hashPassword, comparePassword } from "../../utils/hash.util";
import { signToken } from "../../utils/jwt.util";
import { RegisterInput, LoginInput } from "./auth.types";
import { sendPasswordResetEmail } from "../../utils/email.util";
import { hashOtp } from "../../utils/hashOtp.util";

// ── Sanitize user for response ──
function sanitizeUser(user: any) {
  const { password, ...safeUser } = user;
  return safeUser;
}

// ── Generate 6-digit OTP ──
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ══════════════════════════════════════
// REGISTER
// ══════════════════════════════════════

export const registerUser = async (data: RegisterInput) => {
  const email = data.email.trim().toLowerCase();

  // Check duplicate email
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    throw new Error("An account with this email already exists");
  }

  // Check duplicate phone (if provided)
  if (data.phone && data.phone.trim()) {
    const existingPhone = await prisma.user.findUnique({
      where: { phone: data.phone.trim() },
    });
    if (existingPhone) {
      throw new Error("An account with this phone number already exists");
    }
  }

  if (!data.name || data.name.trim().length === 0) {
    throw new Error("Name is required");
  }

  if (!data.password || data.password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name.trim(),
      email,
      phone: data.phone?.trim() || null,
      password: hashedPassword,
      role: "USER",
    },
  });

  const token = signToken({ id: user.id, role: user.role });

  return { user: sanitizeUser(user), token };
};

// ══════════════════════════════════════
// LOGIN
// ══════════════════════════════════════

export const loginWithPassword = async (data: LoginInput) => {
  const email = data.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = signToken({ id: user.id, role: user.role });

  return { user: sanitizeUser(user), token };
};

// ══════════════════════════════════════
// FORGOT PASSWORD — send OTP via email
// ══════════════════════════════════════

export const forgotPasswordService = async (email: string) => {
  const trimmed = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email: trimmed } });

  // Don't reveal if account exists
  if (!user) {
    return { message: "If an account exists, an OTP has been sent." };
  }

  // Rate limit: 60 second cooldown
  const recentOtp = await prisma.passwordReset.findFirst({
    where: {
      email: trimmed,
      createdAt: { gt: new Date(Date.now() - 60 * 1000) },
    },
    orderBy: { createdAt: "desc" },
  });

  if (recentOtp) {
    throw new Error("Please wait 60 seconds before requesting another OTP");
  }

  const otp = generateOtp();
  const hashedOtp = hashOtp(otp);

  await prisma.passwordReset.create({
    data: {
      email: trimmed,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    },
  });

  await sendPasswordResetEmail(trimmed, otp);

  return { message: "If an account exists, an OTP has been sent." };
};

// ══════════════════════════════════════
// VERIFY RESET OTP
// ══════════════════════════════════════

export const verifyResetOtpService = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  const trimmed = email.trim().toLowerCase();
  const hashedOtp = hashOtp(otp);

  const record = await prisma.passwordReset.findFirst({
    where: { email: trimmed, used: false },
    orderBy: { createdAt: "desc" },
  });

  if (!record) throw new Error("OTP not found. Please request a new one.");
  if (record.expiresAt < new Date()) throw new Error("OTP has expired.");
  if (record.attempts >= 5)
    throw new Error("Too many attempts. Please request a new OTP.");

  if (record.otp !== hashedOtp) {
    await prisma.passwordReset.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    throw new Error("Invalid OTP");
  }

  return { message: "OTP verified" };
};

// ══════════════════════════════════════
// RESET PASSWORD
// ══════════════════════════════════════

export const resetPasswordService = async ({
  email,
  otp,
  password,
}: {
  email: string;
  otp: string;
  password: string;
}) => {
  const trimmed = email.trim().toLowerCase();
  const hashedOtp = hashOtp(otp);

  const record = await prisma.passwordReset.findFirst({
    where: { email: trimmed, used: false },
    orderBy: { createdAt: "desc" },
  });

  if (!record) throw new Error("Invalid or expired OTP");
  if (record.expiresAt < new Date()) throw new Error("OTP has expired");
  if (record.otp !== hashedOtp) throw new Error("Invalid OTP");

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.update({
    where: { email: trimmed },
    data: { password: hashedPassword },
  });

  await prisma.passwordReset.update({
    where: { id: record.id },
    data: { used: true },
  });

  return { message: "Password reset successful" };
};