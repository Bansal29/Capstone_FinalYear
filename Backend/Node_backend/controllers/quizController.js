const User = require("../models/User");

// Controller to save quiz
exports.saveQuiz = async (req, res) => {
  console.log(req.body);
  const { responses, result, suggestedTreatment } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newQuiz = {
      timestamp: new Date(),
      responses,
      result,
      suggestedTreatment,
    };
    console.log("New quiz:", newQuiz);
    user.quizzes.push(newQuiz);
    await user.save();

    res.status(201).json({ message: "Quiz saved successfully", quiz: newQuiz });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// New function to fetch quiz history
exports.getQuizHistory = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("quizzes");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
