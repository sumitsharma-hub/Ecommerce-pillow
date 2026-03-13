"use strict";
// auth.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordService = exports.verifyResetOtpService = exports.forgotPasswordService = exports.loginWithPassword = exports.registerUser = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const hash_util_1 = require("../../utils/hash.util");
const jwt_util_1 = require("../../utils/jwt.util");
const email_util_1 = require("../../utils/email.util");
const hashOtp_util_1 = require("../../utils/hashOtp.util");
// ── Sanitize user for response ──
function sanitizeUser(user) {
    const { password, ...safeUser } = user;
    return safeUser;
}
// ── Generate 6-digit OTP ──
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
// ══════════════════════════════════════
// REGISTER
// ══════════════════════════════════════
const registerUser = async (data) => {
    const email = data.email.trim().toLowerCase();
    // Check duplicate email
    const existingEmail = await prisma_1.default.user.findUnique({ where: { email } });
    if (existingEmail) {
        throw new Error("An account with this email already exists");
    }
    // Check duplicate phone (if provided)
    if (data.phone && data.phone.trim()) {
        const existingPhone = await prisma_1.default.user.findUnique({
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
    const hashedPassword = await (0, hash_util_1.hashPassword)(data.password);
    const user = await prisma_1.default.user.create({
        data: {
            name: data.name.trim(),
            email,
            phone: data.phone?.trim() || null,
            password: hashedPassword,
            role: "USER",
        },
    });
    const token = (0, jwt_util_1.signToken)({ id: user.id, role: user.role });
    return { user: sanitizeUser(user), token };
};
exports.registerUser = registerUser;
// ══════════════════════════════════════
// LOGIN
// ══════════════════════════════════════
const loginWithPassword = async (data) => {
    const email = data.email.trim().toLowerCase();
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const isMatch = await (0, hash_util_1.comparePassword)(data.password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }
    const token = (0, jwt_util_1.signToken)({ id: user.id, role: user.role });
    return { user: sanitizeUser(user), token };
};
exports.loginWithPassword = loginWithPassword;
// ══════════════════════════════════════
// FORGOT PASSWORD — send OTP via email
// ══════════════════════════════════════
const forgotPasswordService = async (email) => {
    const trimmed = email.trim().toLowerCase();
    const user = await prisma_1.default.user.findUnique({ where: { email: trimmed } });
    // Don't reveal if account exists
    if (!user) {
        return { message: "If an account exists, an OTP has been sent." };
    }
    // Rate limit: 60 second cooldown
    const recentOtp = await prisma_1.default.passwordReset.findFirst({
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
    const hashedOtp = (0, hashOtp_util_1.hashOtp)(otp);
    await prisma_1.default.passwordReset.create({
        data: {
            email: trimmed,
            otp: hashedOtp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        },
    });
    await (0, email_util_1.sendPasswordResetEmail)(trimmed, otp);
    return { message: "If an account exists, an OTP has been sent." };
};
exports.forgotPasswordService = forgotPasswordService;
// ══════════════════════════════════════
// VERIFY RESET OTP
// ══════════════════════════════════════
const verifyResetOtpService = async ({ email, otp, }) => {
    const trimmed = email.trim().toLowerCase();
    const hashedOtp = (0, hashOtp_util_1.hashOtp)(otp);
    const record = await prisma_1.default.passwordReset.findFirst({
        where: { email: trimmed, used: false },
        orderBy: { createdAt: "desc" },
    });
    if (!record)
        throw new Error("OTP not found. Please request a new one.");
    if (record.expiresAt < new Date())
        throw new Error("OTP has expired.");
    if (record.attempts >= 5)
        throw new Error("Too many attempts. Please request a new OTP.");
    if (record.otp !== hashedOtp) {
        await prisma_1.default.passwordReset.update({
            where: { id: record.id },
            data: { attempts: { increment: 1 } },
        });
        throw new Error("Invalid OTP");
    }
    return { message: "OTP verified" };
};
exports.verifyResetOtpService = verifyResetOtpService;
// ══════════════════════════════════════
// RESET PASSWORD
// ══════════════════════════════════════
const resetPasswordService = async ({ email, otp, password, }) => {
    const trimmed = email.trim().toLowerCase();
    const hashedOtp = (0, hashOtp_util_1.hashOtp)(otp);
    const record = await prisma_1.default.passwordReset.findFirst({
        where: { email: trimmed, used: false },
        orderBy: { createdAt: "desc" },
    });
    if (!record)
        throw new Error("Invalid or expired OTP");
    if (record.expiresAt < new Date())
        throw new Error("OTP has expired");
    if (record.otp !== hashedOtp)
        throw new Error("Invalid OTP");
    if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }
    const hashedPassword = await (0, hash_util_1.hashPassword)(password);
    await prisma_1.default.user.update({
        where: { email: trimmed },
        data: { password: hashedPassword },
    });
    await prisma_1.default.passwordReset.update({
        where: { id: record.id },
        data: { used: true },
    });
    return { message: "Password reset successful" };
};
exports.resetPasswordService = resetPasswordService;
