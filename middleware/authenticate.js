const jwt = require("jsonwebtoken");
const { queryRunner } = require("../helper/queryRunner");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  try {
    // Read token from cookie, NOT headers
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const query = `SELECT id, email, name, role FROM users WHERE email = ?`;
    const result = await queryRunner(query, [decoded.email]);

    if (!result[0] || result[0].length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result[0][0];
    req.user = {
      email: decoded.email,
      userId: user.id,
      name: user.name,
      role: user.role || null
    };

    next();
  } catch (err) {
    console.log("error: ", err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(400).json({
      message: "Invalid token",
      error: err.message,
    });
  }
};

module.exports = {
  verifyToken,
};
