import { orderConfirmationTemplate } from "./emailTemplates/orderConfirmation";
import { transporter } from "../utils/mailer.util";
import { passwordResetTemplate } from "./emailTemplates/passwordReset";
export async function sendOrderConfirmationEmail(
  to: string,
  orderNumber: string,
  amount: number,
  name: string
) {
  if (!to) return;

  const { subject, html } = orderConfirmationTemplate({
    orderNumber,
    amount,
    name,
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log(`📧 Order confirmation sent to ${to}`);
  } catch (err: any) {
    // ❗ IMPORTANT: never throw
    console.error("❌ Failed to send email:", err.message);
  }
}

export async function sendPasswordResetEmail(email: string, otp: string) {
  await transporter.sendMail({
    to: email,
    subject: "Password Reset OTP",
    html: passwordResetTemplate(otp)
  });
}