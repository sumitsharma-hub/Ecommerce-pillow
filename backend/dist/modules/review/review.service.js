"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviews = getReviews;
exports.addReview = addReview;
exports.updateReview = updateReview;
exports.deleteReview = deleteReview;
const prisma_1 = __importDefault(require("../../prisma"));
function getReviews(productId) {
    return prisma_1.default.review.findMany({
        where: { productId },
        include: {
            user: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
    });
}
function addReview(data) {
    return prisma_1.default.review.create({
        data,
    });
}
// review.service.ts
async function updateReview(reviewId, userId, data) {
    const review = await prisma_1.default.review.findUnique({
        where: { id: reviewId },
    });
    if (!review || review.userId !== userId) {
        throw new Error("Unauthorized");
    }
    return prisma_1.default.review.update({
        where: { id: reviewId },
        data,
    });
}
async function deleteReview(reviewId, userId) {
    const review = await prisma_1.default.review.findUnique({
        where: { id: reviewId },
    });
    if (!review || review.userId !== userId) {
        throw new Error("Unauthorized");
    }
    return prisma_1.default.review.delete({
        where: { id: reviewId },
    });
}
