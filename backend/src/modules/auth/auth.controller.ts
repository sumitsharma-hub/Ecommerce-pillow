import { Request, Response } from "express";
import {
  identifyUser,
  loginWithPassword,
  forgotPasswordService,
  resetPasswordService,
  verifyResetOtpService,
  verifyLoginOtpService,
  sendLoginOtpService,
  createAccountAfterOtp,
} from "./auth.service";

// Step 1: Identify user (email or phone entered, Continue clicked)
export const identify = async (req: Request, res: Response) => {
  try {
    const result = await identifyUser(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Step 2a: Password login
export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginWithPassword(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

// Step 2b: Send OTP for login
export const sendLoginOtp = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.body;
    const result = await sendLoginOtpService(identifier);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Step 3: Verify Login OTP
export const verifyLoginOtp = async (req: Request, res: Response) => {
  try {
    const result = await verifyLoginOtpService(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Step 4: Create account after OTP verification
export const createAccount = async (req: Request, res: Response) => {
  try {
    const result = await createAccountAfterOtp(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Forgot password flow
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { identifier, setNewPassword } = req.body;
    const result = await forgotPasswordService(identifier, setNewPassword);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyResetOtp = async (req: Request, res: Response) => {
  try {
    const { identifier, otp, sessionId } = req.body;
    const result = await verifyResetOtpService({ identifier, otp, sessionId });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { identifier, otp, password, sessionId } = req.body;
    const result = await resetPasswordService({
      identifier,
      otp,
      password,
      sessionId,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
