"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Auth Routes
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const rateLimit_middleware_1 = require("../../middlewares/rateLimit.middleware");
const router = (0, express_1.Router)();
router.post("/register", rateLimit_middleware_1.authLimiter, auth_controller_1.register);
router.post("/login", rateLimit_middleware_1.authLimiter, auth_controller_1.login);
router.post("/forgot-password", rateLimit_middleware_1.forgotPasswordLimiter, auth_controller_1.forgotPassword);
router.post("/verify-reset-otp", auth_controller_1.verifyResetOtp);
router.post("/reset-password", auth_controller_1.resetPassword);
exports.default = router;
