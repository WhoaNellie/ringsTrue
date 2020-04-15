import React, { useContext } from 'react';
import { UserContext } from '../App';
import RorL from '../components/RorL';
import Articles from '../components/Articles';

function Homepage(){
    const Login = useContext(UserContext);
    console.log(Login);
    return(
    <main>
        {Login[0].loggedIn ? <Articles/>:<RorL/>} 
    </main>
    )
}

export default Homepage;
