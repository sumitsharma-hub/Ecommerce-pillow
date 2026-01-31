"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = getAllOrders;
exports.updateTracking = updateTracking;
exports.updateOrderStatus = updateOrderStatus;
exports.updateOrderTracking = updateOrderTracking;
const prisma_1 = __importDefault(require("../../prisma"));
async function getAllOrders(req, res) {
    const orders = await prisma_1.default.order.findMany({
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
async function updateTracking(req, res) {
    const { orderId, courierName, trackingNumber, status } = req.body;
    let id = orderId;
    if (typeof orderId === "string") {
        const order = await prisma_1.default.order.findFirst({
            where: { orderNumber: orderId },
        });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        console.log('this is order', order);
        id = order.id;
    }
    const tracking = await prisma_1.default.tracking.upsert({
        where: { orderId: id },
        update: { courierName, trackingNumber, status },
        create: { orderId: id, courierName, trackingNumber, status },
    });
    console.log('this is tracking', tracking);
    res.json({ message: "Tracking updated", tracking });
}
async function updateOrderStatus(req, res) {
    const orderId = Number(req.params.orderId);
    const { status } = req.body;
    await prisma_1.default.order.update({
        where: { id: orderId },
        data: { paymentStatus: status },
    });
    res.json({ message: "Order status updated" });
}
async function updateOrderTracking(req, res) {
    const orderId = Number(req.params.orderId);
    const { courierName, trackingNumber, status } = req.body;
    const tracking = await prisma_1.default.tracking.upsert({
        where: { orderId },
        update: { courierName, trackingNumber, status },
        create: { orderId, courierName, trackingNumber, status },
    });
    res.json(tracking);
}
