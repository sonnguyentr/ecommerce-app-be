const express = require("express");
const { verify } = require("../middlewares/verify-jwt");
const Product = require("../controllers/product");
// const {
//     validate,
//     registerValidation,
//     loginValidation,
// } = require("../middlewares/validate");

const router = express.Router();
router.route("/:_id").get(Product.getDetail);
router.route("/add-product").post(verify, Product.add);
router.route("/").get(verify, Product.getList);

module.exports = router;
