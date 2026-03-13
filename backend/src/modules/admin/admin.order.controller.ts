import { Request, Response } from "express";
import prisma from "../../prisma";
import { sendTrackingUpdateEmail } from "../../utils/email.util";

export async function getAllOrders(req: Request, res: Response) {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
      tracking: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(orders);
}

export async function updateTracking(req: Request, res: Response) {
  const { orderId, courierName, trackingNumber, status } = req.body;

  let id = orderId;

  if (typeof orderId === "string") {
    const order = await prisma.order.findFirst({
      where: { orderNumber: orderId },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    id = order.id;
  }

  const tracking = await prisma.tracking.upsert({
    where: { orderId: id },
    update: { courierName, trackingNumber, status },
    create: { orderId: id, courierName, trackingNumber, status },
  });

  // Fetch order to send email
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  const email = order?.email || order?.user?.email;
  const name = order?.name || order?.user?.name || "Valued Customer";

  if (email) {
    await sendTrackingUpdateEmail(email, {
      orderNumber: order?.orderNumber,
      name,
      courierName,
      trackingNumber,
      status,
      email
    });
  }

  res.json({ message: "Tracking updated", tracking });
}

export async function updateOrderStatus(req: Request, res: Response) {
  const orderId = Number(req.params.orderId);
  const { status } = req.body;

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: status },
  });

  res.json({ message: "Order status updated" });
}

export async function updateOrderTracking(req: Request, res: Response) {
  const orderId = Number(req.params.orderId);
  const { courierName, trackingNumber, status } = req.body;

  const tracking = await prisma.tracking.upsert({
    where: { orderId },
    update: { courierName, trackingNumber, status },
    create: { orderId, courierName, trackingNumber, status },
  });

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  const email = order?.email || order?.user?.email;
  const name = order?.name || order?.user?.name || "Valued Customer";

  if (email) {
    await sendTrackingUpdateEmail(email, {
      orderNumber: order?.orderNumber,
      name,
      courierName,
      trackingNumber,
      status,
      email
    });
  }

  res.json(tracking);
}
