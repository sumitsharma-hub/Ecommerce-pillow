"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = getAllOrders;
exports.getDashboardStats = getDashboardStats;
exports.getOrderDetails = getOrderDetails;
const prisma_1 = __importDefault(require("../../prisma"));
const admin_dashboard_1 = require("./admin.dashboard");
// export async function getDashboardStats(_req: Request, res: Response) {
//   const totalUsers = await prisma.user.count();
//   const totalOrders = await prisma.order.count();
//   res.json({
//     totalUsers,
//     totalOrders,
//   });
// }
async function getAllOrders(_req, res) {
    const orders = await prisma_1.default.order.findMany({
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
async function getDashboardStats(req, res) {
    const [totalOrders, revenue, totalUsers, pendingOrders, recentActivity,] = await Promise.all([
        prisma_1.default.order.count(),
        prisma_1.default.order.aggregate({
            _sum: { totalAmount: true },
            where: { paymentStatus: "PAID" },
        }),
        prisma_1.default.user.count(),
        prisma_1.default.order.count({
            where: { paymentStatus: "PENDING" },
        }),
        (0, admin_dashboard_1.getRecentActivities)(8),
    ]);
    res.json({
        totalOrders,
        revenue: revenue._sum.totalAmount ?? 0,
        totalUsers,
        pendingOrders,
        recentActivity,
    });
}
async function getOrderDetails(req, res) {
    const orderId = Number(req.params.orderId);
    const order = await prisma_1.default.order.findUnique({
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
