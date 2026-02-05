"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductReviews = getProductReviews;
exports.createReview = createReview;
exports.updateReview = updateReview;
exports.deleteReview = deleteReview;
exports.canUserReview = canUserReview;
const prisma_1 = __importDefault(require("../../prisma"));
const ReviewService = __importStar(require("./review.service"));
async function getProductReviews(req, res) {
    const productId = Number(req.params.productId);
    const reviews = await prisma_1.default.review.findMany({
        where: { productId },
        include: {
            user: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
}
async function createReview(req, res) {
    const productId = Number(req.params.productId);
    const userId = req.user.id;
    const { rating, comment } = req.body;
    // ✅ rating validation
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    // ✅ purchase check (IMPORTANT)
    const hasPurchased = await prisma_1.default.orderItem.findFirst({
        where: {
            productId,
            order: {
                userId,
                paymentStatus: "PAID",
            },
        },
    });
    if (!hasPurchased) {
        return res.status(403).json({
            message: "Only verified buyers can review this product",
        });
    }
    const review = await prisma_1.default.review.create({
        data: {
            productId,
            userId,
            rating,
            comment,
        },
    });
    res.status(201).json(review);
}
async function updateReview(req, res) {
    const reviewId = Number(req.params.id);
    const userId = req.user.id;
    const review = await ReviewService.updateReview(reviewId, userId, req.body);
    res.json(review);
}
async function deleteReview(req, res) {
    const reviewId = Number(req.params.id);
    const userId = req.user.id;
    await ReviewService.deleteReview(reviewId, userId);
    res.json({ message: "Review deleted" });
}
// GET /reviews/can-review/:productId
async function canUserReview(req, res) {
    const productId = Number(req.params.productId);
    const userId = req.user.id;
    const hasPurchased = await prisma_1.default.orderItem.findFirst({
        where: {
            productId,
            order: {
                userId,
                paymentStatus: "PAID",
            },
        },
    });
    res.json({ canReview: !!hasPurchased });
}
