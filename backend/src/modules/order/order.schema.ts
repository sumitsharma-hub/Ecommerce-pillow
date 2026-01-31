import { z } from "zod";

export const placeOrderSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  address: z.string().min(5),
  paymentMethod: z.enum(["COD", "UPI"]),
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number().min(1),
    })
  ).min(1),
});

export const razorpayCreateSchema = z.object({
  orderId: z.number(),
});

export const razorpayVerifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});
