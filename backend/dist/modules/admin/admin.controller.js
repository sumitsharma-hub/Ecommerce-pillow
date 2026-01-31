"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = getAllOrders;
exports.getDashboardStats = getDashboardStats;
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
