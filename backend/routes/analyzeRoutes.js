// routes/analyzeRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const Upload = require("../models/Upload");
const Chart = require("../models/Chart");

// Simulate analysis route
router.post("/:uploadId", verifyToken, async (req, res) => {
  const uploadId = req.params.uploadId;

  try {
    const upload = await Upload.findById(uploadId);
    if (!upload) {
      return res.status(404).json({ msg: "Upload not found" });
    }

    // Fake chart generation logic
    const chart = new Chart({
      title: upload.fileName,
      type: "bar",
      data: {
        labels: ["A", "B", "C"],
        values: [12, 19, 3],
      },
      user: req.user.id,
    });

    await chart.save();

    res.json({ msg: "Chart created", chart });
  } catch (err) {
    console.error("Error analyzing file:", err);
    res.status(500).json({ msg: "Analysis failed" });
  }
});

module.exports = router;
