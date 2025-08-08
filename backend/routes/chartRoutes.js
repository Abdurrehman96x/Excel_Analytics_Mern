const express = require("express");
const router = express.Router();
const Chart = require("../models/Chart");
const { verifyToken } = require("../middleware/auth");

//  Create a new chart
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { title, type, data } = req.body;
    const userId = req.user?.id || req.userId;  // Ensure proper extraction

    if (!userId) {
      return res.status(400).json({ error: "User ID is missing from token" });
    }

    const newChart = new Chart({
      user: userId,
      title,
      type,
      data,
    });

    await newChart.save();
    res.status(201).json({ message: "Chart saved successfully", chart: newChart });
  } catch (error) {
    console.error("Error saving chart:", error.message);
    res.status(500).json({ error: "Failed to save chart" });
  }
});

// Get all charts for logged-in user
router.get("/user", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const charts = await Chart.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(charts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch charts" });
  }
});

// Delete a chart by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Chart.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Chart deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete chart" });
  }
});

//  Count distinct chart types created by user
router.get("/count", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const chartTypes = await Chart.distinct("type", { user: userId });
    res.status(200).json({ count: chartTypes.length });
  } catch (error) {
    console.error("Count fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch chart count" });
  }
});

// Chart types with count summary for user dashboard
router.get("/types-summary", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const summary = await Chart.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.status(200).json(summary);
  } catch (error) {
    console.error("Types summary fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch chart types summary" });
  }
});

module.exports = router;
