const express = require("express");
const authRoutes = require("./auth");
const productRoutes = require("./product");
const router = express.Router();

router.get("/health-check", (req, res) => res.send("OK"));

router.use("/auth", authRoutes);
router.use("/product", productRoutes);

module.exports = router;
