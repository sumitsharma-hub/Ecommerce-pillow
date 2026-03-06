export const passwordResetTemplate = (otp: string) => {
  return `
  <h2>Password Reset</h2>
  <p>Your OTP for password reset is:</p>
  <h1>${otp}</h1>
  <p>This OTP will expire in 5 minutes.</p>
  `;
};