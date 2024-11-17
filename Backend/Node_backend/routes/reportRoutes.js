// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const { User, Report } = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Save report details
router.post("/save", async (req, res) => {
  try {
    const { userId, quizScore, depressionIndex, combinedResult, timestamp } =
      req.body;

    if (!userId || !quizScore || depressionIndex === null || !combinedResult) {
      return res.status(400).json({ message: "Incomplete report data" });
    }

    const report = new Report({
      userId,
      quizScore,
      depressionIndex,
      combinedResult,
      timestamp,
    });

    await report.save();
    res.status(201).json({ message: "Report saved successfully", report });
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getreport", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const latestReport = await Report.findOne({ userId })
      .sort({ timestamp: -1 })
      .exec();

    if (!latestReport) {
      return res.status(404).json({ message: "No reports found" });
    }

    res.json({ report: latestReport });
  } catch (error) {
    console.error("Error fetching the latest report:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
