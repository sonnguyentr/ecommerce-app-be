const express = require("express");
const verifyJwt = require("../middlewares/verifyJwt");
const Order = require("../controllers/order");
const {
    validate,
} = require("../middlewares/validate");
const router = express.Router();
router.route("/").post(verifyJwt, validate,Order.create);

module.exports = router;
// Create
// Read
// Update
// Delete
