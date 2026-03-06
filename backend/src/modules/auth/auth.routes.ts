// Auth Routes
import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyResetOtp,
} from "./auth.controller";
import {
  authLimiter,
  forgotPasswordLimiter,
} from "../../middlewares/rateLimit.middleware";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

export default router;
