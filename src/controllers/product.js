const createError = require("http-errors");
const Product = require("../models/Product");
const imgUpload = require("../helper/imgUpload");

const updateProductImg = (product) => {
    product.photos.forEach((photo, index) => {
        if (photo && photo.includes("data:image"))
            imgUpload(photo)
                .then((result) => {
                    const setObject = {};
                    setObject["photos." + index] = result.url;
                    Product.updateOne(
                        { _id: product._id },
                        { $set: setObject }
                    ).exec();
                })
                .catch((err) => {
                    console.err(err);
                });
    });
};

const add = async (req, res, next) => {
    let { photos } = req.body;
    const { user } = req;
    photos = photos.map((photo) => photo.src);
    try {
        const product = await Product.create({
            ...req.body,
            photos,
            sellerId: user._id,
        });
        updateProductImg(product);
        return res.json({ product });
    } catch (err) {
        next(err);
    }
};

const getList = async (req, res, next) => {
    const {
        page = 1,
        limit = 20,
        size = null,
        inStore = null,
        outOfStock = null,
    } = req.query;
    try {
        const query = {
            isRemoved: { $ne: true },
        };

        // handle quantity
        const parseInStore = inStore && inStore.toLowerCase() === "true";
        const parseOutOfStock =
            outOfStock && outOfStock.toLowerCase() === "true";

        if (parseInStore !== parseOutOfStock) {
            //Cùng true || cùng false ko có ý nghĩa
            //query instore
            if (parseInStore) {
                query.properties = {
                    $elemMatch: {
                        quantity: { $gt: 0 },
                    },
                };
            } else {
                query.properties = {
                    $not: {
                        $elemMatch: {
                            quantity: { $gt: 0 },
                        },
                    },
                };
            }
        }
        // handle size
        if (size) {
            if (query.properties) {
                query.properties.$elemMatch
                    ? (query.properties.$elemMatch["size"] = size.toUpperCase())
                    : (query.properties["$elemMatch"] = {
                          size: size.toUpperCase(),
                      });
            } else {
                query.properties = {
                    $elemMatch: {
                        size: size.toUpperCase(),
                    },
                };
            }
        }
        console.log(query);
        const listProducts = await Product.find(query, {
            photos: { $slice: 1 },
        })
            .skip(Number((page - 1) * limit))
            .limit(Number(limit))
            .exec();
        const totalProducts = await Product.countDocuments(query);
        return res.json({
            data: listProducts,
            limit: Number(limit),
            currentPage: Number(page),
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
    const { user } = req;
    try {
        const foundProduct = await Product.findOne({
            _id: product_id,
            sellerId: user._id,
        }).exec();

        if (!foundProduct) throw createError(400, "Cannot find product by id");
        foundProduct.isRemoved = true;
        await foundProduct.save();
        return res.json({ message: "Deleted" });
    } catch (err) {
        next(err);
    }
};

const edit = async (req, res, next) => {
    const { user } = req;
    const { product_id } = req.params;
    const { photos, title, price, properties, description } = req.body;
    const newPhotos = photos.map((photo) => photo.src);
    try {
        const foundProduct = await Product.findOne({
            _id: product_id,
            sellerId: user._id,
        }).exec();

        if (!foundProduct) {
            return next(createError(400, "Cannot find product by id"));
        }

        foundProduct.photos = newPhotos;
        foundProduct.title = title;
        foundProduct.price = price;
        foundProduct.properties = properties;
        foundProduct.description = description;

        const updated = await foundProduct.save();
        updateProductImg(foundProduct);
        return res.json({ message: "Updated", product: updated });
    } catch (err) {
        next(err);
    }
};

module.exports = { add, getList, getDetail, remove, edit };
