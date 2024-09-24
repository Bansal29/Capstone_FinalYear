import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function QuizHistory({ token }) {
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/quiz/history", {
          headers: {
            Authorization: `Bearer ${token}`, //sending the bearer token(generated after login)
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch quiz history.");
        }

        const data = await response.json();
        setQuizHistory(data); // Assuming the API returns an array of quiz history
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizHistory();
  }, [token]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Format to display as human-readable date and time
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-primary">Your Quiz History</h1>
      <p className="text-center text-muted">
        View your past quiz results, along with diagnosis and suggested
        treatment plans.
      </p>

      {quizHistory.length > 0 ? (
        <div className="row">
          {quizHistory.map((quiz, index) => (
            <div className="col-md-6 mb-4" key={index}>
              <div className="card shadow-lg border-light h-100">
                <div className="card-body">
                  <h5 className="card-title text-info">
                    Quiz Result: {quiz.result}
                  </h5>
                  <p className="card-text text-muted">
                    <strong>Date Taken: </strong>
                    {formatDate(quiz.timestamp)}
                  </p>
                  {quiz.result && (
                    <p className="card-text">
                      <strong>Diagnosis: </strong> {quiz.result}
                    </p>
                  )}
                  <p className="card-text">
                    <strong>Suggested Treatment: </strong>
                  </p>
                  <ul>
                    {quiz.suggestedTreatment?.map((step, idx) => (
                      <li key={idx} className="text-secondary">
                        {step}
                      </li>
                    )) || (
                      <li className="text-secondary">No treatment suggested</li>
                    )}
                  </ul>
                </div>
                <div className="card-footer text-center">
                  <Link className="btn btn-outline-secondary" to="/quiz">
                    Retake Quiz
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center mt-4">
          No records available
        </div>
      )}
    </div>
  );
}

export default QuizHistory;
