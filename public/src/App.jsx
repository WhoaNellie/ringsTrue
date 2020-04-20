import React, { createContext, useState, useEffect } from 'react';
import {
    HashRouter,
    Switch,
    Route
  } from "react-router-dom";
import axios from 'axios';
import Registration from "./pages/Registration";
import Login from './pages/Login';
import Homepage from './pages/Homepage';

export const UserContext = createContext();

function App(){
    useEffect(() => {
        if(document.cookie){
            axios.post("/api/cookie", document.cookie).then(res => {
                console.log(res.data);
                setUserState({
                    loggedIn: true,
                    dailyRated: res.data.dailyRated
                })
            })
        }
    },[])

    const [userState, setUserState] = useState({
        loggedIn: false,
        dailyRated: 5,
        });
    return (
        <div className="wrap">
            <HashRouter>
                <Switch>
                    <UserContext.Provider value={[userState, setUserState]}>
                        <Route exact path="/" component={Homepage}/>
                        <Route path="/register" component={Registration}/>
                        <Route path="/login" component={Login}/>
                    </UserContext.Provider>
                </Switch>
            </HashRouter>

        </div>
    )
}



export default App;