"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyResetOtp = exports.forgotPassword = exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const register = async (req, res) => {
    try {
        const result = await (0, auth_service_1.registerUser)(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const result = await (0, auth_service_1.loginUser)(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
exports.login = login;
const forgotPassword = async (req, res) => {
    try {
        const result = await (0, auth_service_1.forgotPasswordService)(req.body.email);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.forgotPassword = forgotPassword;
const verifyResetOtp = async (req, res) => {
    try {
        const result = await (0, auth_service_1.verifyResetOtpService)(req.body);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.verifyResetOtp = verifyResetOtp;
const resetPassword = async (req, res) => {
    try {
        const result = await (0, auth_service_1.resetPasswordService)(req.body);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.resetPassword = resetPassword;
