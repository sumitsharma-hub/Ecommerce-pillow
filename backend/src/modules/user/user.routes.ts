// User Routes
import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route",
    user: (req as any).user,
  });
});

export default router;
