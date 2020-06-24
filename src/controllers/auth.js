const User = require("../models/user");

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
        return res
            .status(200)
            .json({ token: newUser.generateJWT(), user: newUser.clean() });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !user.comparePassword(password))
            return res
                .status(401)
                .json({ message: "Invalid email or password" });

        return res
            .status(200)
            .json({ token: user.generateJWT(), user: user.clean() });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login };
