"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpLimiter = exports.forgotPasswordLimiter = exports.authLimiter = exports.writeLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.writeLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 30,
    message: "Too many requests. Please slow down.",
});
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { message: "Too many attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.forgotPasswordLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: "Too many password reset requests. Try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.otpLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // max 5 OTP requests per 5 minutes per IP
    message: { message: "Too many OTP requests. Please wait before trying again." },
    standardHeaders: true,
    legacyHeaders: false,
});
