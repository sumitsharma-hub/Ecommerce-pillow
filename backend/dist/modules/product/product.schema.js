"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    price: zod_1.z.number().positive(),
    category: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
});
exports.updateProductSchema = exports.createProductSchema.partial();
