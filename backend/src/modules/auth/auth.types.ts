export interface LoginInput {
  identifier: string;
  password: string;
}

export interface IdentifyInput {
  identifier: string;
}

export interface IdentifyResult {
  isExistingUser: boolean;
  hasPassword: boolean;
  isAdmin: boolean;
  maskedEmail?: string;
  maskedPhone?: string;
  identifier: string;
  identifierType: "email" | "phone";
}

export interface SendOtpResult {
  message: string;
  sessionId?: string;
  otpSentVia: "sms" | "email";
  identifier: string;
}

export interface VerifyOtpInput {
  identifier: string;
  otp: string;
  sessionId?: string;
}

export interface CreateAccountInput {
  identifier: string;
  identifierType: "email" | "phone";
  name: string;
  email?: string;
  phone?: string;
  password?: string;
}