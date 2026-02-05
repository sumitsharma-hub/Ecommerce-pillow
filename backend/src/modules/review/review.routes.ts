import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { getProductReviews, createReview, updateReview, deleteReview, canUserReview } from "./review.controller";

const router = Router();

router.get("/:productId", getProductReviews);
router.post("/:productId", authMiddleware, createReview);
router.put("/edit/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);
router.get("/can-review/:productId", authMiddleware, canUserReview);



export default router;
