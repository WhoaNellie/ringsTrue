import React from 'react';
import { Link } from "react-router-dom";

function RorL(){
    return(
    <div className="reg-or-log">
        <Link to="/register">
        <button className="reg-or-log__reg">Register</button>
        </Link>
        <p>or</p>
        <Link to="/login">
          <button className="reg-or-log__log">Login</button>
        </Link>
    </div>
    )
}

export default RorL;
