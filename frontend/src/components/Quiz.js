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

  const suggestedTreatments = [
    "Regular exercise",
    "Talk therapy or counseling",
    "Medication as prescribed by a psychiatrist",
    "Mindfulness and meditation practices",
    "Healthy diet and proper sleep",
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
  const [showSuggestedTreatments, setShowSuggestedTreatments] = useState(false);

  const handleChange = (e) => {
    setQuizData({
      ...quizData,
      [e.target.name]: parseInt(e.target.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the quiz?"
    );
    if (!confirmSubmit) return;

    const quizPayload = {
      q1: quizData.q1,
      q2: quizData.q2,
      q3: quizData.q3,
      q4: quizData.q4,
      q5: quizData.q5,
      q6: quizData.q6,
      q7: quizData.q7,
      q8: quizData.q8,
    };

    try {
      // Step 1: Submit quiz data to the Python backend
      const response = await fetch("http://localhost:8000/quiz/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(quizPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail || "Something went wrong!");
        return;
      }

      const data = await response.json();
      setResult(data.result);
      setShowSuggestedTreatments(data.result === "Depressed"); // Check if the result indicates depression

      // Step 2: Prepare data to save to Node.js backend
      const saveQuizPayload = {
        responses: quizPayload,
        result: data.result,
        suggestedTreatment: showSuggestedTreatments ? suggestedTreatments : [], // Only include treatments if depressed
      };

      // Step 3: Save the quiz data to the Node.js backend
      const saveResponse = await fetch("http://localhost:5000/quiz/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(saveQuizPayload),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        alert(errorData.detail || "Failed to save quiz!");
        return;
      }

      alert("Quiz saved successfully!");
    } catch (error) {
      alert("Error: " + error.message);
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
                  {showSuggestedTreatments && (
                    <div>
                      <h5>Suggested Treatment:</h5>
                      <ul>
                        {suggestedTreatments.map((measure, idx) => (
                          <li key={idx}>{measure}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
