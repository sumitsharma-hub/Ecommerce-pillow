"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddlewareOptional = authMiddlewareOptional;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddlewareOptional(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        try {
            const token = authHeader.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }
        catch { }
    }
    next();
}
