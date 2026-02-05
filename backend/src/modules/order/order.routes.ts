import { Router } from "express";
import { getMyOrders, placeOrder } from "./order.controller";
import { authMiddlewareOptional } from "../../middlewares/authOptional.middleware";
import {
  createRazorpayOrder,
  verifyPayment,
} from "./order.controller";
import { downloadShippingSlip } from "./order.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { writeLimiter } from "../../middlewares/rateLimit.middleware";

const router = Router();

// guest OR logged-in
router.post("/", authMiddlewareOptional, writeLimiter, placeOrder);
router.post("/payments/create-order", createRazorpayOrder);
router.post("/payments/verify", verifyPayment);
router.get("/:id/shipping-slip", authMiddleware, downloadShippingSlip);
router.get("/my", authMiddleware, getMyOrders);


export default router;
