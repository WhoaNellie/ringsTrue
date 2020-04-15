import React, { useState, useEffect } from 'react';
import { UserContext } from '../App';
import axios from 'axios';

function Articles(){

    useEffect( () => {
        axios.get("/api/articles").then( (articles) => {
            console.log(articles);
        })
    }, [])
    
    return(
    <>
    articles
    </>
    )
}

function Cards(props){
    return (
        <div className="card">
            <h3>{props.headline}</h3>
            <img src={props.image} alt={props.description}/>
        <div className="article-text">{props.text}</div>
        </div>
    )
}

export default Articles;
