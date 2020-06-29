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
        const result = await Product.deleteOne({ _id });
        if (!result.deletedCount) {
            return next(createError(400, "Cannot find product by id"));
        }
        return res.json({ message: "Deleted" });
    } catch (err) {
        next(err);
    }
};

const edit = async (req, res, next) => {
    const { _id } = req.params;
    const { photos, title, price, properties, description } = req.body;
    const newPhotos = photos.map((photo) => photo.src);
    try {
        let foundProduct = await Product.findById(_id).exec();
        if (!foundProduct) {
            return next(createError(400, "Cannot find product by id"));
        }

        foundProduct.photos = newPhotos;
        foundProduct.title = title;
        foundProduct.price = price;
        foundProduct.properties = properties;
        foundProduct.description = description;

        const updated = await foundProduct.save();
        return res.json({ message: "Updated", product: updated });
    } catch (err) {
        next(err);
    }
};

module.exports = { add, getList, getDetail, remove, edit };
