"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrderConfirmationEmail = sendOrderConfirmationEmail;
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const orderConfirmation_1 = require("./emailTemplates/orderConfirmation");
const mailer_util_1 = require("../utils/mailer.util");
const passwordReset_1 = require("./emailTemplates/passwordReset");
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
async function sendPasswordResetEmail(email, otp) {
    await mailer_util_1.transporter.sendMail({
        to: email,
        subject: "Password Reset OTP",
        html: (0, passwordReset_1.passwordResetTemplate)(otp)
    });
}
