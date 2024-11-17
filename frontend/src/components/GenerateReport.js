import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import "./Report.css";

const GenerateReport = ({ token }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [quizScore, setQuizScore] = useState(null);
  const [depressionIndex, setDepressionIndex] = useState(null);
  const [combinedResult, setCombinedResult] = useState([]);
  const [nearbyCounselors, setNearbyCounselors] = useState([]);
  const reportRef = useRef();

  const fetchNearbyCounselors = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      const response = await fetch(
        `http://localhost:5000/api/nearby-counselors?lat=${latitude}&lng=${longitude}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const counselorsWithDistance = (data || []).map((counselor) => {
        const { lat, lng } = counselor.geometry.location;
        const distance = calculateDistance(latitude, longitude, lat, lng);
        return { ...counselor, distance };
      });

      const sortedCounselors = counselorsWithDistance.sort((a, b) => {
        if (b.rating === a.rating) {
          return a.distance - b.distance;
        }
        return b.rating - a.rating;
      });
      // const sortedCounselors = (data || []).sort((a, b) => b.rating - a.rating);
      setNearbyCounselors(sortedCounselors.slice(0, 5));
    } catch (error) {
      console.error("Error fetching nearby counselors:", error);

      if (error.code === 1) {
        alert("Please enable location services to fetch nearby counselors.");
      } else {
        alert("An error occurred while fetching nearby counselors.");
      }
    }
  };
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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

      setCombinedResult([score.toFixed(2), status]);
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
              <strong>PHQ-8 Quiz Result:</strong> {quizScore}
            </p>
            <p>
              <strong>Facial Depression Index:</strong> {depressionIndex}
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
              <div className="row">
                {nearbyCounselors.map((counselor, index) => (
                  <div className="col-md-6 mb-3" key={index}>
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title text-primary">
                          {counselor.name}
                        </h5>
                        <p className="card-text">
                          <small>
                            <strong>Address:</strong>{" "}
                            {counselor.formatted_address}
                          </small>
                        </p>
                        <div className="d-flex flex-wrap gap-2">
                          {counselor.rating && (
                            <span className="badge bg-success">
                              Rating: {counselor.rating}/5
                            </span>
                          )}
                          {counselor.distance && (
                            <span className="badge bg-secondary">
                              Distance: {counselor.distance.toFixed(2)} km
                            </span>
                          )}
                          {counselor.user_ratings_total && (
                            <span className="badge bg-info">
                              Rated By: {counselor.user_ratings_total} users
                            </span>
                          )}
                          {counselor.contactNumber && (
                            <span className="badge bg-warning text-dark">
                              Contact: {counselor.contactNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-2">
          <button className="btn btn-primary" onClick={downloadPDF}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;
