const express = require("express");
const { signup, login } = require("../controllers/authController");
const { saveQuiz } = require("../controllers/quizController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Authentication Routes
router.post("/signup", signup);
router.post("/login", login);

// Protected route to save quiz results
router.post("/saveQuiz", authMiddleware, saveQuiz);

module.exports = router;
