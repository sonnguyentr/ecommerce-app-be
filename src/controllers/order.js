const Order = require("../models/Order");
const Product = require("../models/Product");
const createError = require("http-errors");

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

        // update stock
        DbProducts.forEach((product, i) => {
            const order = OrderProducts[i];
            product.updateStock({
                size: order.size,
                quantity: -Number(order.quantity),
            });
        });
        // Save order
        const newOrder = await Order.create({
            customerId,
            products: OrderProducts,
        });

        return res.json({ order: newOrder });
    } catch (err) {
        next(err);
    }
};

module.exports = { create };
