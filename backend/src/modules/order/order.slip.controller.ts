import { Request, Response } from "express";
import prisma from "../../prisma";
import type { Prisma } from "@prisma/client";

type OrderSlip = Prisma.OrderGetPayload<{
  include: {
    items: true; // or: items: { include: { product: true } } if your schema actually has a product relation on OrderItem
    user: { select: { name: true; phone: true } };
  };
}>;

export async function getOrderSlip(req: Request, res: Response) {
  const order = (await prisma.order.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      items: true,
      user: { select: { name: true, phone: true } },
    },
  })) as OrderSlip | null;

  if (!order) return res.status(404).json({ error: "Order not found" });

  res.json({
    from: "Pillow Store, Mumbai",
    to: {
      name: order.user?.name,
      phone: order.user?.phone,
      address: order.address,
    },
    items: order.items,
  });
}