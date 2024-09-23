import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We will get back to you shortly.");
    setFormData({ name: "", email: "", message: "" }); // Reset form after submission
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Support Resources</h1>
      <p className="text-center lead">
        If you or someone you know is struggling with mental health issues, it’s
        important to know that help is available. Here are some resources to
        provide support.
      </p>

      <h2 className="mt-4">Hotlines and Helplines</h2>
      <ul className="list-group mb-4">
        <li className="list-group-item">
          <strong>National Suicide Prevention Lifeline:</strong>{" "}
          <a href="tel:1-800-273-TALK" className="link-primary">
            1-800-273-TALK (1-800-273-8255)
          </a>
        </li>
        <li className="list-group-item">
          <strong>Crisis Text Line:</strong> Text "HELLO" to{" "}
          <strong>741741</strong> for 24/7 support
        </li>
        <li className="list-group-item">
          <strong>
            Substance Abuse and Mental Health Services Administration (SAMHSA):
          </strong>{" "}
          <a href="tel:1-800-662-HELP" className="link-primary">
            1-800-662-HELP (1-800-662-4357)
          </a>
        </li>
        <li className="list-group-item">
          <strong>MaanSick Helpline:</strong>{" "}
          <a href="tel:1800-123-4567" className="link-primary">
            1800-123-4567
          </a>
        </li>
      </ul>

      <h2>Seeking Support?</h2>
      <p className="mb-4">
        If you would like to reach out for support, please fill out the form
        below. A member of our team will get back to you shortly.
      </p>

      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <textarea
            className="form-control"
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

      <h2 className="mt-4">Additional Resources</h2>
      <p>
        Many communities have local organizations that provide mental health
        support and resources. Check with your local health department for
        programs available in your area.
      </p>
    </div>
  );
}

export default Support;
