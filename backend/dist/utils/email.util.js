"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrderConfirmationEmail = sendOrderConfirmationEmail;
const orderConfirmation_1 = require("./emailTemplates/orderConfirmation");
const mailer_util_1 = require("../utils/mailer.util");
async function sendOrderConfirmationEmail(to, orderNumber, amount, name) {
    if (!to)
        return;
    const { subject, html } = (0, orderConfirmation_1.orderConfirmationTemplate)({
        orderNumber,
        amount,
        name,
    });
    try {
        await mailer_util_1.transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        });
        console.log(`📧 Order confirmation sent to ${to}`);
    }
    catch (err) {
        // ❗ IMPORTANT: never throw
        console.error("❌ Failed to send email:", err.message);
    }
}
