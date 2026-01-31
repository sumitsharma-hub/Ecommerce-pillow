import { Request, Response } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import * as OrderService from "./order.service";
import prisma from "../../prisma";
import { razorpay } from "../../config/razorpay";
import crypto from "crypto";
import { generateShippingSlip } from "../../utils/shippingSlip.util";
import { sendOrderConfirmationEmail } from "../../utils/email.util";
import {
  placeOrderSchema,
  razorpayCreateSchema,
  razorpayVerifySchema,
} from "./order.schema";
/**
 * PLACE ORDER (COD or UPI)
 */
export async function placeOrder(req: AuthRequest, res: Response) {
  const parsed = placeOrderSchema.safeParse(req.body);

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
      const user = await prisma.user.findUnique({
        where: { id: order.userId },
      });

      if (user?.email) {
        await sendOrderConfirmationEmail(
          user.email,
          order.orderNumber,
          order.totalAmount,
          user.name
        );
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
export async function createRazorpayOrder(req: Request, res: Response) {
  const parsed = razorpayCreateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const { orderId } = parsed.data;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.paymentStatus === "PAID") {
    return res.status(400).json({ message: "Order already paid" });
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.totalAmount * 100),
    currency: "INR",
    receipt: `order_${order.id}`,
  });

  await prisma.order.update({
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
export async function verifyPayment(req: Request, res: Response) {
  const parsed = razorpayVerifySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payment data" });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    parsed.data;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment signature" });
  }

  const order = await prisma.order.findUnique({
    where: { razorpayOrderId: razorpay_order_id },
    include: { user: true },
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: "PAID",
      razorpayPaymentId: razorpay_payment_id,
    },
  });

  if (order.user?.email) {
    await sendOrderConfirmationEmail(
      order.user.email,
      order.orderNumber,
      order.totalAmount,
      order.user.name
    );
  }

  res.json({ message: "Payment verified successfully" });
}

/**
 * DOWNLOAD SHIPPING SLIP (ADMIN / USER)
 */
export async function downloadShippingSlip(req: Request, res: Response) {
  const orderId = Number(req.params.id);

  if (!orderId) {
    return res.status(400).json({ message: "Invalid order id" });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { tracking: true },
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const doc = generateShippingSlip(order);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=order-${order.id}.pdf`
  );

  doc.pipe(res);
  doc.end();
}
