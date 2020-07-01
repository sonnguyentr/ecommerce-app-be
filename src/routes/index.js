const express = require("express");
const authRoutes = require("./auth");
const productRoutes = require("./product");
const orderRoutes = require("./order");
const router = express.Router();

router.get("/health-check", (req, res) => res.send("OK"));

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

module.exports = router;
