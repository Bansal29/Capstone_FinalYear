import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Quiz from "./components/Quiz";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Navbar from "./components/Navbar"; // Import the Navbar component
import { useNavigate } from "react-router-dom"; // Import useNavigate
import UserProfile from "./components/UserProfile";
import Learn from "./components/Learn";
import Support from "./components/Support";
import QuizHistory from "./components/QuizHistory";

function App() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/"); // Use navigate to redirect to home
  };

  return (
    <div>
      <Navbar token={token} handleLogout={handleLogout} />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz token={token} />} />
          <Route path="/quiz/history" element={<QuizHistory token={token} />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
