const User = require("../models/User");

exports.saveQuiz = async (req, res) => {
  const { responses, result } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.quizzes.push({ responses, result });
    await user.save();

    res.json({ message: "Quiz saved successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
