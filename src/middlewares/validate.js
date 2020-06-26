const { validationResult, body } = require("express-validator");

const registerValidation = [
    body("name").trim().not().isEmpty().withMessage("Name cannot be empty"),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email address"),
    body("password")
        .trim()
        .not()
        .isEmpty()
        .isLength({ min: 7 })
        .withMessage("Must be at least 7 chars long"),
];

const loginValidation = [
    body("email").trim().isEmail().withMessage("Enter a valid email address"),
    body("password").not().isEmpty().withMessage("Password cannot be empty"),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = {};
        errors.array().map((err) => (error[err.param] = err.msg));
        return res.status(422).json({ error });
    }
    next();
};

module.exports = { registerValidation, validate, loginValidation };
