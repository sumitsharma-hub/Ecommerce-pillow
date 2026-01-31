"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpayWebhook = razorpayWebhook;
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../../prisma"));
async function razorpayWebhook(req, res) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const body = req.body.toString(); // IMPORTANT
    const expectedSignature = crypto_1.default
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");
    if (signature !== expectedSignature) {
        return res.status(400).json({ message: "Invalid webhook signature" });
    }
    const payload = JSON.parse(body);
    if (payload.event === "payment.captured") {
        const payment = payload.payload.payment.entity;
        await prisma_1.default.order.updateMany({
            where: { razorpayOrderId: payment.order_id },
            data: {
                paymentStatus: "PAID",
                razorpayPaymentId: payment.id,
            },
        });
    }
    res.json({ status: "ok" });
}
