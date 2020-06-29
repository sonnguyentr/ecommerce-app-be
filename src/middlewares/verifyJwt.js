const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const verifyJwt = async (req, res, next) => {
    const authorization = req.header("authorization");
    const token = authorization && authorization.split(" ")[1];
    if (!token)
        return next(createError(401, "Please login to view this page."));
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        // err
        next(createError(401, "invalid token"));
    }
    next();
};

module.exports = verifyJwt;
