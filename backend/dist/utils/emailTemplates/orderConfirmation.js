"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderConfirmationTemplate = orderConfirmationTemplate;
function orderConfirmationTemplate(params) {
    return {
        subject: `Order #${params.orderNumber} confirmed 🎉`,
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>Hi ${params.name},</h2>
        <p>Thank you for your order!</p>

        <p>
          <strong>Order ID:</strong> ${params.orderNumber}<br/>
          <strong>Total Amount:</strong> ₹${params.amount}
        </p>

        <p>
          We’ll notify you once your order is shipped.
        </p>

        <br/>
        <p>— Natural Plus Ayurveda, Team</p>
      </div>
    `,
    };
}
