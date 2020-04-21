import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import ReactImageFallback from "react-image-fallback";

import { UserContext } from "../App";
import Modal from "./Modal";
import Network from "./Network";

function Articles() {
    const Login = useContext(UserContext);
    const [articleState, setArticleState] = useState({
        rated: Login[0].dailyRated,
        activeArticle: {headline:""},
        articleArr: []
    });
    const [isShowing, setIsShowing] = useState(false);
    const [thankYouState, setThankYouState] = useState({
      showing: false,
      name: '',
      rating: [],
      amount: 0
    });
    const [networkShowing, setNetworkShowing] = useState(false);
    

  function showModal(article) {
    setArticleState({ ...articleState, activeArticle: article});
    setIsShowing(true);
  }

  function getNetwork(name){
    axios.get(`/api/network/${name}`).then(res => {
      console.log(res);
      setThankYouState({
        showing: true,
        name: res.data.name,
        rating: res.data.rating,
        amount: res.data.amount
      });
      setNetworkShowing(true);
    })
  }

  useEffect(() => {
    axios.get("/api/articles").then((articles) => {
      let articleArr = [];
      let idArr = [];

      //get random article ids
      while (articleArr.length < 5 - Login[0].dailyRated.length) {
        let randID = Math.floor(Math.random() * articles.data.length);
        if (!Login[0].dailyRated.includes(randID) && !idArr.includes(randID)) {
          articleArr.push(articles.data[randID]);
          idArr.push(randID);
        }
      }
      setArticleState({ ...articleState, articleArr: articleArr });
    });
  }, []);

  return (
    <React.Fragment>
      {thankYouState.showing && <ThankYouCard 
      name={thankYouState.name}
      closeCard={() => setThankYouState({
        showing: false,
        name: ''
      })}
      getNetwork={getNetwork}/>}
      {articleState.articleArr.map((article) => {
        return (
          <Card
            article={article}
            showModal={() => showModal(article)}
            key={article.id}
          />
        );
      })}
      <Modal 
        isShowing={isShowing}
        setIsShowing={setIsShowing}
        articleState={articleState}
        setArticleState={setArticleState}
        setThankYouState={setThankYouState}
      />
      {networkShowing && <Network
                isShowing={networkShowing}
                setIsShowing={setNetworkShowing}
                name={thankYouState.name}
                rating={thankYouState.rating[0]}
                amount={thankYouState.amount}
            />}
      
    </React.Fragment>
  );
}

function Card({ article, showModal }) {
  const [cardState, setCardState] = useState({
    height: "collapsed",
  });

  let newText = article.text.replace(/&#9608;/g, String.fromCharCode("&#9608;"));


  newText = newText.split('\n').map((item, i) => {
    return <p key={i}>{item}</p>;});

  return (
    <div className={`card article-${article.id} ${cardState.height}`}>
      <h3>{article.headline}</h3>
      
      <ReactImageFallback
        src={article.image} 
        fallbackImage="./img/broken.jpg"
        alt={article.description}
        initialImage="./img/largeload.gif"
      />
      
      <div className="article-text">{newText}</div>

      {cardState.height === "collapsed" && (
        <button
          className={`read-button article-${article.id}`}
          onClick={() => setCardState({ height: "full" })}
        >
          Read
        </button>
      )}

      <button className="rate-button" onClick={showModal}>
        Rate
      </button>
    </div>
  );
}

function ThankYouCard({ name, closeCard, getNetwork }){
  return (
    <div className={`thankYouCard`}>
      <h3>Thank you!</h3>

      <p>That article was from <a href="#" onClick={() => getNetwork(name)}>{name}</a>. Did it meet your expectations?</p>

      <button className="rate-button" onClick={closeCard}>
        X
      </button>
    </div>
  );
}
export default Articles;
