"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = getAllProducts;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getProductByCode = getProductByCode;
// Product Service
const prisma_1 = __importDefault(require("../../prisma"));
const idGenerator_util_1 = require("../../utils/idGenerator.util");
function getAllProducts() {
    return prisma_1.default.product.findMany({
        where: { isActive: true },
        select: {
            id: true,
            productCode: true, // ✅ REQUIRED
            name: true,
            description: true,
            price: true,
            category: true,
            images: {
                orderBy: { position: "asc" },
            },
        },
    });
}
function createProduct(data) {
    return prisma_1.default.product.create({
        data: {
            productCode: (0, idGenerator_util_1.generateProductCode)(),
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
            images: {
                create: data.images.map((url, index) => ({
                    url,
                    position: index,
                })),
            },
        },
        include: {
            images: true,
        },
    });
}
function updateProduct(id, data) {
    const { images, ...productData } = data;
    return prisma_1.default.product.update({
        where: { id },
        data: {
            ...productData,
            images: images
                ? {
                    deleteMany: {}, // remove old images
                    create: images.map((url, index) => ({
                        url,
                        position: index,
                    })),
                }
                : undefined,
        },
        include: {
            images: true,
        },
    });
}
function deleteProduct(id) {
    return prisma_1.default.product.delete({
        where: { id },
    });
}
function getProductByCode(productCode) {
    return prisma_1.default.product.findUnique({
        where: { productCode },
        include: {
            images: {
                orderBy: { position: "asc" },
            },
        },
    });
}
