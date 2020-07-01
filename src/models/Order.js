const mongoose = require("mongoose");
const { orderStatus } = require("../config/code");

const OrderSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    status: { type: Number, default: 0 }, // 0: pending, 1: completed, -1: canceled
    products: { type: Array, required: true }, // _id, size, quantity, price
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

OrderSchema.pre("update", function (next) {
    this.updatedAt = new Date();
    next();
});

OrderSchema.methods.translateStatus = function () {
    return orderStatus[this.status] || "N/A"
}

module.exports = mongoose.model("Orders", OrderSchema);
