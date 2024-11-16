import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-1">
      <p className="mb-0">
        &copy; {new Date().getFullYear()} MaanSick. All Rights Reserved.
      </p>
      <small className="text-muted">
        Empowering mental health with AI-driven solutions.
      </small>
    </footer>
  );
}

export default Footer;
