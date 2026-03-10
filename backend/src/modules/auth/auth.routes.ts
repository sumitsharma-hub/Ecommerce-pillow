// auth.routes.ts

import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "./auth.controller";
import { authLimiter, forgotPasswordLimiter } from "../../middlewares/rateLimit.middleware";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/verify-reset-otp", authLimiter, verifyResetOtp);
router.post("/reset-password", authLimiter, resetPassword);

export default router;