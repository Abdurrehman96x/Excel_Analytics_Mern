const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// Get all users (admin only)
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-passwordHash");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users" });
  }
});

module.exports = router;
