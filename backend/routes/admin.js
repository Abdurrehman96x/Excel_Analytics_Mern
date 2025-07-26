const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Upload = require("../models/Upload");
const Chart = require("../models/Chart"); // Assuming you have a Chart model
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// ✅ 1. Get all users (admin only)
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-passwordHash"); // Exclude password
    res.json(users);
  } catch (err) {
    console.error("Failed to fetch users", err);
    res.status(500).json({ msg: "Failed to fetch users" });
  }
});

// ✅ 2. Get all uploads (admin only)
router.get("/uploads", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const uploads = await Upload.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(uploads);
  } catch (err) {
    console.error("Failed to fetch uploads", err);
    res.status(500).json({ msg: "Failed to fetch uploads" });
  }
});

// ✅ 3. Get all charts (admin only)
router.get("/charts", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const charts = await Chart.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(charts);
  } catch (err) {
    console.error("Failed to fetch charts", err);
    res.status(500).json({ msg: "Failed to fetch charts" });
  }
});

// ✅ 4. Delete a user (admin only)
router.delete("/user/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Delete user
    await User.findByIdAndDelete(userId);

    // Optionally delete user's uploads and charts
    await Upload.deleteMany({ user: userId });
    await Chart.deleteMany({ user: userId });

    res.json({ msg: "User and related data deleted successfully" });
  } catch (err) {
    console.error("Failed to delete user", err);
    res.status(500).json({ msg: "Failed to delete user" });
  }
});

module.exports = router;
