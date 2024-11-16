const express = require("express");
const {
  saveFacial,
  getFacialHistory,
} = require("../controllers/faceController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected route to save quiz results
router.post("/save", authMiddleware, saveFacial);
router.get("/history", authMiddleware, getFacialHistory);

module.exports = router;
