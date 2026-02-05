import { Router } from "express";
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} from "./product.controller";

import { authMiddleware } from "../auth/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate";
import { createProductSchema, updateProductSchema } from "./product.schema";

const router = Router();

/** PUBLIC */
router.get("/", listProducts);

/** ADMIN */
router.post("/", authMiddleware, requireRole("ADMIN"), validate(createProductSchema), createProduct);
router.put("/:id", authMiddleware, requireRole("ADMIN"), validate(updateProductSchema), updateProduct);
router.delete("/:id", authMiddleware, requireRole("ADMIN"), deleteProduct);
router.get("/:productCode", getProductDetails);


export default router;

