import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";

function RorL(){
    const location = useLocation();
    
    return(
    <>
        <Link to="/register" className={location.pathname === "/register" ? "nav-link active" : "nav-link"}>
        <button>Register</button>
        </Link>
        <p>or</p>
        <Link
          to="/login"
          className={location.pathname === "/login" ? "nav-link active" : "nav-link"}
        >
          <button>Login</button>
        </Link>
    </>
    )
}

export default RorL;
