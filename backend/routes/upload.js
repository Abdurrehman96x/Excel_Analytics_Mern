const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const Upload = require("../models/Upload");

router.post("/json", verifyToken, async (req, res) => {
  try {
    const { fileName, size, rawData } = req.body;

    const newUpload = new Upload({
      user: req.user.id,
      fileName,
      size,
      rawData,
      analysisSummary: "Parsed via frontend",
    });

    await newUpload.save();
    res.status(201).json({ message: "Upload saved successfully" });
  } catch (error) {
    console.error("Error saving JSON upload:", error.message);
    res.status(500).json({ message: "Failed to save upload" });
  }
});

// save chart manually (for "Create Chart" button)
router.post("/chart", verifyToken, async (req, res) => {
  try {
    const { fileName, analysisSummary, rawData } = req.body;

    const newUpload = new Upload({
      user: req.user.id,
      fileName,
      analysisSummary,
      rawData,
      size: `${rawData.length} rows`,
    });

    await newUpload.save();

    res.status(201).json({ message: "Chart data saved successfully!" });
  } catch (error) {
    console.error("Error saving chart:", error);
    res.status(500).json({ message: "Failed to save chart data" });
  }
});

//  Fetch upload history
router.get("/history", verifyToken, async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(uploads);
  } catch (error) {
    console.error("Error fetching upload history:", error);
    res.status(500).json({ msg: "Failed to fetch upload history" });
  }
});


// Delete an upload by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);

    if (!upload) {
      return res.status(404).json({ msg: "Upload not found" });
    }

    // Check if the current user owns this upload
    if (upload.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized to delete this upload" });
    }

    await Upload.findByIdAndDelete(req.params.id);

    res.json({ msg: "Upload deleted successfully" });
  } catch (error) {
    console.error("Error deleting upload:", error.message);
    res.status(500).json({ msg: "Failed to delete upload" });
  }
});

module.exports = router;
