export function orderTrackingUpdateTemplate(params: {
  orderNumber: string;
  name: string;
  courierName: string;
  trackingNumber: string;
  status: string;
}) {
  const statusConfig: Record<string, { emoji: string; label: string; color: string; bg: string; message: string }> = {
    OUT_FOR_DELIVERY: {
      emoji: "🚚",
      label: "Out for Delivery",
      color: "#1d4ed8",
      bg: "#dbeafe",
      message: "Your order is on its way! Our delivery partner will deliver it to you today.",
    },
    DELIVERED: {
      emoji: "✅",
      label: "Delivered",
      color: "#15803d",
      bg: "#dcfce7",
      message: "Your order has been delivered successfully. We hope you love your products!",
    },
  };

  const config = statusConfig[params.status] ?? {
    emoji: "📦",
    label: params.status,
    color: "#374151",
    bg: "#f3f4f6",
    message: "Your order tracking details have been updated.",
  };

  return {
    subject: `Order #${params.orderNumber} — ${config.label} ${config.emoji}`,
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
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <!-- Green Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #15803d 0%, #166534 100%); padding:32px 32px 28px; text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="font-size:28px;line-height:1;">🌿</div>
                    <h1 style="margin:8px 0 0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">
                      Natural Plus Ayurveda
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Status Icon & Title -->
          <tr>
            <td style="padding:36px 32px 0;text-align:center;">
              <div style="width:64px;height:64px;margin:0 auto 16px;background-color:${config.bg};border-radius:50%;line-height:64px;font-size:32px;">
                ${config.emoji}
              </div>
              <h2 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#111827;">
                ${config.label}
              </h2>
              <p style="margin:0;font-size:14px;color:#6b7280;">
                Hi ${params.name}, ${config.message}
              </p>
            </td>
          </tr>

          <!-- Order + Tracking Details Card -->
          <tr>
            <td style="padding:28px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

                      <!-- Order ID -->
                      <tr>
                        <td style="padding-bottom:14px;border-bottom:1px solid #e5e7eb;">
                          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;font-weight:600;">Order ID</p>
                          <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#111827;">#${params.orderNumber}</p>
                        </td>
                      </tr>

                      <!-- Courier Name -->
                      <tr>
                        <td style="padding-top:14px;padding-bottom:14px;border-bottom:1px solid #e5e7eb;">
                          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;font-weight:600;">Courier</p>
                          <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#111827;">${params.courierName}</p>
                        </td>
                      </tr>

                      <!-- Tracking Number -->
                      <tr>
                        <td style="padding-top:14px;padding-bottom:14px;border-bottom:1px solid #e5e7eb;">
                          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;font-weight:600;">Tracking Number</p>
                          <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#111827;font-family:monospace;">${params.trackingNumber}</p>
                        </td>
                      </tr>

                      <!-- Status Badge -->
                      <tr>
                        <td style="padding-top:14px;">
                          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;font-weight:600;">Status</p>
                          <div style="margin-top:6px;display:inline-block;padding:4px 14px;background-color:${config.bg};border-radius:999px;">
                            <span style="font-size:13px;font-weight:700;color:${config.color};">${config.label}</span>
                          </div>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:28px 32px 0;text-align:center;">
              <a href="https://naturalplusayurveda.com/my-orders"
                 style="display:inline-block;padding:14px 36px;background-color:#15803d;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:10px;">
                View My Orders
              </a>
            </td>
          </tr>

          <!-- Help Text -->
          <tr>
            <td style="padding:24px 32px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Questions about your order? Contact us at
                <a href="mailto:support@naturalplusayurveda.com" style="color:#15803d;text-decoration:none;font-weight:600;">
                  support@naturalplusayurveda.com
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 32px 24px;text-align:center;border-top:1px solid #f3f4f6;margin-top:24px;">
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