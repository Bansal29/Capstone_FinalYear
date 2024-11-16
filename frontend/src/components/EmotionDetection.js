import React, { useEffect, useRef, useState } from "react";

function EmotionDetection({ token }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotions, setEmotions] = useState([]);
  const [depressionScores, setDepressionScores] = useState([]); // Array to store depression scores
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null); // State to store the captured image

  // Initialize webcam and stop it when navigating away
  useEffect(() => {
    const video = videoRef.current;
    let stream;

    // Start the webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((s) => {
        stream = s;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => console.error("Error accessing webcam:", err));

    // Cleanup to stop the webcam when the component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop()); // Stop the video stream
      }
    };
  }, []);

  // Capture and send image to backend
  const captureEmotion = async () => {
    setLoading(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const allScores = []; // Array to store depression scores from all captures

    const capture = async (index) => {
      if (index >= 3) {
        // After all 3 captures, calculate the average depression score
        const averageScore =
          allScores.reduce((acc, score) => acc + score, 0) / allScores.length;
        setDepressionScores((prevScores) => [...prevScores, averageScore]); // Set the average depression score
        setLoading(false);
        return;
      }

      // Draw the current video frame onto the canvas
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        // Convert canvas to Blob using a promise
        const blob = await new Promise((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create Blob"));
            }
          }, "image/png");
        });

        // Create a URL for the captured image and set it to imageSrc
        const url = URL.createObjectURL(blob);
        setImageSrc(url);

        // FormData to send the Blob
        const formData = new FormData();
        formData.append("file", blob, "screenshot.png");

        // Send to backend
        const response = await fetch(
          "http://localhost:8000/process_and_predict/",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();
        setEmotions(result.emotions); // Get emotions from response

        // Store depression score for this capture
        allScores.push(result.depression_score);

        // If more captures are needed, set a timeout to capture the next one
        setTimeout(() => capture(index + 1), 5000); // Capture next image in 5 seconds
      } catch (error) {
        console.error("Error processing image:", error);
        setLoading(false);
      }
    };

    // Start the first capture
    capture(0);
  };

  // Send detected data to the backend for storage
  const saveResults = async () => {
    const averageScore =
      depressionScores.reduce((acc, score) => acc + score, 0) /
      depressionScores.length;

    const payload = {
      emotions: emotions,
      averageDepressionScore: averageScore,
    };
    console.log(payload);
    try {
      const response = await fetch("http://localhost:5000/api/facial/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Results saved successfully!");
      } else {
        alert("Failed to save results.");
      }
    } catch (error) {
      console.error("Error saving results:", error);
      alert("Error occurred while saving results.");
    }
  };

  // Reset detected emotions
  const resetEmotions = () => {
    setEmotions([]);
    setDepressionScores([]); // Reset depression scores
    setImageSrc(null); // Reset the captured image
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Emotion Detection using Webcam</h2>
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div style={{ position: "relative" }}>
            <video
              ref={videoRef}
              width="100%"
              className="border rounded shadow"
            ></video>

            {/* Canvas element to draw the bounding box */}
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none", // This ensures the canvas doesn't block interactions
              }}
            ></canvas>
          </div>

          {/* Button to start capturing emotion */}
          <button
            className="btn btn-primary mt-3"
            onClick={captureEmotion}
            disabled={loading}
          >
            {loading ? "Processing..." : "Capture Emotion"}
          </button>

          {/* Button to reset emotions */}
          <button
            className="btn btn-secondary mt-3 ms-3"
            onClick={resetEmotions}
          >
            Reset Emotions
          </button>

          {/* Button to save results */}
          <button className="btn btn-success mt-3 ms-3" onClick={saveResults}>
            Save Results
          </button>
        </div>
      </div>

      {/* Display captured image along with detected emotions */}
      {imageSrc && (
        <div className="row mt-4 justify-content-center">
          <div className="col-md-4 text-center">
            <h4>Captured Image:</h4>
            <img
              src={imageSrc}
              alt="Captured Emotion"
              className="img-fluid mb-3"
              style={{ maxWidth: "100%", maxHeight: "300px" }}
            />
            <h4>Detected Emotions:</h4>
            {emotions.length > 0 ? (
              <ul className="list-group">
                {emotions.map((emotion, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    Emotion: <strong>{emotion.emotion}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No emotions detected yet.</p>
            )}
            {/* Display average depression score */}
            {depressionScores.length > 0 && (
              <div className="mt-3">
                <h5>
                  Average Depression Score:{" "}
                  {depressionScores[depressionScores.length - 1]}
                </h5>
                <p>
                  <strong>Note:</strong> This score is based on the average of
                  the detected emotions.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmotionDetection;
