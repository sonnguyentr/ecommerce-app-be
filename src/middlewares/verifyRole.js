const createError = require("http-errors");

const verifyRole = (role) => {
    return (req, res, next) => {
        const { user } = req;
        if (user && user.role !== role) {
            return next(
                createError(401, "You are not authorized to do this action")
            );
        }
        next();
    };
};

module.exports = verifyRole;
