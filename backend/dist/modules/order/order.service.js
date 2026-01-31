"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
// Order Service
const prisma_1 = __importDefault(require("../../prisma"));
const idGenerator_util_1 = require("../../utils/idGenerator.util");
async function createOrder(data) {
    const products = await prisma_1.default.product.findMany({
        where: {
            id: { in: data.items.map(i => i.productId) },
        },
    });
    let totalAmount = 0;
    const orderItems = data.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        totalAmount += product.price * item.quantity;
        return {
            productId: product.id,
            quantity: item.quantity,
            price: product.price,
        };
    });
    return prisma_1.default.order.create({
        data: {
            orderNumber: (0, idGenerator_util_1.generateOrderNumber)(),
            userId: data.userId,
            name: data.name,
            phone: data.phone,
            address: data.address,
            paymentMethod: data.paymentMethod,
            totalAmount,
            items: {
                create: orderItems,
            },
        },
        include: {
            items: true,
        },
    });
}
