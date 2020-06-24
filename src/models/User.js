const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: "Your email is required",
        trim: true,
    },
    name: { type: String, required: "Your name is required" },
    password: {
        type: String,
        required: "Your password is required",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

UserSchema.pre("save", function (next) {
    const user = this;

    if (!user.isNew) return next();
    user.userId = user.constructor.countDocuments();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.pre("update", function (next) {
    this.updatedAt = new Date();
    next();
});

UserSchema.methods.generateJWT = function () {
    const today = new Date();

    let payload = {
        id: this._id,
        email: this.email,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3d",
    });
};

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.clean = function () {
    const obj = this.toObject();
    const sensitive = ["password"];
    sensitive.forEach((item) => {
        delete obj[item];
    });
    return obj;
};

module.exports = mongoose.model("Users", UserSchema);
