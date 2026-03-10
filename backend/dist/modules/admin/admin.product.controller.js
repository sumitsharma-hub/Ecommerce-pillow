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
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const ProductService = __importStar(require("../product/product.service"));
const prisma_1 = __importDefault(require("../../prisma"));
const idGenerator_util_1 = require("../../utils/idGenerator.util");
async function createProduct(req, res) {
    const { name, price, mrp, category, description, ingredients } = req.body;
    if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
        return res.status(400).json({ message: "At least one image is required" });
    }
    const imageUrls = req.files.map((file) => {
        const f = file;
        return `/uploads/products/${f.filename}`;
    });
    const product = await prisma_1.default.product.create({
        data: {
            productCode: (0, idGenerator_util_1.generateProductCode)(),
            name,
            price: Number(price),
            mrp: mrp ? Number(mrp) : undefined,
            category,
            description,
            ingredients,
            images: {
                create: imageUrls.map((url, index) => ({
                    url,
                    position: index,
                })),
            },
        },
        include: { images: true },
    });
    res.json(product);
}
async function updateProduct(req, res) {
    const productId = Number(req.params.id);
    const { name, price, mrp, category, description, ingredients } = req.body;
    let imageOps = {};
    // Handle existingImageIds — keep specified images, add new uploads
    const existingImageIds = req.body.existingImageIds;
    const parsedExistingIds = Array.isArray(existingImageIds)
        ? existingImageIds.map(Number)
        : existingImageIds
            ? [Number(existingImageIds)]
            : [];
    if (req.files && req.files instanceof Array && req.files.length > 0) {
        const imageUrls = req.files.map((file) => {
            const f = file;
            return `/uploads/products/${f.filename}`;
        });
        // Get the max position from existing images
        const existingCount = parsedExistingIds.length;
        imageOps = {
            images: {
                deleteMany: parsedExistingIds.length
                    ? { id: { notIn: parsedExistingIds } }
                    : {},
                create: imageUrls.map((url, index) => ({
                    url,
                    position: existingCount + index,
                })),
            },
        };
    }
    else if (parsedExistingIds.length > 0) {
        // No new files, but existing image IDs specified — delete ones not in the list
        imageOps = {
            images: {
                deleteMany: { id: { notIn: parsedExistingIds } },
            },
        };
    }
    const product = await prisma_1.default.product.update({
        where: { id: productId },
        data: {
            name,
            price: Number(price),
            mrp: mrp ? Number(mrp) : undefined,
            category,
            description,
            ingredients,
            ...imageOps,
        },
        include: { images: true },
    });
    res.json(product);
}
async function deleteProduct(req, res) {
    await ProductService.deleteProduct(Number(req.params.id));
    res.json({ message: "Product deleted" });
}
