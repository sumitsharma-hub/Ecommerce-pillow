"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCart = addToCart;
exports.buyNow = buyNow;
const prisma_1 = __importDefault(require("../../prisma"));
async function addToCart(userId, productId, quantity = 1) {
    return prisma_1.default.cartItem.upsert({
        where: {
            userId_productId: { userId, productId },
        },
        update: {
            quantity: { increment: quantity },
        },
        create: {
            userId: userId,
            productId: productId,
            quantity: quantity,
        },
    });
}
async function buyNow(userId, productId) {
    const product = await prisma_1.default.product.findUnique({
        where: { id: productId },
    });
    if (!product)
        throw new Error("Product not found");
    return {
        product,
        amount: product.price,
    };
}
