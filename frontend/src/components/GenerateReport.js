import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

const GenerateReport = ({ token }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [quizScore, setQuizScore] = useState(null);
  const [depressionIndex, setDepressionIndex] = useState(null);
  const [combinedResult, setCombinedResult] = useState([]);
  const [nearbyCounselors, setNearbyCounselors] = useState([]);
  const reportRef = useRef();

  const fetchNearbyCounselors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/nearby-counselors"
      );
      const sortedCounselors = (response.data || []).sort(
        (a, b) => b.rating - a.rating
      ); // Sort counselors by rating
      setNearbyCounselors(sortedCounselors.slice(0, 5)); // Top 5 counselors
    } catch (error) {
      console.error("Error fetching nearby counselors:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [userRes, quizRes, depressionRes] = await Promise.all([
          axios.get("http://localhost:5000/api/user/profile", config),
          axios.get("http://localhost:5000/api/quiz/history", config),
          axios.get("http://localhost:5000/api/facial/history", config),
        ]);

        const userDetails = userRes.data;
        const quizHistory = quizRes.data;
        const depressionHistory = depressionRes.data;

        const latestQuizResponse = quizHistory.slice(-1)[0];
        const latestDepressionResponse = depressionHistory.slice(-1)[0];

        setUserDetails(userDetails);
        setQuizScore(latestQuizResponse.result);
        setDepressionIndex(latestDepressionResponse.averageDepressionScore);

        fetchNearbyCounselors();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (quizScore && depressionIndex !== null) {
      const wq = 0.6; // Weight for quiz score
      const wd = 0.4; // Weight for depression index

      const quizNumericScore = quizScore === "Depressed" ? 1 : 0;

      const score = wq * quizNumericScore + wd * depressionIndex;
      const status = score >= 0.5 ? "Depressed" : "Not Depressed";

      setCombinedResult([score.toFixed(2), status]); // Round score to 2 decimals
    }
  }, [quizScore, depressionIndex]);

  const downloadPDF = () => {
    const options = {
      margin: 1,
      filename: "assessment_report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(reportRef.current).set(options).save();
  };

  if (!quizScore || depressionIndex === null) {
    return (
      <div className="container mt-5">
        <h2 className="text-center">Assessment Report</h2>
        <p className="text-center text-muted">
          Please complete the assessment to generate a report.
        </p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div ref={reportRef} className="report">
        <h2 className="text-center mb-4">Assessment Report</h2>

        {userDetails && (
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5>User Details</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>Name:</strong>{" "}
                {userDetails.surname
                  ? userDetails.name + " " + userDetails.surname
                  : userDetails.name}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p>
                <strong>Age:</strong> {userDetails.age}
              </p>
              <p>
                <strong>Assessment Timestamp:</strong>{" "}
                {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5>Assessment Results</h5>
          </div>
          <div className="card-body">
            <p>
              <strong>Quiz Result:</strong> {quizScore}
            </p>
            <p>
              <strong>Depression Index:</strong> {depressionIndex}
            </p>
            <p>
              <strong>Combined Result Score:</strong> {combinedResult[0]}
            </p>
            <p>
              <strong>Status:</strong> {combinedResult[1]}
            </p>
          </div>
        </div>

        {combinedResult[1] === "Depressed" && (
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5>Recommended Treatment</h5>
            </div>
            <div className="card-body">
              <ul>
                <li>Cognitive Behavioral Therapy</li>
                <li>Regular Exercise</li>
                <li>Improved Sleep Hygiene</li>
              </ul>
            </div>
          </div>
        )}

        {nearbyCounselors.length > 0 && (
          <div className="card mb-4">
            <div className="card-header bg-info text-white">
              <h5>Nearby Counselors</h5>
            </div>
            <div className="card-body">
              <ul>
                {nearbyCounselors.map((counselor, index) => (
                  <li key={index} className="mb-2">
                    <strong>{counselor.name}</strong> - {counselor.vicinity}
                    <p>{counselor.formatted_address}</p>
                    {counselor.contactNumber && (
                      <span> (Contact: {counselor.contactNumber})</span>
                    )}
                    {counselor.rating && (
                      <span> - Rating: {counselor.rating}/5</span>
                    )}
                    {counselor.user_ratings_total && (
                      <span> - Rated By: {counselor.user_ratings_total}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="text-center">
          <button className="btn btn-primary" onClick={downloadPDF}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;
