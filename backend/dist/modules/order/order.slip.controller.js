"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderSlip = getOrderSlip;
const prisma_1 = __importDefault(require("../../prisma"));
async function getOrderSlip(req, res) {
    const order = (await prisma_1.default.order.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            items: true,
            user: { select: { name: true, phone: true } },
        },
    }));
    if (!order)
        return res.status(404).json({ error: "Order not found" });
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
