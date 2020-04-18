import React, { useEffect, useContext, useState } from "react";
import axios from "axios";

import { UserContext } from "../App";
import Modal from "./Modal";
// import { useModal } from "./useModal";

function Articles() {
    const Login = useContext(UserContext);
    const [articleState, setArticleState] = useState({
        rated: [],
        activeArticle: {headline:""},
        articleArr: [],
    });
    const [isShowing, setIsShowing] = useState(false);
    

  function addRated(article) {
    setArticleState({ ...articleState, rated: [...articleState.rated, article.id], activeArticle: article});
    setIsShowing(true);
  }

  useEffect(() => {
    axios.get("/api/articles").then((articles) => {
      let articleArr = [];
      let idArr = [];

      //get random article ids
      while (articleArr.length < 6 - Login[0].dailyRated) {
        let randID = Math.floor(Math.random() * articles.data.length);
        if (!articleState.rated.includes(randID) && !idArr.includes(randID)) {
          articleArr.push(articles.data[randID]);
          idArr.push(randID);
        }
      }
      setArticleState({ ...articleState, articleArr: articleArr });
    });
  }, []);

  return (
    <React.Fragment>
      {articleState.articleArr.map((article) => {
        return (
          <Card
            article={article}
            addRated={() => addRated(article)}
            key={article.id}
          />
        );
      })}
      <div id="modal-root"></div>
      <Modal 
      isShowing={isShowing}
      setIsShowing={setIsShowing}
      article={articleState.activeArticle}
      />
    </React.Fragment>
  );
}

function Card({ article, addRated }) {
  const [cardState, setCardState] = useState({
    height: "collapsed",
  });

  let newText = article.text.replace(/&#9608;/g, String.fromCharCode("&#9608;"));


  newText = newText.split('\n').map((item, i) => {
    return <p key={i}>{item}</p>;});

  return (
    <div className={`card article-${article.id} ${cardState.height}`}>
      <h3>{article.headline}</h3>
      <img src={article.image} alt={article.description} />
      
      
      <div className="article-text">{newText}</div>

      {cardState.height === "collapsed" && (
        <button
          className={`read-button article-${article.id}`}
          onClick={() => setCardState({ height: "full" })}
        >
          Read
        </button>
      )}

      <button className="rate-button" onClick={addRated}>
        Rate
      </button>
    </div>
  );
}

export default Articles;
