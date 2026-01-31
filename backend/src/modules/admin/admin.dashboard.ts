import prisma from "../../prisma";

export async function getRecentActivities(limit = 10) {
  const [orders, users, audits] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        orderNumber: true,
        paymentStatus: true,
        createdAt: true,
      },
    }),

    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        email: true,
        createdAt: true,
      },
    }),

    prisma.adminAuditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        action: true,
        createdAt: true,
      },
    }),
  ]);

  const activities = [
    ...orders.map((o) => ({
      id: o.orderNumber,
      type: o.paymentStatus === "PAID" ? "payment" : "order",
      title:
        o.paymentStatus === "PAID"
          ? "Payment received"
          : "New order placed",
      subtitle: `Order #${o.orderNumber}`,
      createdAt: o.createdAt,
    })),

    ...users.map((u) => ({
      id: u.email,
      type: "user",
      title: "New user registered",
      subtitle: u.email,
      createdAt: u.createdAt,
    })),

    ...audits.map((a, i) => ({
      id: String(i),
      type: "product",
      title: a.action,
      subtitle: "Admin action",
      createdAt: a.createdAt,
    })),
  ];

  return activities
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}
