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
    const commonPws = ["123456", "password", "12345678", "qwerty", "123456789", "12345", "1234", "111111", "1234567", "dragon", "123123", "baseball", "abc123", "football", "monkey", "letmein", "696969", "shadow", "master", "666666", "qwertyuiop", "123321", "mustang", "1234567890", "michael", "654321", "pussy", "superman", "1qaz2wsx", "7777777", "fuckyou", "121212", "000000", "qazwsx", "123qwe", "killer", "trustno1", "jordan", "jennifer", "zxcvbnm", "asdfgh", "hunter", "buster", "soccer", "harley", "batman", "andrew", "tigger", "sunshine", "iloveyou", "fuckme", "2000", "charlie", "robert", "thomas", "hockey", "ranger", "daniel", "starwars", "klaster", "112233", "george", "asshole", "computer", "michelle", "jessica", "pepper", "1111", "zxcvbn", "555555", "11111111", "131313", "freedom", "777777", "pass", "fuck", "maggie", "159753", "aaaaaa", "ginger", "princess", "joshua", "cheese", "amanda", "summer", "love", "ashley", "6969", "nicole", "chelsea", "biteme", "matthew", "access", "yankees", "987654321", "dallas", "austin", "thunder", "taylor", "matrix"];

    function registerUser(){
        if(profState.username.trim().length >= 6){
            if(profState.password.length >= 8){
                if(profState.password === profState.confirm){
                    if(!commonPws.includes(profState.password))
                        {axios.post("/api/register", {
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
                        setErrMsg({
                            show: true,
                            msg: "Your password is in the top 100 most common."
                        })
                    }
                }else{
                    setErrMsg({
                        show: true,
                        msg: "Your passwords do not match."
                    })
                }
            }else{
                setErrMsg({
                    show: true,
                    msg: "Your password must be at least 8 characters long."
                })
            }
        }else{
            setErrMsg({
                show: true,
                msg: "Your username must be at least 6 characters long."
            })
        }
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

            <div className="requirements--username">
                <h3>Your Username Must:</h3>
                <ul>
                <li>Be at least 6 characters long</li>
                </ul>
            </div>
            <div className="requirements--password">
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
    document.getElementById("password").value = "";
    document.getElementById("confirm").value = "";
    return(<div className="error">
        {message}
        <button onClick={() => setErrMsg({show: false, msg: ""})}>Dismiss</button>
    </div>)
}

export default Registration;