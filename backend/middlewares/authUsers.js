const jwt = require("jsonwebtoken");

// User authentication middleware
const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to req object instead of req.body
    req.user = decoded

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    console.error("Authentication Error:", error);

    // Handle invalid or expired token error
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = authUser;