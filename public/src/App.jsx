import React, { createContext, useState, useEffect } from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import axios from "axios";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Demo from "./components/Demo";

export const UserContext = createContext();

function App() {
  useEffect(() => {
    if (document.cookie) {
      axios.post("/api/cookie", document.cookie).then((res) => {
        setUserState({
          loggedIn: true,
          dailyRated: res.data.dailyRated,
        });
      });
    }
  }, []);

  const [userState, setUserState] = useState({
    loggedIn: false,
    dailyRated: [1, 2, 3, 4, 5],
  });
  return (
    <div className="wrap">
      <HashRouter>
        <Switch>
          <UserContext.Provider value={[userState, setUserState]}>
            <Header />
            <Route exact path="/" component={Homepage} />
            <Route path="/register" component={Registration} />
            <Route path="/login" component={Login} />
            <Route path="/demo" component={Demo} />
          </UserContext.Provider>
        </Switch>
      </HashRouter>
      <Footer />
      <div id="modal-root"></div>
      <div id="network-root"></div>
    </div>
  );
}

export default App;
