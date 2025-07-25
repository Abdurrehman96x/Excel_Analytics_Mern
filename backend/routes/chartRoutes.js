const express = require("express");
const router = express.Router();
const Chart = require("../models/Chart");
const { verifyToken } = require("../middleware/auth");  // ✅ Correct middleware import

// Create a new chart
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { title, type, data } = req.body;
    const userId = req.userId;

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

// Get all charts for a user
router.get("/user", verifyToken, async (req, res) => {
  try {
    const charts = await Chart.find({ user: req.userId }).sort({ createdAt: -1 });
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

// ✅ Count of different chart types created by user
router.get("/count", verifyToken, async (req, res) => {
  try {
    const chartTypes = await Chart.distinct("type", { user: req.userId });
    res.status(200).json({ count: chartTypes.length });
  } catch (error) {
    console.error("Count fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch chart count" });
  }
});

// ✅ Chart types with count for dashboard
router.get("/types-summary", verifyToken, async (req, res) => {
  try {
    const summary = await Chart.aggregate([
      { $match: { user: req.userId } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json(summary);  // [{ _id: 'Bar', count: 2 }, { _id: 'Line', count: 1 }, ...]
  } catch (error) {
    console.error("Types summary fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch chart types summary" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Chart.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Chart deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete chart" });
  }
});

module.exports = router;
