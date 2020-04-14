import React from 'react';
import {
    HashRouter,
    Switch,
    Route
  } from "react-router-dom";

import Nav from './components/Nav';
import Registration from "./pages/Registration";
import Login from './pages/Login';


function App(){
    return (
        <div className="wrap">
            <HashRouter>
            <Nav></Nav>
                <Switch>
                    <Route exact path="/">

                    homepage?!??
                    </Route>
                    <Route path="/register" component={Registration}/>
                    <Route path="/login" component={Login}/>
                </Switch>
            </HashRouter>

        </div>
    )
}

export default App;