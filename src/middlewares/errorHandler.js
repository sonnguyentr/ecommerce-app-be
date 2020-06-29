const errorHandler = (err, req, res, next) => {
    res.status(err.status || err.statusCode || 500);
    return res.json({ message: err.message, error: err });
};

module.exports = errorHandler;
