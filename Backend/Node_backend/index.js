const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const userRoutes = require("./routes/userRoutes");
const faceRoutes = require("./routes/faceRoutes");
const reportRoutes = require("./routes/reportRoutes");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://maansick.vercel.app", // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Include credentials (e.g., cookies, authorization headers)
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/user", userRoutes);
app.use("/api/facial", faceRoutes);
app.use("/api/reports", reportRoutes);
app.get("/api/nearby-counselors", async (req, res) => {
  const { lat, lng } = req.query;
  const apiKey = "AIzaSyDU3YX1HSgywtTHHZ44I82rPFZTEOaV0gQ";

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ message: "Latitude and Longitude are required." });
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=psychiatrists+near+${lat},${lng}&key=${apiKey}`
    );

    res.json(response.data.results);
  } catch (error) {
    console.error("Error fetching counselors:", error);
    res.status(500).json({ message: "Failed to fetch nearby counselors" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
