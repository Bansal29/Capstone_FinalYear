import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Quiz from "./components/Quiz";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
import UserProfile from "./components/UserProfile";
import Learn from "./components/Learn";
import Support from "./components/Support";
import QuizHistory from "./components/QuizHistory";
import EmotionDetection from "./components/EmotionDetection";
import FacialHistory from "./components/FacialHistory";
import Footer from "./components/Footer";
import GenerateReport from "./components/GenerateReport";

function App() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
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
          <Route path="/facial" element={<EmotionDetection token={token} />} />
          <Route path="/report" element={<GenerateReport token={token} />} />
          <Route
            path="/facial/history"
            element={<FacialHistory token={token} />}
          />
        </Routes>
      </div>
      <Footer>
        <Footer />
      </Footer>
    </div>
  );
}

export default App;
