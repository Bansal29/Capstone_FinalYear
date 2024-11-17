const { User, Report } = require("../models/User");

exports.saveFacial = async (req, res) => {
  try {
    const { emotions, averageDepressionScore } = req.body;
    const userId = req.userId;

    if (!emotions || averageDepressionScore === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("emotions at backend:", emotions);
    const newFacialResult = {
      emotions,
      averageDepressionScore,
    };

    user.facialResults.push(newFacialResult);
    await user.save();

    res.status(201).json({
      message: "Facial result saved successfully",
      facialResult: newFacialResult,
    });
  } catch (error) {
    console.error("Error saving facial result:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getFacialHistory = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("facialResults");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.facialResults);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
