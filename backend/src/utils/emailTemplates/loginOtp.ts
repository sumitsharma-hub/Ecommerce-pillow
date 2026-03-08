export const loginOtpTemplate = (otp: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 480px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #15803d, #166534); padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 22px; }
        .body { padding: 30px; text-align: center; }
        .otp-box { background: #f0fdf4; border: 2px dashed #15803d; border-radius: 10px; padding: 20px; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #15803d; letter-spacing: 8px; }
        .footer { padding: 20px; text-align: center; color: #999; font-size: 12px; }
        p { color: #555; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Login Verification</h1>
        </div>
        <div class="body">
          <p>Use the OTP below to verify your identity:</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <p>This OTP is valid for <strong>5 minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; Natural Plus. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};