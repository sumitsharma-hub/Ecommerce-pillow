"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// User Routes
const express_1 = require("express");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = (0, express_1.Router)();
router.get("/me", auth_middleware_1.authMiddleware, (req, res) => {
    res.json({
        message: "Protected route",
        user: req.user,
    });
});
exports.default = router;
