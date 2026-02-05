"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Admin Routes
const express_1 = require("express");
const auth_middleware_1 = require("../auth/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const admin_controller_1 = require("./admin.controller");
const admin_product_controller_1 = require("./admin.product.controller");
const admin_order_controller_1 = require("./admin.order.controller");
const order_controller_1 = require("../order/order.controller");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const router = (0, express_1.Router)();
// All admin routes are protected
router.use(auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)("ADMIN"));
router.get("/dashboard", admin_controller_1.getDashboardStats);
// order
router.get("/orders", admin_order_controller_1.getAllOrders);
router.get("/orders/:id/slip", order_controller_1.downloadShippingSlip);
router.put("/orders/:orderId/tracking", admin_order_controller_1.updateTracking);
// product
router.post("/products", upload_middleware_1.upload.array("images", 6), admin_product_controller_1.createProduct);
router.put("/products/:id", upload_middleware_1.upload.array("images", 6), admin_product_controller_1.updateProduct);
router.delete("/products/:id", admin_product_controller_1.deleteProduct);
router.post("/orders/tracking", admin_order_controller_1.updateTracking);
router.get("/orders/:orderId", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)("ADMIN"), admin_controller_1.getOrderDetails);
exports.default = router;
