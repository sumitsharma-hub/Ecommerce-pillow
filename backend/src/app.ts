// Express App
import express from "express";
import path from "path";
import cors from "cors"
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import adminRoutes from "./modules/admin/admin.routes";
import productRoutes from "./modules/product/product.routes";
import cartRoutes from "./modules/cart/cart.routes";
import orderRoutes from "./modules/order/order.routes";
import webhookRoutes from "./modules/webhooks/webhook.routes";
import reviewRoutes from "./modules/review/review.routes"




const app = express();

app.use("/api/webhooks", webhookRoutes);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "OK", uptime: process.uptime() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);


app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

export default app;
