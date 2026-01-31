"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
exports.verifyMailer = verifyMailer;
// Mail Utility
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true only for port 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
// Optional: verify on startup
async function verifyMailer() {
    try {
        await exports.transporter.verify();
        console.log("📧 Mail server is ready");
    }
    catch (err) {
        console.error("❌ Mail server error:", err);
    }
}
