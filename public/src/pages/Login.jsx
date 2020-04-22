import React, { useState, useContext} from 'react';
import axios from 'axios';
import { UserContext } from '../App';
import { useHistory } from 'react-router-dom';

function Login(){
    let history = useHistory();
    const [inputState, setInputState] = useState({
        username: "",
        password: ""
    });
    const [errMsg, setErrMsg] = useState({
        show: false,
        msg: ""
    });

    const [userState, setUserState] = useContext(UserContext);

    function loginUser(){
        axios.post("/api/login", {
            username: inputState.username,
            password: inputState.password
        }).then( (response) => {
            if(response.status === 200){
                setUserState({
                    loggedIn: true, 
                    dailyRated: response.data.dailyRated});
                history.push("/");
            }
        }).catch(err => {
            document.getElementById("password").value = "";
            setErrMsg({
                show: true,
                msg: err.response.data.message});
        })
    }

    return (
        <main>
            {errMsg.show && <Err setErrMsg={setErrMsg} message={errMsg.msg}/>}
        <label htmlFor="username">Username</label>
            <input type="text" id="username" onChange={() => setInputState( {...inputState, username: document.getElementById("username").value})}/>

            <label htmlFor="password">Password</label>
            <input 
            type="password" 
            id="password" 
            onChange={() => setInputState( {...inputState, password: document.getElementById("password").value})}
            onKeyPress={(event) => {
                if(event.key === "Enter"){
                    loginUser();
                }
            }}
            />

            <button id="login" onClick={() => loginUser()}>Login</button>
        </main>
    )
}

function Err({setErrMsg, message}){
    return(<div className="error">
        {message}
        <button onClick={() => setErrMsg({show: false, msg: ""})}>Dismiss</button>
    </div>)
}

export default Login;