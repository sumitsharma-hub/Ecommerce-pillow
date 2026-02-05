"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const authOptional_middleware_1 = require("../../middlewares/authOptional.middleware");
const order_controller_2 = require("./order.controller");
const order_controller_3 = require("./order.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const rateLimit_middleware_1 = require("../../middlewares/rateLimit.middleware");
const router = (0, express_1.Router)();
// guest OR logged-in
router.post("/", authOptional_middleware_1.authMiddlewareOptional, rateLimit_middleware_1.writeLimiter, order_controller_1.placeOrder);
router.post("/payments/create-order", order_controller_2.createRazorpayOrder);
router.post("/payments/verify", order_controller_2.verifyPayment);
router.get("/:id/shipping-slip", auth_middleware_1.authMiddleware, order_controller_3.downloadShippingSlip);
router.get("/my", auth_middleware_1.authMiddleware, order_controller_1.getMyOrders);
exports.default = router;
