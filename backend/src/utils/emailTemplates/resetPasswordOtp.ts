export function resetPasswordOtpTemplate(params: {
  name: string;
  otp: string;
}) {
  return {
    subject: "Password Reset OTP - Natural Plus Ayurveda",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>Hi ${params.name},</h2>

        <p>You requested to reset your password.</p>

        <p>Your OTP is:</p>

        <h1 style="letter-spacing:4px">${params.otp}</h1>

        <p>This OTP will expire in 5 minutes.</p>

        <p>If you did not request this, please ignore this email.</p>

        <br/>
        <p>— Natural Plus Ayurveda Team</p>
      </div>
    `,
  };
}