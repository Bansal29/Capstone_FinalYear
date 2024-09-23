import React from "react";
import { Link } from "react-router-dom";

function Navbar({ token, handleLogout }) {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary mb-4 shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          MaanSick
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 list-unstyled">
            <li className="nav-item">
              <Link
                className="nav-link active text-decoration-none"
                aria-current="page"
                to="/"
              >
                Home
              </Link>
            </li>
          </ul>

          {!token ? (
            <ul className="d-flex align-items-center gap-3 list-style-type-none;">
              <li className="nav-item text-decoration-none">
                <Link className="nav-link text-decoration-none" to="/login">
                  <button className="btn btn-outline-primary px-4">
                    Login
                  </button>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-decoration-none" to="/signup">
                  <button className="btn btn-primary px-4">Signup</button>
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="ms-auto d-flex align-items-center">
              <li className="nav-item dropdown me-3">
                <Link
                  className="nav-link dropdown-toggle text-decoration-none"
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Actions
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      Settings
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger px-4" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
