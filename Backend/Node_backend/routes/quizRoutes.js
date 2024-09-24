const express = require("express");
const { saveQuiz, getQuizHistory } = require("../controllers/quizController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected route to save quiz results
router.post("/save", authMiddleware, saveQuiz);
router.get("/history", authMiddleware, getQuizHistory);

module.exports = router;
