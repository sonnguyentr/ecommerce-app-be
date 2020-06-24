const express = require("express");

const Auth = require("../controllers/auth");
const {
    validate,
    registerValidation,
    loginValidation,
} = require("../middlewares/validate");

const router = express.Router();

router.post("/register", registerValidation, validate, Auth.register);
router.post("/login", loginValidation, validate, Auth.login);

module.exports = router;
