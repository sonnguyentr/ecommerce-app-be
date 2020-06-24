const express = require("express");

const Auth = require("../controllers/auth");
const { validate, registerValidation } = require("../middlewares/validate");

const router = express.Router();

router.post("/register", registerValidation, validate, Auth.register);

module.exports = router;
