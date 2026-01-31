import express from "express";
import { razorpayWebhook } from "./webhook.controller";

const router = express.Router();

router.post(
  "/razorpay",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

export default router;
