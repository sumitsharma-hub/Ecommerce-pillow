// Mail Utility
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true only for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Optional: verify on startup
export async function verifyMailer() {
  try {
    await transporter.verify();
    console.log("📧 Mail server is ready");
  } catch (err) {
    console.error("❌ Mail server error:", err);
  }
}
