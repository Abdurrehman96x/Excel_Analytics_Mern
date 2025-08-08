const Chart = require("../models/Chart");

exports.createChart = async (req, res) => {
  try {
    const { xAxis, yAxis, type, data } = req.body;
    const userId = req.user.id;

    const newChart = await Chart.create({
      title: `${yAxis} vs ${xAxis}`,
      type,
      data,
      user: userId,
    });

    res.status(201).json(newChart);
  } catch (err) {
    console.error("Chart save error:", err);
    res.status(500).json({ error: "Failed to save chart" });
  }
};

exports.getChartCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Chart.countDocuments({ user: userId });
    res.status(200).json({ count });
  } catch (err) {
    console.error("Chart count error:", err);
    res.status(500).json({ error: "Failed to fetch chart count" });
  }
};

exports.getUserChartTypes = async (req, res) => {
  try {
    const userId = req.user.id;
    const charts = await Chart.find({ user: userId }).select("type");
    const typesSet = new Set(charts.map(c => c.type.toLowerCase()));
    res.json({ types: Array.from(typesSet), total: typesSet.size });
  } catch (err) {
    console.error("Chart types fetch error:", err);
    res.status(500).json({ error: "Failed to fetch chart types" });
  }
};

// Get all charts for current user
exports.getChartsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const charts = await Chart.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(charts);
  } catch (err) {
    console.error("Fetch charts error:", err);
    res.status(500).json({ error: "Failed to fetch charts" });
  }
};
