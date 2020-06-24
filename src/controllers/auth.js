const User = require("../models/User");

const register = async (req, res, next) => {
    try {
        const { email, name, password } = req.body;

        const user = await User.findOne({ email }).catch((e) => {
            console.log(e);
        });

        if (user)
            return res.status(401).json({
                message:
                    "The email address you have entered is already associated with another account.",
            });

        const newUser = await User.create({
            email,
            name,
            password,
            role: "customer",
        });
        newUser.password = null;
        return res
            .status(200)
            .json({ token: newUser.generateJWT(), user: newUser });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { register };
