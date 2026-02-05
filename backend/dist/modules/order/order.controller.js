"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeOrder = placeOrder;
exports.createRazorpayOrder = createRazorpayOrder;
exports.verifyPayment = verifyPayment;
exports.downloadShippingSlip = downloadShippingSlip;
exports.getMyOrders = getMyOrders;
const OrderService = __importStar(require("./order.service"));
const prisma_1 = __importDefault(require("../../prisma"));
const razorpay_1 = require("../../config/razorpay");
const crypto_1 = __importDefault(require("crypto"));
const shippingSlip_util_1 = require("../../utils/shippingSlip.util");
const email_util_1 = require("../../utils/email.util");
const order_schema_1 = require("./order.schema");
/**
 * PLACE ORDER (COD or UPI)
 */
async function placeOrder(req, res) {
    const parsed = order_schema_1.placeOrderSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: "Invalid order data",
            errors: parsed.error.issues.map((i) => i.message),
        });
    }
    const { name, phone, address, paymentMethod, items } = parsed.data;
    const order = await OrderService.createOrder({
        userId: req.user?.id,
        name,
        phone,
        address,
        paymentMethod,
        items,
    });
    // COD → order is complete immediately
    if (paymentMethod === "COD") {
        if (order.userId) {
            const user = await prisma_1.default.user.findUnique({
                where: { id: order.userId },
            });
            if (user?.email) {
                await (0, email_util_1.sendOrderConfirmationEmail)(user.email, order.orderNumber, order.totalAmount, user.name);
            }
        }
        return res.json({
            message: "Order placed successfully (Cash on Delivery)",
            orderId: order.id,
        });
    }
    // UPI → frontend will call createRazorpayOrder next
    return res.json({
        message: "Order created, proceed to payment",
        orderId: order.id,
    });
}
/**
 * CREATE RAZORPAY ORDER
 */
async function createRazorpayOrder(req, res) {
    const parsed = order_schema_1.razorpayCreateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request" });
    }
    const { orderId } = parsed.data;
    const order = await prisma_1.default.order.findUnique({
        where: { id: orderId },
    });
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    if (order.paymentStatus === "PAID") {
        return res.status(400).json({ message: "Order already paid" });
    }
    const razorpayOrder = await razorpay_1.razorpay.orders.create({
        amount: Math.round(order.totalAmount * 100),
        currency: "INR",
        receipt: `order_${order.id}`,
    });
    await prisma_1.default.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: razorpayOrder.id },
    });
    res.json({
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
    });
}
/**
 * VERIFY RAZORPAY PAYMENT
 */
async function verifyPayment(req, res) {
    const parsed = order_schema_1.razorpayVerifySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid payment data" });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;
    const expectedSignature = crypto_1.default
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
    if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid payment signature" });
    }
    const order = await prisma_1.default.order.findUnique({
        where: { razorpayOrderId: razorpay_order_id },
        include: { user: true },
    });
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    await prisma_1.default.order.update({
        where: { id: order.id },
        data: {
            paymentStatus: "PAID",
            razorpayPaymentId: razorpay_payment_id,
        },
    });
    if (order.user?.email) {
        await (0, email_util_1.sendOrderConfirmationEmail)(order.user.email, order.orderNumber, order.totalAmount, order.user.name);
    }
    res.json({ message: "Payment verified successfully" });
}
/**
 * DOWNLOAD SHIPPING SLIP (ADMIN / USER)
 */
async function downloadShippingSlip(req, res) {
    const orderId = Number(req.params.id);
    if (!orderId) {
        return res.status(400).json({ message: "Invalid order id" });
    }
    const order = await prisma_1.default.order.findUnique({
        where: { id: orderId },
        include: { tracking: true },
    });
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    const doc = (0, shippingSlip_util_1.generateShippingSlip)(order);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=order-${order.id}.pdf`);
    doc.pipe(res);
    doc.end();
}
/**
 * GET MY ORDERS (USER)
 */
async function getMyOrders(req, res) {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const orders = await prisma_1.default.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            tracking: true,
            items: {
                include: {
                    product: {
                        select: {
                            name: true,
                            images: { take: 1 },
                        },
                    },
                },
            },
        },
    });
    res.json(orders);
}
