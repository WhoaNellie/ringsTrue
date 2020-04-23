import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { UserContext } from '../App';

function Registration(){
    let history = useHistory();
    const [profState, setProfState] = useState({
        username: "",
        password: "",
        confirm: ""
    });
    const [errMsg, setErrMsg] = useState({
        show: false,
        msg: ""
    });
    const [userState, setUserState] = useContext(UserContext);

    function registerUser(){
        axios.post("/api/register", {
                username: profState.username.trim(),
                password: profState.password,
                confirm: profState.confirm
            }).then(res => {
                setUserState({
                    loggedIn: true,
                    dailyRated: []
                });
                history.push("/");
            }).catch(err => {
                document.getElementById("password").value = "";
                document.getElementById("confirm").value = "";
                setErrMsg({
                    show: true,
                    msg: err.response.data.message});
            })
    }
    return (
        <main>
            {errMsg.show && <Err setErrMsg={setErrMsg} message={errMsg.msg}/>}

            <label htmlFor="username">Username</label>
            <input type="text" id="username" onChange={() => setProfState( {...profState, username: document.getElementById("username").value})}/>

            <label htmlFor="password">Password</label>
            <input 
            type="password" 
            id="password" 
            onChange={() => setProfState( {...profState, password: document.getElementById("password").value})}
            />

            <label htmlFor="confirm">Confirm Password</label>
            <input 
            type="password" 
            id="confirm" 
            onChange={() => setProfState( {...profState, confirm: document.getElementById("confirm").value})}
            onKeyPress={(event) => {
                if(event.key === "Enter"){
                    registerUser();
                }
            }}/>

            <button id="register" onClick={() => registerUser()}>Register</button>

            <div className="req requirements--username">
                <h3>Your Username Must:</h3>
                <ul>
                <li>Be at least 6 characters long</li>
                </ul>
            </div>
            <div className=" req requirements--password">
                <h3>Your Password Must:</h3>
                <ul>
                <li>Be at least 8 characters long</li>
                <li>Not be included in the <a href="https://en.wikipedia.org/wiki/Wikipedia:10,000_most_common_passwords#Top_100">100 most common passwords</a></li>
                </ul>
            </div>
        </main>
    )
}

function Err({setErrMsg, message}){
    return(<div className="error">
        {message}
        <button onClick={() => setErrMsg({show: false, msg: ""})}>X</button>
    </div>)
}

export default Registration;