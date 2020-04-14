import React from "react";
import { Link, useLocation } from "react-router-dom";

function Nav() {
  const location = useLocation();

  return (
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <Link to="/" className={location.pathname === "/" ? "nav-link active" : "nav-link"}>
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/register"
          className={location.pathname === "/register" ? "nav-link active" : "nav-link"}
        >
          Register
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/login"
          className={location.pathname === "/login" ? "nav-link active" : "nav-link"}
        >
          Login
        </Link>
      </li>
    </ul>
  );
}

export default Nav;
