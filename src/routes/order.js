const express = require("express");
const verifyJwt = require("../middlewares/verifyJwt");
const Order = require("../controllers/order");
const { validate, orderCreate, orderCancel } = require("../middlewares/validate");
const router = express.Router();
router
    .route("/")
    .get(verifyJwt, Order.getList)
    .post(verifyJwt, orderCreate, validate, Order.create);

router.
    route("/cancel")
    .post(verifyJwt, orderCancel, validate, Order.cancel);

module.exports = router;
// Create
// Read
// Update
// Delete
