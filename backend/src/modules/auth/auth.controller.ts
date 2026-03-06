// Auth Controller
import { Request, Response } from "express";
import { registerUser, loginUser, forgotPasswordService, resetPasswordService, verifyResetOtpService } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const result = await forgotPasswordService(req.body.email);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyResetOtp = async (req: Request, res: Response) => {
  try {
    const result = await verifyResetOtpService(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const result = await resetPasswordService(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};