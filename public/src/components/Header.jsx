import React, { useContext } from 'react';
import { UserContext } from '../App';

function Header(){
    const [userState, setUserState] = useContext(UserContext);

    function logOut(){
        setUserState({
            loggedIn: false,
            dailyRated: 5
        });
        document.cookie = "user=''; expires=Thu, 18 Dec 2013 12:00:00 UTC";
    }

    return(
        <header>
            <a href="/">ringsTrue</a>
            {userState.loggedIn && <a href="#" className="logOut" onClick={logOut}>Log Out</a>}
        </header>
    )

}

export default Header;