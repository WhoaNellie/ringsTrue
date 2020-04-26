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

    const [isShowing, setIsShowing] = useState(false);
    const [curNetwork, setCurNetwork] = useState({
        name: "",
        rating: {
            information: "",
            neutrality: ""
        }, 
        amount: ""
    });

    function clickSearch(name){
        inputEl.current.value = "";
        setResultState([]);
        axios.get(`/api/network/${name}`).then(res => {
            let promNetwork = new Promise((resolve, reject) => resolve(setCurNetwork(res.data)));
            promNetwork.then(() => {
                setIsShowing(true);
            })
        });
    }

    return(
        <div className="search">
            <div className="search__bar">
            <label 
            htmlFor="search__input"
            style={{textIndent: "-9999px"}}
            >Search for Network</label>
            <input 
            ref={inputEl} 
            id="search__input"
            type="text" 
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
            onFocus={() => {document.getElementById("results").style.display="block"}}
            onKeyPress={(event) => {
                if(event.key === "Enter"){
                    clickSearch(resultState[0]);
                }
            }}
            />
            <button className="search__button" onClick={() => clickSearch(resultState[0])}>Search</button>
            </div>
            

            <div className="results" id="results">
                {resultState.map((result, index) => <SearchEl 
                    name={result} 
                    inputEl={inputEl} 
                    setResultState={setResultState} 
                    clickSearch={() => clickSearch(result)}
                    key={index}
                    />
                
                )}
            </div>

            {isShowing && curNetwork.name && <Network
                isShowing={isShowing}
                setIsShowing={setIsShowing}
                name={curNetwork.name}
                rating={curNetwork.rating[0]}
                amount={curNetwork.amount}
            />}
            

            
        </div>
    )

}

function SearchEl({ name, clickSearch }){    

    return(
        <div className="results__result" onClick={clickSearch}>
        {name}
        </div>
    )
}

export default Search;