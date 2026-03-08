import { Router } from "express";
import { getProfile, updateProfile } from "./user.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

export default router;