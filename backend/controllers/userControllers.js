const validate = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModels = require("../models/userModels");


// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing Details" });
    }

    if (!validate.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Enter a strong password (min. 6 chars)" });
    }

    const existingUser = await userModels.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new userModels({ name, email, password: hashPassword });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing email or password" });
    }

    const user = await userModels.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getUserData = async (req, res) => {
  try {
    

    let UserId = req.user?.id



    const user = await userModels.findById(UserId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};


const isAuth = async (req, res) => {

  console.log("Api Hit")
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ success: false, message: "Token is missing." });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    return res.status(200).json({
      success: true,
      message: "User is authenticated",
      userData: decoded,
    });

  } catch (error) {
    // If token is invalid or expired
    console.error("Token verification failed:", error);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }


}



module.exports = { registerUser, loginUser, getUserData, isAuth };