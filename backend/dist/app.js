"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Express App
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const product_routes_1 = __importDefault(require("./modules/product/product.routes"));
const cart_routes_1 = __importDefault(require("./modules/cart/cart.routes"));
const order_routes_1 = __importDefault(require("./modules/order/order.routes"));
const webhook_routes_1 = __importDefault(require("./modules/webhooks/webhook.routes"));
const review_routes_1 = __importDefault(require("./modules/review/review.routes"));
const app = (0, express_1.default)();
app.use("/api/webhooks", webhook_routes_1.default);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", (_req, res) => {
    res.json({ status: "OK", uptime: process.uptime() });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/cart", cart_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/orders", order_routes_1.default);
app.use("/api/reviews", review_routes_1.default);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
exports.default = app;
