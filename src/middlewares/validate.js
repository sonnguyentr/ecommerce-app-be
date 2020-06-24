const { validationResult, body } = require("express-validator");

const registerValidation = [
    body("name").trim().not().isEmpty().withMessage("Please enter name"),
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

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = {};
        errors.array().map((err) => (error[err.param] = err.msg));
        return res.status(422).json({ error });
    }
    next();
};

module.exports = { registerValidation, validate };
