import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css"; // Import the CSS file for custom styles

function Home() {
  return (
    <div>
      <div
        id="carouselExample"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3000" // Auto-rotate every 3 seconds
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="depression5.png"
              className="d-block w-100 carousel-image"
              alt="Slide 1"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Understanding Depression</h5>
              <p>
                Did you know that 1 in 5 adults experience mental illness each
                year? Understanding these statistics can help reduce stigma and
                promote mental health awareness in our communities.
              </p>
              <p>
                By recognizing the prevalence of mental health issues, we can
                create a more supportive environment for those in need.
              </p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="depression2.jpg"
              className="d-block w-100 carousel-image"
              alt="Slide 2"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Importance of Mental Health</h5>
              <p>
                Depression is not just a personal struggle; it is the leading
                cause of disability worldwide. It's crucial to prioritize mental
                health and seek support when needed.
              </p>
              <p>
                Acknowledging mental health as an integral part of overall
                health is essential for well-being.
              </p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="depression6.jpg"
              className="d-block w-100 carousel-image"
              alt="Slide 3"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Seeking Help</h5>
              <p>
                While 70% of people with depression seek help, only 50% actually
                receive the treatment they need. Breaking down barriers to care
              </p>
              <p>is essential for improving mental health outcomes.</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="container mt-4">
        <h1 className="text-center">
          Welcome to the Mental Health Assessment Quiz
        </h1>
        <p className="text-center">
          The PHQ-8 is a widely used tool for assessing depression. Take our
          quiz to better understand your mental health and explore helpful
          resources.
        </p>
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card">
              <img src="depression6.jpg" className="card-img-top" alt="Learn" />
              <div className="card-body">
                <h5 className="card-title">Learn</h5>
                <p className="card-text">
                  Gain insights into mental health and wellness to improve your
                  understanding and resilience in facing mental health
                  challenges.
                </p>
                <Link to="/learn" className="btn btn-primary">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <Link to="/quiz" className="text-decoration-none">
              <div className="card">
                <img src="assess.png" className="card-img-top" alt="Assess" />
                <div className="card-body">
                  <h5 className="card-title">Assess</h5>
                  <p className="card-text">
                    Take the PHQ-8 quiz to assess your mental health and
                    identify potential areas of concern that may require further
                    attention.
                  </p>
                  <Link to="/quiz" className="btn btn-primary">
                    Take Quiz
                  </Link>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/support" className="text-decoration-none">
              <div className="card">
                <img
                  src="depression4.png"
                  className="card-img-top"
                  alt="Support"
                />
                <div className="card-body">
                  <h5 className="card-title">Support</h5>
                  <p className="card-text">
                    Find resources and support to improve your well-being,
                    including helplines, therapy options, and community
                    resources tailored for mental health.
                  </p>
                  <Link to="/support" className="btn btn-primary">
                    Get Support
                  </Link>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
