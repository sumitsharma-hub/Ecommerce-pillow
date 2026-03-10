const escapeHtml = (input: string) =>
  String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const passwordResetTemplate = (otp: string) => {
  const safeOtp = escapeHtml(otp);

  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#166534;color:#ffffff;padding:16px 20px;">
                <div style="font-size:18px;font-weight:700;">Natural Plus Ayurveda</div>
                <div style="font-size:12px;opacity:.95;">Password Reset</div>
              </td>
            </tr>
            <tr>
              <td style="padding:22px;">
                <h2 style="margin:0 0 10px;color:#111827;font-size:20px;">Password Reset OTP</h2>
                <p style="margin:0 0 12px;color:#374151;font-size:14px;">Your OTP for password reset is:</p>

                <div style="padding:14px 16px;border:1px dashed #86efac;background:#f0fdf4;border-radius:10px;text-align:center;margin-bottom:12px;">
                  <span style="font-family:'Courier New',monospace;font-size:30px;letter-spacing:8px;font-weight:700;color:#14532d;">
                    ${safeOtp}
                  </span>
                </div>

                <p style="margin:0;color:#b45309;font-size:13px;">This OTP will expire in <strong>5 minutes</strong>.</p>
                <p style="margin:10px 0 0;color:#6b7280;font-size:13px;">If you did not request this, please ignore this email.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 20px;background:#f9fafb;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">
                Security tip: Never share this OTP with anyone.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
};