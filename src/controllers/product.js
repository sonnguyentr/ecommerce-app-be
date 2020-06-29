const Product = require("../models/Product");

const add = async (req, res, next) => {
    let { photos } = req.body;
    photos = photos.map((photo) => photo.src);
    const product = await Product.create({ ...req.body, photos });
    return res.json({ product });
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
    const product = await Product.findOne({ _id }).exec();
    return res.json({ data: product.toObject() });
};

module.exports = { add, getList, getDetail };
