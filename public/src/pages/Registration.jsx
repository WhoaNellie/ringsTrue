import React, { useState } from 'react';
import axios from 'axios';

function Registration(){
    const [profState, setProfState] = useState({
        username: "",
        password: ""
    });

    function registerUser(){
        axios.post("/api/register", {
            username: profState.username,
            password: profState.password,
            dailyRated: 0
        })
    }

    return (
        <main>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" onChange={() => setProfState( {...profState, username: document.getElementById("username").value})}/>

            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={() => setProfState( {...profState, password: document.getElementById("password").value})}/>

            <button id="register" onClick={() => registerUser()}>Register</button>
        </main>
    )
}

export default Registration;