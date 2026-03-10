import { orderConfirmationTemplate } from "./emailTemplates/orderConfirmation";
import { transporter } from "../utils/mailer.util";
import { passwordResetTemplate } from "./emailTemplates/passwordReset";
import { loginOtpTemplate } from "./emailTemplates/loginOtp";
import { orderTrackingUpdateTemplate } from "./emailTemplates/orderTrackingUpdate";
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

export const sendOtpEmail = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@naturalplus.com",
    to: email,
    subject: "Your Login OTP",
    html: loginOtpTemplate(otp),
  });
};

export async function sendTrackingUpdateEmail(
  to: string,
  params: {
    orderNumber: string;
    name: string;
    courierName: string;
    trackingNumber: string;
    status: string;
  }
) {
  if (!to) return;

  const { subject, html } = orderTrackingUpdateTemplate(params);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log(`📧 Tracking update email sent to ${to} [${params.status}]`);
  } catch (err: any) {
    // ❗ Never throw — same pattern as order confirmation
    console.error("❌ Failed to send tracking update email:", err.message);
  }
}