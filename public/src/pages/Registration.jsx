import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { UserContext } from '../App';

function Registration(){
    let history = useHistory();
    const [profState, setProfState] = useState({
        username: "",
        password: ""
    });
    const [userState, setUserState] = useContext(UserContext);

    function registerUser(){
        if(profState.password.length >= 6 && profState.username.length >= 4){
            axios.post("/api/register", {
                username: profState.username,
                password: profState.password,
                dailyRated: []
            }).then(res => {
                setUserState({
                    loggedIn: true,
                    dailyRated: []
                });
                history.push("/");
            }).catch(err => {
                if(err.response){
                    console.log(err.response.data.message)
                }
                console.log(err);
            })
        }else{
            console.log("Your username must have at least 4 characters and your passworrd must have at least 6 characters")
        }
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