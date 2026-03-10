export function resetPasswordOtpTemplate(params: {
  name: string;
  otp: string;
}) {
  return {
    subject: "Password Reset OTP - Natural Plus Ayurveda",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <!-- Green Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #15803d 0%, #166534 100%); padding:28px 32px; text-align:center;">
              <div style="font-size:24px;line-height:1;">🌿</div>
              <h1 style="margin:6px 0 0;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">
                Natural Plus Ayurveda
              </h1>
            </td>
          </tr>

          <!-- Lock Icon & Title -->
          <tr>
            <td style="padding:36px 32px 0;text-align:center;">
              <div style="width:56px;height:56px;margin:0 auto 16px;background-color:#fef3c7;border-radius:50%;line-height:56px;font-size:26px;">
                🔒
              </div>
              <h2 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#111827;">
                Password Reset Request
              </h2>
              <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.5;">
                Hi <strong style="color:#374151;">${params.name}</strong>, we received a request to reset your password.
              </p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td style="padding:28px 32px 0;text-align:center;">
              <p style="margin:0 0 12px;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;font-weight:600;">
                Your One-Time Password
              </p>
              <div style="display:inline-block;background-color:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;padding:16px 40px;">
                <span style="font-size:32px;font-weight:800;letter-spacing:8px;color:#15803d;font-family:'Courier New',monospace;">
                  ${params.otp}
                </span>
              </div>
              <p style="margin:14px 0 0;font-size:13px;color:#ef4444;font-weight:600;">
                ⏱ Expires in 5 minutes
              </p>
            </td>
          </tr>

          <!-- Instructions -->
          <tr>
            <td style="padding:28px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#374151;">How to reset your password:</p>
                    <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.7;">
                      1. Enter the OTP shown above on the verification page.<br/>
                      2. Create a new strong password.<br/>
                      3. Log in with your new credentials.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding:24px 32px 0;text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffbeb;border-radius:10px;border:1px solid #fde68a;">
                <tr>
                  <td style="padding:12px 20px;">
                    <p style="margin:0;font-size:12px;color:#92400e;line-height:1.5;">
                      ⚠️ If you did not request this password reset, please ignore this email. Your account is safe and no changes have been made.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Help Text -->
          <tr>
            <td style="padding:24px 32px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Need help? Contact us at
                <a href="mailto:support@naturalplusayurveda.com" style="color:#15803d;text-decoration:none;font-weight:600;">
                  support@naturalplusayurveda.com
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 32px 24px;text-align:center;border-top:1px solid #f3f4f6;margin-top:20px;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#15803d;">Natural Plus Ayurveda</p>
              <p style="margin:0;font-size:11px;color:#9ca3af;">Mehsana, Gujarat – 384002, India</p>
              <p style="margin:8px 0 0;font-size:10px;color:#d1d5db;">© ${new Date().getFullYear()} Natural Plus Ayurveda. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };
}