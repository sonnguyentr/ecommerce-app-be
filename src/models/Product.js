const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    photos: {
        type: Array,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    properties: {
        type: Array,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

ProductSchema.pre("update", function (next) {
    this.updatedAt = new Date();
    next();
});


module.exports = mongoose.model("Products", ProductSchema);
