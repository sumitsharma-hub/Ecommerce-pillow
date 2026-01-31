"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
// Auth Service
const prisma_1 = __importDefault(require("../../prisma"));
const hash_util_1 = require("../../utils/hash.util");
const jwt_util_1 = require("../../utils/jwt.util");
const registerUser = async (data) => {
    const existingUser = await prisma_1.default.user.findUnique({
        where: { email: data.email }
    });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await (0, hash_util_1.hashPassword)(data.password);
    const user = await prisma_1.default.user.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            role: "USER"
        }
    });
    const { password, ...safeUser } = user;
    const token = (0, jwt_util_1.signToken)({ id: user.id, role: user.role });
    return {
        message: "User registered successfully",
        user: safeUser,
        token,
    };
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email: data.email }
    });
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isMatch = await (0, hash_util_1.comparePassword)(data.password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const token = (0, jwt_util_1.signToken)({ id: user.id, role: user.role });
    return { user, token };
};
exports.loginUser = loginUser;
