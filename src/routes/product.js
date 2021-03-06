const express = require("express");
const verifyJwt = require("../middlewares/verifyJwt");
const verifyRole = require("../middlewares/verifyRole");
const Product = require("../controllers/product");
// const {
//     validate,
//     registerValidation,
//     loginValidation,
// } = require("../middlewares/validate");

const router = express.Router();
router
    .route("/:product_id")
    .get(Product.getDetail)
    .put(verifyJwt, verifyRole("seller"), Product.edit)
    .delete(verifyJwt, verifyRole("seller"), Product.remove);
router.route("/add-product").post(verifyJwt, verifyRole("seller"), Product.add);
router.route("/").get(Product.getList);

module.exports = router;
