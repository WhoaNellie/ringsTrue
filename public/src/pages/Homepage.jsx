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
            {Login[0].loggedIn ? <Articles/>:<RorL/>}
        </CookiesProvider>
    </main>
    )
}

export default Homepage;
