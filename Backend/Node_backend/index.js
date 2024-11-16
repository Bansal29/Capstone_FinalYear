const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const userRoutes = require("./routes/userRoutes");
const faceRoutes = require("./routes/faceRoutes");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/user", userRoutes);
app.use("/api/facial", faceRoutes);
app.get("/api/nearby-counselors", async (req, res) => {
  const location = "40.712776,-74.005974"; // Example coordinates
  const radius = 5000;
  const apiKey = "AIzaSyDU3YX1HSgywtTHHZ44I82rPFZTEOaV0gQ"; // Replace with your actual key

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=psychiatrist&key=${apiKey}`
    );
    res.json(response.data.results);
  } catch (error) {
    console.error("Error fetching counselors:", error);
    res.status(500).json({ message: "Failed to fetch nearby counselors" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
