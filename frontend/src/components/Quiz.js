import React, { useState } from "react";

function Quiz({ token }) {
  const questions = [
    "Little interest or pleasure in doing things?",
    "Feeling down, depressed, or hopeless?",
    "Trouble falling or staying asleep, or sleeping too much?",
    "Feeling tired or having little energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself - or that you are a failure or have let yourself or your family down?",
    "Trouble concentrating on things, such as reading the newspaper or watching television?",
    "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
  ];

  const [quizData, setQuizData] = useState({
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
    q6: 0,
    q7: 0,
    q8: 0,
  });

  const [result, setResult] = useState("");
  const [measures, setMeasures] = useState(""); // State for measures/cures

  const handleChange = (e) => {
    setQuizData({
      ...quizData,
      [e.target.name]: parseInt(e.target.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirm before submission
    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the quiz?"
    );
    if (!confirmSubmit) return; // Exit if user cancels

    // Fetch quiz result from backend
    const response = await fetch("http://localhost:8000/quiz/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quizData),
    });
    const data = await response.json();
    setResult(data.result); // Set the result from the backend

    // Calculate the total score
    const totalScore = Object.values(quizData).reduce(
      (acc, curr) => acc + curr,
      0
    );

    // Generate measures/cures based on the score
    const generatedMeasures = generateMeasures(totalScore);
    setMeasures(generatedMeasures); // Set the generated measures
  };

  // Function to generate measures/cures based on the score
  const generateMeasures = (score) => {
    if (score <= 5) {
      return "Your responses indicate minimal depressive symptoms. Maintain a balanced lifestyle, engage in physical activities, and stay connected with friends and family.";
    } else if (score <= 10) {
      return "You may be experiencing mild depressive symptoms. Consider talking to a friend or a counselor, and explore activities that you enjoy.";
    } else if (score <= 15) {
      return "Moderate depressive symptoms detected. It may be beneficial to consult a mental health professional for support and strategies.";
    } else {
      return "High depressive symptoms detected. We strongly recommend reaching out to a mental health professional for assessment and treatment.";
    }
  };

  if (!token) {
    return (
      <div className="alert alert-warning mt-4">
        Please log in to access the quiz.
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="text-center">PHQ-8 Depression Quiz</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {questions.map((question, index) => (
                  <div key={index} className="mb-4">
                    <label className="form-label">
                      {index + 1}. {question}
                    </label>
                    <select
                      className="form-select"
                      name={`q${index + 1}`}
                      onChange={handleChange}
                      value={quizData[`q${index + 1}`]}
                    >
                      <option value="0">Not at all</option>
                      <option value="1">Several days</option>
                      <option value="2">More than half the days</option>
                      <option value="3">Nearly every day</option>
                    </select>
                  </div>
                ))}
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    Submit Quiz
                  </button>
                </div>
              </form>
              {result && (
                <div className="alert alert-info mt-4">
                  <h4 className="alert-heading">Quiz Result</h4>
                  <p>{result}</p>
                  <h5>Measures/Cures:</h5>
                  <p>{measures}</p> {/* Displaying measures/cures */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
