// Auth Service
import prisma from "../../prisma";
import { hashPassword, comparePassword } from "../../utils/hash.util";
import { signToken } from "../../utils/jwt.util";
import { RegisterInput, LoginInput } from "./auth.types";
import { transporter } from "../../utils/mailer.util";
import { resetPasswordOtpTemplate } from "../../utils/emailTemplates/resetPasswordOtp";
import { sendPasswordResetEmail } from "../../utils/email.util";
import { hashOtp } from "../../utils/hashOtp.util";

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      role: "USER",
    },
  });

  const { password, ...safeUser } = user;

  const token = signToken({ id: user.id, role: user.role });

  return {
    message: "User registered successfully",
    user: safeUser,
    token,
  };
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(data.password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({ id: user.id, role: user.role });

  return { user, token };
};

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const forgotPasswordService = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // ✅ Prevent OTP spam (60 sec cooldown)
  const recentOtp = await prisma.passwordReset.findFirst({
    where: {
      email,
      createdAt: {
        gt: new Date(Date.now() - 60 * 1000), // last 60 seconds
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (recentOtp) {
    throw new Error("Please wait 60 seconds before requesting another OTP");
  }

  // ✅ Generate OTP
  const otp = generateOtp();
  const hashedOtp = hashOtp(otp);

  await prisma.passwordReset.create({
    data: {
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 10 minutes
    },
  });

  await sendPasswordResetEmail(email, otp);

  return { message: "OTP sent successfully" };
};

export const verifyResetOtpService = async ({ email, otp }: any) => {
  const hashedOtp = hashOtp(otp);

  const record = await prisma.passwordReset.findFirst({
    where: {
      email,
      used: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!record) {
    throw new Error("OTP not found");
  }

  if (record.expiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  if (record.attempts >= 5) {
    throw new Error("Too many attempts. Request new OTP.");
  }

  if (record.otp !== hashedOtp) {
    await prisma.passwordReset.update({
      where: { id: record.id },
      data: {
        attempts: { increment: 1 },
      },
    });

    throw new Error("Invalid OTP");
  }

  return { message: "OTP verified" };
};

export const resetPasswordService = async ({ email, otp, password }: any) => {
  const hashedOtp = hashOtp(otp);

  const record = await prisma.passwordReset.findFirst({
    where: {
      email,
      otp: hashedOtp,
      used: false,
    },
  });

  if (!record) {
    throw new Error("Invalid OTP");
  }

  if (record.expiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  await prisma.passwordReset.update({
    where: { id: record.id },
    data: { used: true },
  });

  return { message: "Password reset successful" };
};
