import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js"; // Import html2pdf.js

const GenerateReport = ({ token }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [quizScore, setQuizScore] = useState(null);
  const [depressionIndex, setDepressionIndex] = useState(null);
  const [combinedResult, setCombinedResult] = useState([]);
  const [nearbyCounselors, setNearbyCounselors] = useState([]);
  const reportRef = useRef(); // Reference to the report container

  const fetchNearbyCounselors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/nearby-counselors"
      );
      setNearbyCounselors(response.data || []);
    } catch (error) {
      console.error("Error fetching nearby counselors:", error);
    }
  };
  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        };

        // Fetch user profile, quiz history, and depression history in parallel
        const [userRes, quizRes, depressionRes] = await Promise.all([
          fetch("http://localhost:5000/api/user/profile", config),
          fetch("http://localhost:5000/api/quiz/history", config),
          fetch("http://localhost:5000/api/facial/history", config),
        ]);

        // Check for authentication or other errors
        if (!userRes.ok || !quizRes.ok || !depressionRes.ok) {
          throw new Error("Failed to fetch one or more resources");
        }

        const userDetails = await userRes.json();
        const quizHistory = await quizRes.json();
        const depressionHistory = await depressionRes.json();

        // Extract the latest responses
        const latestQuizResponse = quizHistory.slice(-1)[0];
        const latestDepressionResponse = depressionHistory.slice(-1)[0];

        setUserDetails(userDetails);
        setQuizScore(latestQuizResponse.result); // "result" field from the latest quiz response
        setDepressionIndex(latestDepressionResponse.averageDepressionScore); // "averageDepressionScore" field

        console.log(userDetails);
        console.log(latestQuizResponse);
        console.log(latestDepressionResponse);

        // Fetch nearby counselors using Google Maps API
        fetchNearbyCounselors();
      } catch (error) {
        if (error.message.includes("Failed to fetch")) {
          console.error(
            "Authentication failed: Check your token or API endpoints."
          );
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [token]);

  // Calculate combined result using weighted sum
  useEffect(() => {
    if (quizScore && depressionIndex !== null) {
      const wq = 0.6; // Quiz weight
      const wd = 0.4; // Depression index weight

      // Map quiz score to numerical value: "Depressed" = 1, "Not Depressed" = 0
      const quizNumericScore = quizScore === "Depressed" ? 1 : 0;

      // Calculate weighted score
      const score = wq * quizNumericScore + wd * depressionIndex;
      const status = score >= 0.5 ? "Depressed" : "Not Depressed"; // Set threshold for depression

      setCombinedResult([score, status]);
    }
  }, [quizScore, depressionIndex]);

  // Function to download the report as a PDF (exact copy of the webpage)
  const downloadPDF = () => {
    const options = {
      margin: 1,
      filename: "assessment_report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .from(reportRef.current) // The element to be converted
      .set(options)
      .save(); // Trigger download
  };

  // Conditional rendering based on assessment availability
  if (!quizScore || depressionIndex === null) {
    return (
      <div>
        <h2>Assessment Report</h2>
        <p>Please complete the assessment to generate a report.</p>
      </div>
    );
  }

  return (
    <>
      <div ref={reportRef} className="report">
        <h2>Assessment Report</h2>

        {userDetails && (
          <div>
            <h3>User Details</h3>
            <p>Name: {userDetails.name}</p>
            <p>Email: {userDetails.email}</p>
            <p>Age: {userDetails.age}</p>
            <p>Assessment Timestamp: {new Date().toLocaleString()}</p>
          </div>
        )}

        <div>
          <h3>Assessment Results</h3>
          <p>Quiz Result: {quizScore}</p>
          <p>Depression Index: {depressionIndex}</p>
          <p>Combined Result Score: {combinedResult[0]}</p>
          <p>Status: {combinedResult[1]}</p>
        </div>

        {combinedResult[1] === "Depressed" && (
          <div>
            <h3>Recommended Treatment</h3>
            <ul>
              <li>Cognitive Behavioral Therapy</li>
              <li>Regular Exercise</li>
              <li>Improved Sleep Hygiene</li>
            </ul>

            <h3>Nearby Counselors</h3>
            <ul>
              {nearbyCounselors.map((counselor, index) => (
                <li key={index}>
                  <strong>{counselor.name}</strong> - {counselor.vicinity}{" "}
                  (Rating: {counselor.rating || "N/A"})
                </li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={downloadPDF}>Download PDF</button>
      </div>
    </>
  );
};

export default GenerateReport;
