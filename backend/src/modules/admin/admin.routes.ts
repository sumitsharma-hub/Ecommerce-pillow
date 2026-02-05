// Admin Routes
import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { getDashboardStats, getOrderDetails } from "./admin.controller";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "./admin.product.controller";
import { updateTracking, getAllOrders } from "./admin.order.controller";
import { downloadShippingSlip } from "../order/order.controller";
import { upload } from "../../middlewares/upload.middleware";

const router = Router();

// All admin routes are protected
router.use(authMiddleware, requireRole("ADMIN"));

router.get("/dashboard", getDashboardStats);
// order
router.get("/orders", getAllOrders);
router.get("/orders/:id/slip", downloadShippingSlip);
router.put("/orders/:orderId/tracking", updateTracking);

// product
router.post("/products", upload.array("images", 6), createProduct);

router.put("/products/:id", upload.array("images", 6), updateProduct);

router.delete("/products/:id", deleteProduct);
router.post("/orders/tracking", updateTracking);

router.get(
  "/orders/:orderId",
  authMiddleware,
  requireRole("ADMIN"),
  getOrderDetails,
);

export default router;
