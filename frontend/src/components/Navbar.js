// import React from "react";
// import { Link } from "react-router-dom";

// function Navbar({ token, handleLogout }) {
//   return (
//     <nav className="navbar navbar-expand-lg bg-body-tertiary mb-4 shadow-sm">
//       <div className="container-fluid">
//         <Link className="navbar-brand fw-bold" to="/">
//           MaanSick
//         </Link>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarSupportedContent"
//           aria-controls="navbarSupportedContent"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarSupportedContent">
//           <ul className="navbar-nav me-auto mb-2 mb-lg-0 list-unstyled">
//             <li className="nav-item">
//               <Link
//                 className="nav-link active text-decoration-none"
//                 aria-current="page"
//                 to="/"
//               >
//                 Home
//               </Link>
//             </li>
//             {token && ( // Render Quiz History link only if token exists
//               <li className="nav-item">
//                 <Link
//                   className="nav-link text-decoration-none"
//                   to="/quiz/history"
//                 >
//                   Quiz History
//                 </Link>
//               </li>
//             )}
//           </ul>

//           {!token ? (
//             <ul className="d-flex align-items-center gap-3 list-style-type-none;">
//               <li className="nav-item text-decoration-none">
//                 <Link className="nav-link text-decoration-none" to="/login">
//                   <button className="btn btn-outline-primary px-4">
//                     Login
//                   </button>
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link text-decoration-none" to="/signup">
//                   <button className="btn btn-primary px-4">Signup</button>
//                 </Link>
//               </li>
//             </ul>
//           ) : (
//             <ul className="ms-auto d-flex align-items-center">
//               <li className="nav-item dropdown me-3">
//                 <Link
//                   className="nav-link dropdown-toggle text-decoration-none"
//                   to="#"
//                   role="button"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
//                 >
//                   Actions
//                 </Link>
//                 <ul className="dropdown-menu">
//                   <li>
//                     <Link className="dropdown-item" to="/profile">
//                       Profile
//                     </Link>
//                   </li>
//                   <li>
//                     <Link className="dropdown-item" to="/settings">
//                       Settings
//                     </Link>
//                   </li>
//                 </ul>
//               </li>
//               <li className="nav-item">
//                 <button className="btn btn-danger px-4" onClick={handleLogout}>
//                   Logout
//                 </button>
//               </li>
//             </ul>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ token, handleLogout }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check and set dark mode from localStorage on component mount
  useEffect(() => {
    const darkModeSetting = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkModeSetting);
    document.body.classList.toggle("dark-mode", darkModeSetting);
  }, []);

  // Handle mode switch
  const handleModeSwitch = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode);
      // Apply the dark mode class to the body
      document.body.classList.toggle("dark-mode", newMode);
      return newMode;
    });
  };

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
            {token && (
              <li className="nav-item">
                <Link
                  className="nav-link text-decoration-none"
                  to="/quiz/history"
                >
                  Quiz History
                </Link>
              </li>
            )}
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
                  <li className="dropdown-item d-flex align-items-center">
                    <label className="form-check form-switch me-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={handleModeSwitch}
                      />
                      <span className="form-check-label">Dark Mode</span>
                    </label>
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
