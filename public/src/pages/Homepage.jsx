import React, { useContext } from 'react';
import { UserContext } from '../App';
import { CookiesProvider } from 'react-cookie';
import Search from '../components/Search';
import RorL from '../components/RorL';
import Articles from '../components/Articles';
import Leaderboard from '../components/Leaderboard';

function Homepage(){
    const Login = useContext(UserContext);
    return(
    <div className="wrap">
        <Search/>
    <main>
        <CookiesProvider>
            {!Login[0].loggedIn && <p className="blurb">ringsTrue is a news network rating app where anyone can be the judge. You will be asked to critique five anonymized articles a day. Then compare your rating to the network's overall ranking and to your preconcieved notions!</p>}
            {Login[0].loggedIn ? <Articles/>:<RorL/>}
        </CookiesProvider>
        <Leaderboard/>
    </main>
    </div>
    
    )
}

export default Homepage;
