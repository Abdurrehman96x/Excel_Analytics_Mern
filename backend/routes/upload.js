const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const { verifyToken } = require("../middleware/auth");
const Upload = require("../models/Upload");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/upload
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const summary = `Parsed ${data.length} rows from ${req.file.originalname}`;

    const newUpload = new Upload({
      user: req.user.id,
      fileName: req.file.originalname,
      rawData: data, // optional: limit/transform if too large
      analysisSummary: summary,
    });

    await newUpload.save();

    res.json({ msg: "File uploaded and processed", summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to process Excel file" });
  }
});

module.exports = router;
