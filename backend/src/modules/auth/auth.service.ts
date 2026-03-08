import prisma from "../../prisma";
import { hashPassword, comparePassword } from "../../utils/hash.util";
import { signToken } from "../../utils/jwt.util";
import {
  LoginInput,
  IdentifyInput,
  IdentifyResult,
  SendOtpResult,
  VerifyOtpInput,
  CreateAccountInput,
} from "./auth.types";
import { sendPasswordResetEmail } from "../../utils/email.util";
import { hashOtp } from "../../utils/hashOtp.util";
import {
  sendSmsOtp,
  verifySmsOtp,
  sendEmailOtp,
  verifyEmailOtp,
  checkSmsRateLimit,
  recordSmsSent,
} from "./otp.service";

// ── Helper: detect identifier type ──

function getIdentifierType(identifier: string): "email" | "phone" {
  return /^\d{10}$/.test(identifier) ? "phone" : "email";
}

// ── Helper: mask email/phone ──

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}${local[1]}${"*".repeat(local.length - 2)}@${domain}`;
}

function maskPhone(phone: string): string {
  return `${"*".repeat(6)}${phone.slice(-4)}`;
}

// ── Helper: find user by identifier ──

async function findUserByIdentifier(
  identifier: string,
  type: "email" | "phone",
) {
  if (type === "email") {
    return prisma.user.findUnique({ where: { email: identifier } });
  }
  return prisma.user.findUnique({ where: { phone: identifier } });
}

// ── Helper: sanitize user for response ──

function sanitizeUser(user: any) {
  const { password, ...safeUser } = user;
  return safeUser;
}

// ══════════════════════════════════════
// STEP 1: Identify — user enters email/phone, clicks Continue
// ══════════════════════════════════════

export const identifyUser = async (
  data: IdentifyInput,
): Promise<IdentifyResult> => {
  const identifier = data.identifier.trim().toLowerCase();
  const identifierType = getIdentifierType(identifier);

  const user = await findUserByIdentifier(identifier, identifierType);

  if (!user) {
    // New user — we don't reveal this directly.
    // We always say "OTP sent" to prevent enumeration.
    return {
      isExistingUser: false,
      hasPassword: false,
      isAdmin: false,
      identifier,
      identifierType,
    };
  }

  const result: IdentifyResult = {
    isExistingUser: true,
    hasPassword: !!user.password,
    isAdmin: user.role === "ADMIN",
    identifier,
    identifierType,
  };

  // Provide masked contact info for display
  if (user.email) result.maskedEmail = maskEmail(user.email);
  if (user.phone) result.maskedPhone = maskPhone(user.phone);

  return result;
};

// ══════════════════════════════════════
// STEP 2a: Password Login (existing users with password, required for admins)
// ══════════════════════════════════════

export const loginWithPassword = async (data: LoginInput) => {
  const identifier = data.identifier.trim().toLowerCase();
  const identifierType = getIdentifierType(identifier);

  const user = await findUserByIdentifier(identifier, identifierType);

  if (!user || !user.password) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(data.password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({ id: user.id, role: user.role });

  return {
    user: sanitizeUser(user),
    token,
  };
};

// ══════════════════════════════════════
// STEP 2b: Send Login OTP
// ══════════════════════════════════════

export const sendLoginOtpService = async (
  identifier: string,
): Promise<SendOtpResult> => {
  const trimmed = identifier.trim().toLowerCase();
  const identifierType = getIdentifierType(trimmed);

  if (identifierType === "phone") {
    // SMS OTP
    checkSmsRateLimit(trimmed);
    const sessionId = await sendSmsOtp(trimmed);
    recordSmsSent(trimmed);

    return {
      message: "OTP sent to your mobile number",
      sessionId,
      otpSentVia: "sms",
      identifier: trimmed,
    };
  } else {
    // Email OTP
    await sendEmailOtp(trimmed);

    return {
      message: "OTP sent to your email",
      otpSentVia: "email",
      identifier: trimmed,
    };
  }
};

// ══════════════════════════════════════
// STEP 3: Verify Login OTP
// ══════════════════════════════════════

export const verifyLoginOtpService = async (data: VerifyOtpInput) => {
  const identifier = data.identifier.trim().toLowerCase();
  const identifierType = getIdentifierType(identifier);

  // Verify OTP based on type
  if (identifierType === "phone") {
    if (!data.sessionId) {
      throw new Error("Session ID is required for phone verification");
    }
    await verifySmsOtp(data.sessionId, data.otp);
  } else {
    await verifyEmailOtp(identifier, data.otp);
  }

  // Check if user exists
  const user = await findUserByIdentifier(identifier, identifierType);

  if (!user) {
    // New user — return signal to show registration form
    return {
      isNewUser: true,
      identifier,
      identifierType,
    };
  }

  // Admin cannot login via OTP
  if (user.role === "ADMIN") {
    throw new Error("Admin accounts must use password login");
  }

  const token = signToken({ id: user.id, role: user.role });

  return {
    isNewUser: false,
    user: sanitizeUser(user),
    token,
  };
};

// ══════════════════════════════════════
// STEP 4: Create Account (after OTP verification for new users)
// ══════════════════════════════════════

export const createAccountAfterOtp = async (data: CreateAccountInput) => {
  const { identifier, identifierType, name, email, phone, password } = data;

  if (!name || name.trim().length === 0) {
    throw new Error("Name is required");
  }

  // Build user data
  const userData: any = {
    name: name.trim(),
    role: "USER",
  };

  // Set the verified identifier
  if (identifierType === "phone") {
    userData.phone = identifier;
    if (email && email.trim()) userData.email = email.trim().toLowerCase();
  } else {
    userData.email = identifier;
    if (phone && phone.trim()) userData.phone = phone.trim();
  }

  // Optional password
  if (password) {
    userData.password = await hashPassword(password);
  }

  // Check for duplicates
  if (userData.email) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (existingEmail) throw new Error("Email already in use");
  }

  if (userData.phone) {
    const existingPhone = await prisma.user.findUnique({
      where: { phone: userData.phone },
    });
    if (existingPhone) throw new Error("Phone number already in use");
  }

  const user = await prisma.user.create({ data: userData });

  const token = signToken({ id: user.id, role: user.role });

  return {
    user: sanitizeUser(user),
    token,
  };
};

// ══════════════════════════════════════
// Forgot Password Flow (supports email + phone)
// ══════════════════════════════════════

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const forgotPasswordService = async (
  identifier: string,
  setNewPassword: boolean = false
) => {
  const trimmed = identifier.trim().toLowerCase();
  const identifierType = getIdentifierType(trimmed);

  const user = await findUserByIdentifier(trimmed, identifierType);

  if (!user) {
    // Don't reveal if user exists — but still return success shape
    return {
      message: "If an account exists, an OTP has been sent.",
      otpSentVia: identifierType === "phone" ? "sms" : "email",
    };
  }

  // If user has no password and didn't explicitly ask to set one, inform them
  if (!user.password && !setNewPassword) {
    throw new Error(
      "This account was created via OTP login and has no password. Please log in with OTP."
    );
  }

  // Rate limit: 60 second cooldown
  const recentOtp = await prisma.passwordReset.findFirst({
    where: {
      identifier: trimmed,
      createdAt: { gt: new Date(Date.now() - 60 * 1000) },
    },
    orderBy: { createdAt: "desc" },
  });

  if (recentOtp) {
    throw new Error("Please wait 60 seconds before requesting another OTP");
  }

  if (identifierType === "phone") {
    // SMS OTP via 2Factor
    checkSmsRateLimit(trimmed);
    const sessionId = await sendSmsOtp(trimmed);
    recordSmsSent(trimmed);

    await prisma.passwordReset.create({
      data: {
        identifier: trimmed,
        channel: "sms",
        otp: sessionId,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    return {
      message: "If an account exists, an OTP has been sent.",
      sessionId,
      otpSentVia: "sms",
    };
  } else {
    // Email OTP
    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);

    await prisma.passwordReset.create({
      data: {
        identifier: trimmed,
        channel: "email",
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    await sendPasswordResetEmail(trimmed, otp);

    return {
      message: "If an account exists, an OTP has been sent.",
      otpSentVia: "email",
    };
  }
};

export const verifyResetOtpService = async ({
  identifier,
  otp,
  sessionId,
}: {
  identifier: string;
  otp: string;
  sessionId?: string;
}) => {
  const trimmed = identifier.trim().toLowerCase();
  const identifierType = getIdentifierType(trimmed);

  if (identifierType === "phone") {
    // Verify via 2Factor API
    const record = await prisma.passwordReset.findFirst({
      where: { identifier: trimmed, used: false, channel: "sms" },
      orderBy: { createdAt: "desc" },
    });

    if (!record) throw new Error("OTP not found");
    if (record.expiresAt < new Date()) throw new Error("OTP expired");

    const verifySessionId = sessionId || record.otp;
    await verifySmsOtp(verifySessionId, otp);

    return { message: "OTP verified" };
  } else {
    // Verify email OTP from DB
    const hashedOtp = hashOtp(otp);

    const record = await prisma.passwordReset.findFirst({
      where: { identifier: trimmed, used: false, channel: "email" },
      orderBy: { createdAt: "desc" },
    });

    if (!record) throw new Error("OTP not found");
    if (record.expiresAt < new Date()) throw new Error("OTP expired");
    if (record.attempts >= 5)
      throw new Error("Too many attempts. Request a new OTP.");

    if (record.otp !== hashedOtp) {
      await prisma.passwordReset.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      throw new Error("Invalid OTP");
    }

    return { message: "OTP verified" };
  }
};

export const resetPasswordService = async ({
  identifier,
  otp,
  password,
  sessionId,
}: {
  identifier: string;
  otp: string;
  password: string;
  sessionId?: string;
}) => {
  const trimmed = identifier.trim().toLowerCase();
  const identifierType = getIdentifierType(trimmed);

  // Find the reset record
  const record = await prisma.passwordReset.findFirst({
    where: { identifier: trimmed, used: false },
    orderBy: { createdAt: "desc" },
  });

  if (!record) throw new Error("Invalid OTP");
  if (record.expiresAt < new Date()) throw new Error("OTP expired");

  // Re-verify the OTP
  if (identifierType === "phone") {
    const verifySessionId = sessionId || record.otp;
    await verifySmsOtp(verifySessionId, otp);
  } else {
    const hashedOtp = hashOtp(otp);
    if (record.otp !== hashedOtp) throw new Error("Invalid OTP");
  }

  // Update password
  const hashedPassword = await hashPassword(password);

  if (identifierType === "email") {
    await prisma.user.update({
      where: { email: trimmed },
      data: { password: hashedPassword },
    });
  } else {
    await prisma.user.update({
      where: { phone: trimmed },
      data: { password: hashedPassword },
    });
  }

  // Mark reset record as used
  await prisma.passwordReset.update({
    where: { id: record.id },
    data: { used: true },
  });

  return { message: "Password reset successful" };
};
