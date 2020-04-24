import React, { useContext } from 'react';
import { UserContext } from '../App';

function Header(){
    const [userState, setUserState] = useContext(UserContext);

    function logOut(){
        setUserState({
            loggedIn: false,
            dailyRated: [1,2,3,4,5]
        });
        document.cookie = "user=''; expires=Thu, 18 Dec 2013 12:00:00 UTC";
    }

    return(
        <header>
            <h1>
                <svg viewBox="0 0 100 25">
                <a href="/">
                <image width="25" href="./img/rings.svg"/>
                <text className="rings" x="29"y="18">rings</text>
                <text x="65" y="18" className="true">True</text>
                </a>
                </svg>
            </h1>

            

            {userState.loggedIn && <a href="#" className="logout" onClick={logOut}>Log Out</a>}
        </header>
    )

}

export default Header;