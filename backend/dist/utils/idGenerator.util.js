"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = generateOrderNumber;
exports.generateProductCode = generateProductCode;
function generateOrderNumber() {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const year = new Date().getFullYear();
    return `ORD-${year}-${random}`;
}
function generateProductCode() {
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `PIL-${random}`;
}
