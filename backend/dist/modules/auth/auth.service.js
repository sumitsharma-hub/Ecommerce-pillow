"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordService = exports.verifyResetOtpService = exports.forgotPasswordService = exports.createAccountAfterOtp = exports.verifyLoginOtpService = exports.sendLoginOtpService = exports.loginWithPassword = exports.identifyUser = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const hash_util_1 = require("../../utils/hash.util");
const jwt_util_1 = require("../../utils/jwt.util");
const email_util_1 = require("../../utils/email.util");
const hashOtp_util_1 = require("../../utils/hashOtp.util");
const otp_service_1 = require("./otp.service");
// ── Helper: detect identifier type ──
function getIdentifierType(identifier) {
    return /^\d{10}$/.test(identifier) ? "phone" : "email";
}
// ── Helper: mask email/phone ──
function maskEmail(email) {
    const [local, domain] = email.split("@");
    if (local.length <= 2)
        return `${local[0]}***@${domain}`;
    return `${local[0]}${local[1]}${"*".repeat(local.length - 2)}@${domain}`;
}
function maskPhone(phone) {
    return `${"*".repeat(6)}${phone.slice(-4)}`;
}
// ── Helper: find user by identifier ──
async function findUserByIdentifier(identifier, type) {
    if (type === "email") {
        return prisma_1.default.user.findUnique({ where: { email: identifier } });
    }
    return prisma_1.default.user.findUnique({ where: { phone: identifier } });
}
// ── Helper: sanitize user for response ──
function sanitizeUser(user) {
    const { password, ...safeUser } = user;
    return safeUser;
}
// ══════════════════════════════════════
// STEP 1: Identify — user enters email/phone, clicks Continue
// ══════════════════════════════════════
const identifyUser = async (data) => {
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
    const result = {
        isExistingUser: true,
        hasPassword: !!user.password,
        isAdmin: user.role === "ADMIN",
        identifier,
        identifierType,
    };
    // Provide masked contact info for display
    if (user.email)
        result.maskedEmail = maskEmail(user.email);
    if (user.phone)
        result.maskedPhone = maskPhone(user.phone);
    return result;
};
exports.identifyUser = identifyUser;
// ══════════════════════════════════════
// STEP 2a: Password Login (existing users with password, required for admins)
// ══════════════════════════════════════
const loginWithPassword = async (data) => {
    const identifier = data.identifier.trim().toLowerCase();
    const identifierType = getIdentifierType(identifier);
    const user = await findUserByIdentifier(identifier, identifierType);
    if (!user || !user.password) {
        throw new Error("Invalid credentials");
    }
    const isMatch = await (0, hash_util_1.comparePassword)(data.password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const token = (0, jwt_util_1.signToken)({ id: user.id, role: user.role });
    return {
        user: sanitizeUser(user),
        token,
    };
};
exports.loginWithPassword = loginWithPassword;
// ══════════════════════════════════════
// STEP 2b: Send Login OTP
// ══════════════════════════════════════
const sendLoginOtpService = async (identifier) => {
    const trimmed = identifier.trim().toLowerCase();
    const identifierType = getIdentifierType(trimmed);
    if (identifierType === "phone") {
        // SMS OTP
        (0, otp_service_1.checkSmsRateLimit)(trimmed);
        const sessionId = await (0, otp_service_1.sendSmsOtp)(trimmed);
        (0, otp_service_1.recordSmsSent)(trimmed);
        return {
            message: "OTP sent to your mobile number",
            sessionId,
            otpSentVia: "sms",
            identifier: trimmed,
        };
    }
    else {
        // Email OTP
        await (0, otp_service_1.sendEmailOtp)(trimmed);
        return {
            message: "OTP sent to your email",
            otpSentVia: "email",
            identifier: trimmed,
        };
    }
};
exports.sendLoginOtpService = sendLoginOtpService;
// ══════════════════════════════════════
// STEP 3: Verify Login OTP
// ══════════════════════════════════════
const verifyLoginOtpService = async (data) => {
    const identifier = data.identifier.trim().toLowerCase();
    const identifierType = getIdentifierType(identifier);
    // Verify OTP based on type
    if (identifierType === "phone") {
        if (!data.sessionId) {
            throw new Error("Session ID is required for phone verification");
        }
        await (0, otp_service_1.verifySmsOtp)(data.sessionId, data.otp);
    }
    else {
        await (0, otp_service_1.verifyEmailOtp)(identifier, data.otp);
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
    const token = (0, jwt_util_1.signToken)({ id: user.id, role: user.role });
    return {
        isNewUser: false,
        user: sanitizeUser(user),
        token,
    };
};
exports.verifyLoginOtpService = verifyLoginOtpService;
// ══════════════════════════════════════
// STEP 4: Create Account (after OTP verification for new users)
// ══════════════════════════════════════
const createAccountAfterOtp = async (data) => {
    const { identifier, identifierType, name, email, phone, password } = data;
    if (!name || name.trim().length === 0) {
        throw new Error("Name is required");
    }
    // Build user data
    const userData = {
        name: name.trim(),
        role: "USER",
    };
    // Set the verified identifier
    if (identifierType === "phone") {
        userData.phone = identifier;
        if (email && email.trim())
            userData.email = email.trim().toLowerCase();
    }
    else {
        userData.email = identifier;
        if (phone && phone.trim())
            userData.phone = phone.trim();
    }
    // Optional password
    if (password) {
        userData.password = await (0, hash_util_1.hashPassword)(password);
    }
    // Check for duplicates
    if (userData.email) {
        const existingEmail = await prisma_1.default.user.findUnique({
            where: { email: userData.email },
        });
        if (existingEmail)
            throw new Error("Email already in use");
    }
    if (userData.phone) {
        const existingPhone = await prisma_1.default.user.findUnique({
            where: { phone: userData.phone },
        });
        if (existingPhone)
            throw new Error("Phone number already in use");
    }
    const user = await prisma_1.default.user.create({ data: userData });
    const token = (0, jwt_util_1.signToken)({ id: user.id, role: user.role });
    return {
        user: sanitizeUser(user),
        token,
    };
};
exports.createAccountAfterOtp = createAccountAfterOtp;
// ══════════════════════════════════════
// Forgot Password Flow (supports email + phone)
// ══════════════════════════════════════
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
const forgotPasswordService = async (identifier, setNewPassword = false) => {
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
        throw new Error("This account was created via OTP login and has no password. Please log in with OTP.");
    }
    // Rate limit: 60 second cooldown
    const recentOtp = await prisma_1.default.passwordReset.findFirst({
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
        (0, otp_service_1.checkSmsRateLimit)(trimmed);
        const sessionId = await (0, otp_service_1.sendSmsOtp)(trimmed);
        (0, otp_service_1.recordSmsSent)(trimmed);
        await prisma_1.default.passwordReset.create({
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
    }
    else {
        // Email OTP
        const otp = generateOtp();
        const hashedOtp = (0, hashOtp_util_1.hashOtp)(otp);
        await prisma_1.default.passwordReset.create({
            data: {
                identifier: trimmed,
                channel: "email",
                otp: hashedOtp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            },
        });
        await (0, email_util_1.sendPasswordResetEmail)(trimmed, otp);
        return {
            message: "If an account exists, an OTP has been sent.",
            otpSentVia: "email",
        };
    }
};
exports.forgotPasswordService = forgotPasswordService;
const verifyResetOtpService = async ({ identifier, otp, sessionId, }) => {
    const trimmed = identifier.trim().toLowerCase();
    const identifierType = getIdentifierType(trimmed);
    if (identifierType === "phone") {
        // Verify via 2Factor API
        const record = await prisma_1.default.passwordReset.findFirst({
            where: { identifier: trimmed, used: false, channel: "sms" },
            orderBy: { createdAt: "desc" },
        });
        if (!record)
            throw new Error("OTP not found");
        if (record.expiresAt < new Date())
            throw new Error("OTP expired");
        const verifySessionId = sessionId || record.otp;
        await (0, otp_service_1.verifySmsOtp)(verifySessionId, otp);
        return { message: "OTP verified" };
    }
    else {
        // Verify email OTP from DB
        const hashedOtp = (0, hashOtp_util_1.hashOtp)(otp);
        const record = await prisma_1.default.passwordReset.findFirst({
            where: { identifier: trimmed, used: false, channel: "email" },
            orderBy: { createdAt: "desc" },
        });
        if (!record)
            throw new Error("OTP not found");
        if (record.expiresAt < new Date())
            throw new Error("OTP expired");
        if (record.attempts >= 5)
            throw new Error("Too many attempts. Request a new OTP.");
        if (record.otp !== hashedOtp) {
            await prisma_1.default.passwordReset.update({
                where: { id: record.id },
                data: { attempts: { increment: 1 } },
            });
            throw new Error("Invalid OTP");
        }
        return { message: "OTP verified" };
    }
};
exports.verifyResetOtpService = verifyResetOtpService;
const resetPasswordService = async ({ identifier, otp, password, sessionId, }) => {
    const trimmed = identifier.trim().toLowerCase();
    const identifierType = getIdentifierType(trimmed);
    // Find the reset record
    const record = await prisma_1.default.passwordReset.findFirst({
        where: { identifier: trimmed, used: false },
        orderBy: { createdAt: "desc" },
    });
    if (!record)
        throw new Error("Invalid OTP");
    if (record.expiresAt < new Date())
        throw new Error("OTP expired");
    // Re-verify the OTP
    if (identifierType === "phone") {
        const verifySessionId = sessionId || record.otp;
        await (0, otp_service_1.verifySmsOtp)(verifySessionId, otp);
    }
    else {
        const hashedOtp = (0, hashOtp_util_1.hashOtp)(otp);
        if (record.otp !== hashedOtp)
            throw new Error("Invalid OTP");
    }
    // Update password
    const hashedPassword = await (0, hash_util_1.hashPassword)(password);
    if (identifierType === "email") {
        await prisma_1.default.user.update({
            where: { email: trimmed },
            data: { password: hashedPassword },
        });
    }
    else {
        await prisma_1.default.user.update({
            where: { phone: trimmed },
            data: { password: hashedPassword },
        });
    }
    // Mark reset record as used
    await prisma_1.default.passwordReset.update({
        where: { id: record.id },
        data: { used: true },
    });
    return { message: "Password reset successful" };
};
exports.resetPasswordService = resetPasswordService;
