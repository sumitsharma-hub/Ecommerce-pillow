"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShippingSlip = generateShippingSlip;
const pdfkit_1 = __importDefault(require("pdfkit"));
function generateShippingSlip(order) {
    const doc = new pdfkit_1.default({ margin: 50 });
    doc.fontSize(18).text("Shipping Slip", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text("FROM:");
    doc.text("Pillow Store Pvt Ltd");
    doc.text("Delhi, India");
    doc.moveDown();
    doc.text("TO:");
    doc.text(order.name);
    doc.text(order.phone);
    doc.text(order.address);
    doc.moveDown();
    doc.text(`Order ID: ${order.id}`);
    doc.text(`Payment: ${order.paymentMethod}`);
    if (order.tracking) {
        doc.moveDown();
        doc.text(`Courier: ${order.tracking.courierName}`);
        doc.text(`Tracking No: ${order.tracking.trackingNumber}`);
    }
    return doc;
}
