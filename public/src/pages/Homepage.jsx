import React, { useContext } from 'react';
import { UserContext } from '../App';
import RorL from '../components/RorL';
import Articles from '../components/Articles';
import Search from '../components/Search';
import Header from '../components/Header';

function Homepage(){
    const Login = useContext(UserContext);
    return(
    <main>
        <Header/>
        <Search/>
        {Login[0].loggedIn ? <Articles/>:<RorL/>}
    </main>
    )
}

export default Homepage;
