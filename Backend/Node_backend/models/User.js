const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  responses: {
    type: [Number], // Array of numbers representing answers to quiz questions
    required: true,
  },
  result: {
    type: String, // Result of the quiz
    required: true,
  },
  suggestedTreatment: {
    type: [String], // Array of treatment recommendations
    required: true,
  },
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  quizzes: [QuizSchema], // Embedding quizzes inside the user schema
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
