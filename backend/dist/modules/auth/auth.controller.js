"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyResetOtp = exports.forgotPassword = exports.createAccount = exports.verifyLoginOtp = exports.sendLoginOtp = exports.login = exports.identify = void 0;
const auth_service_1 = require("./auth.service");
// Step 1: Identify user (email or phone entered, Continue clicked)
const identify = async (req, res) => {
    try {
        const result = await (0, auth_service_1.identifyUser)(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.identify = identify;
// Step 2a: Password login
const login = async (req, res) => {
    try {
        const result = await (0, auth_service_1.loginWithPassword)(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
exports.login = login;
// Step 2b: Send OTP for login
const sendLoginOtp = async (req, res) => {
    try {
        const { identifier } = req.body;
        const result = await (0, auth_service_1.sendLoginOtpService)(identifier);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.sendLoginOtp = sendLoginOtp;
// Step 3: Verify Login OTP
const verifyLoginOtp = async (req, res) => {
    try {
        const result = await (0, auth_service_1.verifyLoginOtpService)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.verifyLoginOtp = verifyLoginOtp;
// Step 4: Create account after OTP verification
const createAccount = async (req, res) => {
    try {
        const result = await (0, auth_service_1.createAccountAfterOtp)(req.body);
        res.status(201).json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.createAccount = createAccount;
// Forgot password flow
const forgotPassword = async (req, res) => {
    try {
        const { identifier, setNewPassword } = req.body;
        const result = await (0, auth_service_1.forgotPasswordService)(identifier, setNewPassword);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.forgotPassword = forgotPassword;
const verifyResetOtp = async (req, res) => {
    try {
        const { identifier, otp, sessionId } = req.body;
        const result = await (0, auth_service_1.verifyResetOtpService)({ identifier, otp, sessionId });
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.verifyResetOtp = verifyResetOtp;
const resetPassword = async (req, res) => {
    try {
        const { identifier, otp, password, sessionId } = req.body;
        const result = await (0, auth_service_1.resetPasswordService)({
            identifier,
            otp,
            password,
            sessionId,
        });
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.resetPassword = resetPassword;
