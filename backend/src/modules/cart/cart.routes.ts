import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { addToCart, buyNow } from "./cart.controller";

const router = Router();

router.use(authMiddleware);

router.post("/add", addToCart);
router.post("/buy-now", buyNow);

export default router;
