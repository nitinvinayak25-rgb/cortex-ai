const jwt = require("jsonwebtoken");
const connectDB = require("../config/db");

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        message: "Login required",
      });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin === true;
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return res.status(503).json({
      message: "This service is temporarily unavailable because its database cannot be reached.",
    });
  }

  next();
};

module.exports = auth;