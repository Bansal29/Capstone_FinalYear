import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function Learn() {
  const disorders = [
    {
      title: "Anxiety Disorders",
      description:
        "Anxiety disorders involve excessive fear or anxiety. Common types include Generalized Anxiety Disorder (GAD), Panic Disorder, and Social Anxiety Disorder.",
      symptoms: [
        "Persistent worry or fear",
        "Restlessness",
        "Fatigue",
        "Difficulty concentrating",
        "Sleep disturbances",
      ],
      copingStrategies: [
        "Practice deep breathing exercises.",
        "Engage in regular physical activity.",
        "Maintain a balanced diet.",
        "Consider talking to a mental health professional.",
        "Join a support group.",
      ],
      links: [
        {
          name: "Learn More",
          url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
        },
      ],
    },
    {
      title: "Depression",
      description:
        "Depression is a mood disorder that causes persistent feelings of sadness and loss of interest. It affects how you feel, think, and handle daily activities.",
      symptoms: [
        "Persistent sadness or low mood",
        "Loss of interest in activities once enjoyed",
        "Changes in appetite or weight",
        "Sleep disturbances",
        "Fatigue or lack of energy",
      ],
      copingStrategies: [
        "Engage in regular physical activity.",
        "Practice mindfulness and meditation.",
        "Talk to a friend or family member.",
        "Set small goals and celebrate achievements.",
        "Seek professional help if needed.",
      ],
      links: [
        {
          name: "Learn More",
          url: "https://www.nimh.nih.gov/health/topics/depression",
        },
      ],
    },
    {
      title: "Post-Traumatic Stress Disorder (PTSD)",
      description:
        "PTSD is a mental health condition triggered by a traumatic event. Symptoms may include flashbacks, nightmares, and severe anxiety.",
      symptoms: [
        "Intrusive memories of the event",
        "Avoidance of reminders of the trauma",
        "Negative changes in thoughts and mood",
        "Heightened reactions",
        "Difficulty sleeping",
      ],
      copingStrategies: [
        "Talk to someone you trust about your feelings.",
        "Consider professional therapy or counseling.",
        "Practice grounding techniques.",
        "Engage in calming activities like yoga or meditation.",
        "Keep a journal to express your thoughts.",
      ],
      links: [
        {
          name: "Learn More",
          url: "https://www.nimh.nih.gov/health/topics/post-traumatic-stress-disorder-ptsd",
        },
      ],
    },
  ];

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4 text-primary">
        Learn About Common Mental Health Disorders
      </h1>
      <p className="text-center mb-4 text-secondary">
        Understanding mental health disorders is crucial for promoting awareness
        and fostering empathy. Here are some common disorders, their symptoms,
        and coping strategies.
      </p>

      <div className="row mt-4">
        {disorders.map((disorder, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card h-100 shadow-lg border-light">
              <div className="card-body">
                <h5 className="card-title text-info">{disorder.title}</h5>
                <p className="card-text text-muted">
                  <strong>Description:</strong> {disorder.description}
                </p>
                <p className="card-text">
                  <strong>Symptoms:</strong>
                </p>
                <ul>
                  {disorder.symptoms.map((symptom, idx) => (
                    <li key={idx} className="text-secondary">
                      {symptom}
                    </li>
                  ))}
                </ul>
                <p className="card-text">
                  <strong>Coping Strategies:</strong>
                </p>
                <ul>
                  {disorder.copingStrategies.map((strategy, idx) => (
                    <li key={idx} className="text-secondary">
                      {strategy}
                    </li>
                  ))}
                </ul>
                <div className="text-center">
                  {disorder.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      className="btn btn-outline-primary m-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Learn;
