"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpayVerifySchema = exports.razorpayCreateSchema = exports.placeOrderSchema = void 0;
const zod_1 = require("zod");
exports.placeOrderSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    phone: zod_1.z.string().min(10),
    address: zod_1.z.string().min(5),
    paymentMethod: zod_1.z.enum(["COD", "UPI"]),
    items: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.number(),
        quantity: zod_1.z.number().min(1),
    })).min(1),
});
exports.razorpayCreateSchema = zod_1.z.object({
    orderId: zod_1.z.number(),
});
exports.razorpayVerifySchema = zod_1.z.object({
    razorpay_order_id: zod_1.z.string(),
    razorpay_payment_id: zod_1.z.string(),
    razorpay_signature: zod_1.z.string(),
});
