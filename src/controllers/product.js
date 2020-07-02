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
    const { page = 1, limit = 20 } = req.query;
    try {
        const listProducts = await Product.find(
            { isRemoved: { $ne: true } },
            { photos: { $slice: 1 } }
        )
            .skip(Number((page - 1) * limit))
            .limit(Number(limit))
            .exec();
        const totalProducts = await Product.countDocuments();
        return res.json({
            data: listProducts,
            limit,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

const getDetail = async (req, res, next) => {
    const { product_id } = req.params;
    try {
        const product = await Product.findById(product_id).exec();
        if (!product) {
            return next(createError(400, "Cannot find product by id"));
        }
        return res.json({ data: product.toObject() });
    } catch (err) {
        next(err);
    }
};

const remove = async (req, res, next) => {
    const { product_id } = req.params;
    try {
        // const result = await Product.deleteOne({ product_id });
        const foundProduct = await Product.findById(product_id).exec();
        if (!foundProduct) throw createError(400, "Cannot find product by id");
        foundProduct.isRemoved = true;
        await foundProduct.save();
        return res.json({ message: "Deleted" });
    } catch (err) {
        next(err);
    }
};

const edit = async (req, res, next) => {
    const { product_id } = req.params;
    const { photos, title, price, properties, description } = req.body;
    const newPhotos = photos.map((photo) => photo.src);
    try {
        let foundProduct = await Product.findById(product_id).exec();
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
