import React, { useState } from 'react';
import axios from 'axios';

function Login(){
    const [profState, setProfState] = useState({
        username: "",
        password: ""
    });

    function loginUser(){
        axios.post("/api/login", {
            username: profState.username,
            password: profState.password
        })
    }

    return (
        <main>
        <label for="username">Username</label>
            <input type="text" id="username" onChange={() => setProfState( {...profState, username: document.getElementById("username").value})}/>

            <label for="password">Password</label>
            <input type="password" id="password" onChange={() => setProfState( {...profState, password: document.getElementById("password").value})}/>

            <button id="login" onClick={() => loginUser()}>Login</button>
        </main>
    )
}

export default Login;