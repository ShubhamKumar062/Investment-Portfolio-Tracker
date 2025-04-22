const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require("../utils/sendmail")
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exist", success: false })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userModel = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully", success: true, user: userModel })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const errMessage = "Auth falied or password is wrong";
        if (!user) {
            return res.status(403).json({ message: errMessage, success: false })
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: errMessage, success: false })
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        )
        res.status(200).json({ message: "Login Successfull", success: true, jwtToken, email, name: user.name })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", success: false })
    }
}

module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetURL = `http://localhost:3777/reset-password/${token}`;
    const message = `
        <h2>Password Request</h2>
        <p>click link below to reset your password</p>
        <a href="${resetURL}">Reset Password</a>
    `

    await sendEmail(user.email, "password-Reset", message);
    res.status(200).json({ message: "Reset Email Sent", success: true })
};

module.exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;


    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return res.status(400).json({ message: "Invalid or expire Token" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({message: "password reset sucesfully", success: true})
}

