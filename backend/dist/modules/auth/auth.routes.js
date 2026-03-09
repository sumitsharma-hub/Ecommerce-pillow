"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const rateLimit_middleware_1 = require("../../middlewares/rateLimit.middleware");
const router = (0, express_1.Router)();
// New flow
router.post("/identify", rateLimit_middleware_1.authLimiter, auth_controller_1.identify);
router.post("/login", rateLimit_middleware_1.authLimiter, auth_controller_1.login);
router.post("/send-otp", rateLimit_middleware_1.otpLimiter, auth_controller_1.sendLoginOtp);
router.post("/verify-otp", rateLimit_middleware_1.authLimiter, auth_controller_1.verifyLoginOtp);
router.post("/create-account", rateLimit_middleware_1.authLimiter, auth_controller_1.createAccount);
// Password reset flow
router.post("/forgot-password", auth_controller_1.forgotPassword);
router.post("/verify-reset-otp", rateLimit_middleware_1.authLimiter, auth_controller_1.verifyResetOtp);
router.post("/reset-password", rateLimit_middleware_1.authLimiter, auth_controller_1.resetPassword);
exports.default = router;
