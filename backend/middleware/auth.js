// middleware/auth.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Access denied. No token." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // includes user ID and role
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(403).json({ msg: "Invalid token." });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user.role === "admin") return next();
  return res.status(403).json({ msg: "Admin access only." });
};

module.exports = { verifyToken, verifyAdmin };
