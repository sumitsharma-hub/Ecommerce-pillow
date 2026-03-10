"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShippingSlip = generateShippingSlip;
const pdfkit_1 = __importDefault(require("pdfkit"));
function generateShippingSlip(order) {
    const doc = new pdfkit_1.default({
        size: [288, 432], // 4x6 inches standard label
        margin: 0,
    });
    const W = 288;
    const pad = 18;
    const innerW = W - pad * 2;
    const green = "#15803d";
    const dark = "#111827";
    const gray = "#6b7280";
    const lightGray = "#d1d5db";
    const bgGreen = "#f0fdf4";
    // ─────────────────────────────────────────
    // BRAND HEADER
    // ─────────────────────────────────────────
    doc.rect(0, 0, W, 50).fill(green);
    doc
        .font("Helvetica-Bold")
        .fontSize(13)
        .fillColor("#ffffff")
        .text("NATURAL PLUS AYURVEDA", pad, 12, {
        width: innerW,
        align: "center",
    });
    doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor("#bbf7d0")
        .text("Shipping Label", pad, 30, {
        width: innerW,
        align: "center",
    });
    // ─────────────────────────────────────────
    // HELPER: dashed line
    // ─────────────────────────────────────────
    const dashedLine = (y) => {
        doc.save().strokeColor(lightGray).lineWidth(0.5);
        for (let x = pad; x < W - pad; x += 6) {
            doc.moveTo(x, y).lineTo(x + 3, y).stroke();
        }
        doc.restore();
    };
    // ─────────────────────────────────────────
    // FROM SECTION
    // ─────────────────────────────────────────
    let y = 62;
    doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(green)
        .text("FROM", pad, y);
    y += 13;
    doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(dark)
        .text("Natural Plus Ayurveda Pvt. Ltd.", pad, y);
    y += 13;
    doc
        .font("Helvetica")
        .fontSize(7.5)
        .fillColor(gray)
        .text("Mehsana, Gujarat – 384002, India", pad, y);
    // ─────────────────────────────────────────
    // DIVIDER
    // ─────────────────────────────────────────
    y += 18;
    doc
        .moveTo(pad, y)
        .lineTo(W - pad, y)
        .strokeColor(dark)
        .lineWidth(1.5)
        .stroke();
    // ─────────────────────────────────────────
    // TO SECTION (boxed)
    // ─────────────────────────────────────────
    y += 10;
    doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(green)
        .text("SHIP TO", pad, y);
    y += 14;
    const toBoxTop = y - 4;
    const toBoxHeight = 74;
    // Light green background box
    doc
        .roundedRect(pad - 2, toBoxTop, innerW + 4, toBoxHeight, 4)
        .fill(bgGreen);
    // Border
    doc
        .roundedRect(pad - 2, toBoxTop, innerW + 4, toBoxHeight, 4)
        .strokeColor(green)
        .lineWidth(1)
        .stroke();
    doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor(dark)
        .text((order.name || "CUSTOMER").toUpperCase(), pad + 6, toBoxTop + 8, {
        width: innerW - 12,
    });
    if (order.phone) {
        doc
            .font("Helvetica")
            .fontSize(8)
            .fillColor(dark)
            .text(order.phone, pad + 6, toBoxTop + 24, { width: innerW - 12 });
    }
    doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(dark)
        .text(order.address || "", pad + 6, toBoxTop + (order.phone ? 38 : 26), {
        width: innerW - 12,
        lineGap: 2,
    });
    // ─────────────────────────────────────────
    // ORDER DETAILS
    // ─────────────────────────────────────────
    y = toBoxTop + toBoxHeight + 14;
    dashedLine(y);
    y += 12;
    doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(green)
        .text("ORDER DETAILS", pad, y);
    y += 16;
    const labelX = pad;
    const valueX = pad + 90;
    const drawRow = (label, value, rowY) => {
        doc
            .font("Helvetica")
            .fontSize(7.5)
            .fillColor(gray)
            .text(label, labelX, rowY);
        doc
            .font("Helvetica-Bold")
            .fontSize(8.5)
            .fillColor(dark)
            .text(value, valueX, rowY, { width: innerW - 90 });
    };
    drawRow("Order ID:", `#${order.id}`, y);
    y += 16;
    drawRow("Item:", order.itemName || "—", y);
    y += 16;
    drawRow("Payment:", (order.paymentMode || "N/A").toUpperCase(), y);
    // ─────────────────────────────────────────
    // BOTTOM FOOTER BAR
    // ─────────────────────────────────────────
    const footerH = 32;
    const footerY = 432 - footerH;
    doc.rect(0, footerY, W, footerH).fill(bgGreen);
    doc
        .font("Helvetica")
        .fontSize(6)
        .fillColor(gray)
        .text("www.naturalplusayurveda.com", pad, footerY + 7, {
        width: innerW,
        align: "center",
    });
    return doc;
}
