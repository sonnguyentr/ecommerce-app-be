const Order = require("../models/Order");
const Product = require("../models/Product");
const createError = require("http-errors");
const { orderStatus } = require("../config/code");

const create = async (req, res, next) => {
    try {
        const { customerId, products: OrderProducts } = req.body;
        // Check availability
        let DbProducts = OrderProducts.map((product) => {
            return Product.findById(product._id, "-photos").exec();
        });
        DbProducts = await Promise.all(DbProducts);
        for (let i = 0; i < DbProducts.length; i++) {
            const product = DbProducts[i];
            const order = OrderProducts[i];
            if (
                !product ||
                !product.checkAvailability({
                    size: order.size,
                    quantity: order.quantity,
                })
            ) {
                return res.status(400).json({
                    message: "This product is currently unavailabled",
                    order: order,
                    stock: product,
                });
            }
        }
        let amount = 0;
        // update stock
        DbProducts.forEach((product, i) => {
            const order = OrderProducts[i];
            amount += order.quantity * product.price;
            product.updateStock({
                size: order.size,
                quantity: -Number(order.quantity),
            });
        });
        // Save order
        const newOrder = await Order.create({
            customerId,
            products: OrderProducts,
            amount,
        });

        return res.json({ order: newOrder });
    } catch (err) {
        next(err);
    }
};

const getList = async (req, res, next) => {
    const { user } = req;
    const query = {};
    if (user.role === "customer") {
        query.customerId = user._id;
    }

    try {
        // const list = await Order.find(query).exec();
        let list = await Order.aggregate([
            [
                { $match: query },
                { $unwind: { path: "$products" } },
                {
                    $lookup: {
                        from: "products",
                        let: { product_id: "$products._id" },
                        pipeline: [
                            {
                                $addFields: {
                                    product_id: { $toString: "$_id" },
                                },
                            },
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$product_id", "$$product_id"],
                                    },
                                },
                            },
                            {
                                $project: {
                                    photo: { $arrayElemAt: ["$photos", 0] },
                                    title: 1,
                                    price: 1,
                                },
                            },
                        ],
                        as: "product",
                    },
                },
                { $unwind: { path: "$product" } },
                {
                    $group: {
                        _id: "$_id",
                        customerId: { $first: "$customerId" },
                        status: { $first: "$status" },
                        createdAt: { $first: "$createdAt" },
                        amount: { $first: "$amount" },
                        productsDetail: { $push: "$product" },
                        orderedProducts: { $push: "$products" },
                    },
                },
            ],
        ]).exec();
        list = list.map((item) => {
            console.log(item);
            const newOrderArr = item.productsDetail.map((product) => {
                const order = item.orderedProducts.find(
                    (el) => el._id === product._id.toString()
                );
                return {
                    ...product,
                    size: order.size,
                    quantity: order.quantity,
                    product_id: product._id,
                    createdAt: item.createdAt,
                    status: item.status,
                    statusText: orderStatus[item.status] || "N/A",
                };
            });
            return {
                order_id: item._id,
                customerId: item.customerId,
                status: item.status,
                statusText: orderStatus[item.status] || "N/A",
                createdAt: item.createdAt,
                amount: item.amount,
                products: newOrderArr,
            };
        });

        return res.json({ data: list });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

module.exports = { create, getList };
