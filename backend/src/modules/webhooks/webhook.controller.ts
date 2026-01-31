import { Request, Response } from "express";
import crypto from "crypto";
import prisma from "../../prisma";

export async function razorpayWebhook(req: Request, res: Response) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const signature = req.headers["x-razorpay-signature"] as string;
  const body = req.body.toString(); // IMPORTANT

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({ message: "Invalid webhook signature" });
  }

  const payload = JSON.parse(body);

  if (payload.event === "payment.captured") {
    const payment = payload.payload.payment.entity;

    await prisma.order.updateMany({
      where: { razorpayOrderId: payment.order_id },
      data: {
        paymentStatus: "PAID",
        razorpayPaymentId: payment.id,
      },
    });
  }

  res.json({ status: "ok" });
}
