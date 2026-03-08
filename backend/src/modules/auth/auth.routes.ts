import { Router } from "express";
import {
  identify,
  login,
  forgotPassword,
  resetPassword,
  verifyResetOtp,
  verifyLoginOtp,
  sendLoginOtp,
  createAccount,
} from "./auth.controller";
import {
  authLimiter,
  forgotPasswordLimiter,
  otpLimiter,
} from "../../middlewares/rateLimit.middleware";

const router = Router();

// New flow
router.post("/identify", authLimiter, identify);
router.post("/login", authLimiter, login);
router.post("/send-otp", otpLimiter, sendLoginOtp);
router.post("/verify-otp", authLimiter, verifyLoginOtp);
router.post("/create-account", authLimiter, createAccount);

// Password reset flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", authLimiter, verifyResetOtp);
router.post("/reset-password", authLimiter, resetPassword);

export default router;