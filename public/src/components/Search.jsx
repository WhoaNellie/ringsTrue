import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Network from './Network';

function Search(){
    const inputEl = useRef(null);
    const [searchState, setSearchState] = useState({
        query: ""
    });
    const [resultState, setResultState] = useState([]);
    

    useEffect(() => {
        if(searchState.query.trim() != ""){
            axios.post("/api/search", { name: searchState.query }).then((res) => {
                let tempArr = [];
                res.data.map(network => tempArr.push(network.name));
                setResultState(tempArr);
            }).catch(err => {
                console.log(err);
            })
        }
    }, [searchState])

    // function clickME(){
    //     axios.post("/api/search", { name: searchState.query }).then((res) => {
    //                 console.log(res);
    //             })
    // }

    const [isShowing, setIsShowing] = useState(false);
    const [curNetwork, setCurNetwork] = useState({
        name: "",
        rating: {
            accuracy: "",
            neutrality: ""
        }, 
        amount: ""
    });

    function clickSearch(name){
        inputEl.current.value = "";
        setResultState([]);
        axios.get(`/api/search/${name}`).then(res => {
            console.log(res.data);
            let promNetwork = new Promise((resolve, reject) => resolve(setCurNetwork(res.data)));
            promNetwork.then(() => {
                setIsShowing(true);
            })
        });
    }

    return(
        <div className="search">
            <input ref={inputEl} type="text" 
            className="search__input" 
            placeholder="Find a News Network" 
            onChange={() => setSearchState({
                query: inputEl.current.value
            })} 
            onBlur={() => {
                setTimeout(() => {
                    document.getElementById("results").style.display="none";
                }, 500);
            }} 
            onFocus={() => {document.getElementById("results").style.display="block"}}/>

            <div className="searchResults" id="results">
                {resultState.map(result => <SearchEl name={result} inputEl={inputEl} setResultState={setResultState} clickSearch={() => clickSearch(result)}/>)}
            </div>

            {isShowing && <Network
                isShowing={isShowing}
                setIsShowing={setIsShowing}
                name={curNetwork.name}
                rating={curNetwork.rating[0]}
                amount={curNetwork.amount}
            />}
            

            {/* <button className="search__button" onClick={() => clickME()}>Search</button> */}
        </div>
    )

}

function SearchEl({ name, inputEl, setResultState, clickSearch }){    

    return(
        <div className="searchResults__result" onClick={clickSearch}>
        {name}
        </div>
    )
}

export default Search;