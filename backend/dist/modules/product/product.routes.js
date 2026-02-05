"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validate_1 = require("../../middlewares/validate");
const product_schema_1 = require("./product.schema");
const router = (0, express_1.Router)();
/** PUBLIC */
router.get("/", product_controller_1.listProducts);
/** ADMIN */
router.post("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)("ADMIN"), (0, validate_1.validate)(product_schema_1.createProductSchema), product_controller_1.createProduct);
router.put("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)("ADMIN"), (0, validate_1.validate)(product_schema_1.updateProductSchema), product_controller_1.updateProduct);
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)("ADMIN"), product_controller_1.deleteProduct);
router.get("/:productCode", product_controller_1.getProductDetails);
exports.default = router;
