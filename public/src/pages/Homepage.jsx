import React, { useContext } from 'react';
import { UserContext } from '../App';
import RorL from '../components/RorL';
import Articles from '../components/Articles';
import Search from '../components/Search';
import Header from '../components/Header';
import { CookiesProvider } from 'react-cookie';

function Homepage(){
    const Login = useContext(UserContext);
    return(
    <main>
        <Header/>
        <Search/>
        <CookiesProvider>
            {!Login[0].loggedIn && <p className="blurb">ringsTrue is a news network rating app where anyone can be the judge. You will be asked to critique five anonymized articles a day. Then you can compare your rating to the network's overall ranking and to your preconcieved notions!</p>}
            {Login[0].loggedIn ? <Articles/>:<RorL/>}
        </CookiesProvider>
    </main>
    )
}

export default Homepage;
