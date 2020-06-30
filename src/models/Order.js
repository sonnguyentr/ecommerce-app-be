const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    status: { type: Number, default: 0 }, // 0: pending, 1: completed, -1: cancelled
    products: { type: Array, required: true }, // _id, size, quantity
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

OrderSchema.pre("update", function (next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model("Orders", OrderSchema);
