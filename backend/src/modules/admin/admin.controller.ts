// Admin Controller
import { Request, Response } from "express";
import prisma from "../../prisma";
import { getRecentActivities } from "./admin.dashboard";

// export async function getDashboardStats(_req: Request, res: Response) {
//   const totalUsers = await prisma.user.count();
//   const totalOrders = await prisma.order.count();

//   res.json({
//     totalUsers,
//     totalOrders,
//   });
// }

export async function getAllOrders(_req: Request, res: Response) {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(orders);
}

export async function getDashboardStats(req: Request, res: Response) {
  const [
    totalOrders,
    revenue,
    totalUsers,
    pendingOrders,
    recentActivity,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: "PAID" },
    }),
    prisma.user.count(),
    prisma.order.count({
      where: { paymentStatus: "PENDING" },
    }),
    getRecentActivities(8),
  ]);

  res.json({
    totalOrders,
    revenue: revenue._sum.totalAmount ?? 0,
    totalUsers,
    pendingOrders,
    recentActivity,
  });
}

export async function getOrderDetails(req: Request, res: Response) {
  const orderId = Number(req.params.orderId);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
              images: {
                take: 1,
                orderBy: { position: "asc" },
              },
            },
          },
        },
      },
      tracking: true,
    },
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
}

