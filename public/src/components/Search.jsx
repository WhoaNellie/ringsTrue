import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Search(){
    const inputEl = useRef(null);
    const [searchState, setSearchState] = useState({
        query: ""
    });

    useEffect(() => {
        axios.post("/api/search", { name: searchState.query }).then((res) => {
            console.log(res);
        })
    }, [searchState])

    function clickME(){
        axios.post("/api/search", { name: searchState.query }).then((res) => {
                    console.log(res);
                })
    }

    return(
        <div className="search">
            <input ref={inputEl} type="text" className="search__input" placeholder="Find a News Network" onChange={() => setSearchState({
                query: inputEl.current.value
            })}/>
            <button className="search__button" onClick={() => clickME()}>Search</button>
        </div>
    )

}

function SearchEl({ name }){

}

export default Search;