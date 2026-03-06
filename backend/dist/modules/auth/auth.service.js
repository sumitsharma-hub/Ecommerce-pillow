"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordService = exports.verifyResetOtpService = exports.forgotPasswordService = exports.loginUser = exports.registerUser = void 0;
// Auth Service
const prisma_1 = __importDefault(require("../../prisma"));
const hash_util_1 = require("../../utils/hash.util");
const jwt_util_1 = require("../../utils/jwt.util");
const email_util_1 = require("../../utils/email.util");
const hashOtp_util_1 = require("../../utils/hashOtp.util");
const registerUser = async (data) => {
    const existingUser = await prisma_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await (0, hash_util_1.hashPassword)(data.password);
    const user = await prisma_1.default.user.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            role: "USER",
        },
    });
    const { password, ...safeUser } = user;
    const token = (0, jwt_util_1.signToken)({ id: user.id, role: user.role });
    return {
        message: "User registered successfully",
        user: safeUser,
        token,
    };
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isMatch = await (0, hash_util_1.comparePassword)(data.password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const token = (0, jwt_util_1.signToken)({ id: user.id, role: user.role });
    return { user, token };
};
exports.loginUser = loginUser;
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
const forgotPasswordService = async (email) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new Error("User not found");
    }
    // ✅ Prevent OTP spam (60 sec cooldown)
    const recentOtp = await prisma_1.default.passwordReset.findFirst({
        where: {
            email,
            createdAt: {
                gt: new Date(Date.now() - 60 * 1000) // last 60 seconds
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    if (recentOtp) {
        throw new Error("Please wait 60 seconds before requesting another OTP");
    }
    // ✅ Generate OTP
    const otp = generateOtp();
    const hashedOtp = (0, hashOtp_util_1.hashOtp)(otp);
    await prisma_1.default.passwordReset.create({
        data: {
            email,
            otp: hashedOtp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        }
    });
    await (0, email_util_1.sendPasswordResetEmail)(email, otp);
    return { message: "OTP sent successfully" };
};
exports.forgotPasswordService = forgotPasswordService;
const verifyResetOtpService = async ({ email, otp }) => {
    const hashedOtp = (0, hashOtp_util_1.hashOtp)(otp);
    const record = await prisma_1.default.passwordReset.findFirst({
        where: {
            email,
            used: false
        },
        orderBy: {
            createdAt: "desc"
        }
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
        await prisma_1.default.passwordReset.update({
            where: { id: record.id },
            data: {
                attempts: { increment: 1 }
            }
        });
        throw new Error("Invalid OTP");
    }
    return { message: "OTP verified" };
};
exports.verifyResetOtpService = verifyResetOtpService;
const resetPasswordService = async ({ email, otp, password }) => {
    const hashedOtp = (0, hashOtp_util_1.hashOtp)(otp);
    const record = await prisma_1.default.passwordReset.findFirst({
        where: {
            email,
            otp: hashedOtp,
            used: false
        }
    });
    if (!record) {
        throw new Error("Invalid OTP");
    }
    if (record.expiresAt < new Date()) {
        throw new Error("OTP expired");
    }
    const hashedPassword = await (0, hash_util_1.hashPassword)(password);
    await prisma_1.default.user.update({
        where: { email },
        data: { password: hashedPassword }
    });
    await prisma_1.default.passwordReset.update({
        where: { id: record.id },
        data: { used: true }
    });
    return { message: "Password reset successful" };
};
exports.resetPasswordService = resetPasswordService;
