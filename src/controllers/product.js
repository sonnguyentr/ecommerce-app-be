const createError = require("http-errors");
const Product = require("../models/Product");

const add = async (req, res, next) => {
    let { photos } = req.body;
    const { user } = req;
    photos = photos.map((photo) => photo.src);
    try {
        const product = await Product.create({ ...req.body, photos });
        return res.json({ product });
    } catch (err) {
        next(err);
    }
};

const getList = async (req, res, next) => {
    const listProducts = await Product.find(
        {},
        { photos: { $slice: 1 } }
    ).exec();
    return res.json({ data: listProducts });
};

const getDetail = async (req, res, next) => {
    const { _id } = req.params;
    try {
        const product = await Product.findOne({ _id }).exec();
        if (!product) {
            return next(createError(400, "Cannot find product by id"));
        }
        return res.json({ data: product.toObject() });
    } catch (err) {
        next(err);
    }
};

const remove = async (req, res, next) => {
    const { _id } = req.params;
    try {
        const foundProduct = await Product.findOne({ _id }).exec();
        if (!foundProduct) {
            return next(createError(400, "Cannot find product by id"));
        }
        // product.isRemoved = true;
        await foundProduct.deleteOne();
        return res.json({ message: "Deleted" });
    } catch (err) {
        next(err);
    }
};

module.exports = { add, getList, getDetail, remove };
