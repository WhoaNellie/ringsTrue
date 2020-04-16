import React, { createContext, useState } from 'react';
import {
    HashRouter,
    Switch,
    Route
  } from "react-router-dom";

import Nav from './components/Nav';
import Registration from "./pages/Registration";
import Login from './pages/Login';
import Homepage from './pages/Homepage';

export const UserContext = createContext();

// const Provider = ({children}) => {
//     return <Context.Provider value={userState}>
//         {children}
//     </Context.Provider>
// }


function App(){
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