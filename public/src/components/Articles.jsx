import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";

function Articles() {
  const [articleState, setArticleState] = useState({
    rated: [],
    read: [],
    articleArr: [],
  });
  const Login = useContext(UserContext);

  useEffect(() => {
    axios.get("/api/articles").then((articles) => {
      setArticleState({ ...articleState, articleArr: articles.data });
      // for(let i = 0; i < 5 - Login[0].dailyRated; i++){
      //     cardArr.push(<Card article={articleArr[i]}/>);
      //     setArticleState({...articleState, shown: articleState.shown.push(i)});
      // }
    });
  }, []);

  return (
    <React.Fragment>
      {articleState.articleArr.map((article) => {
        return <Card article={article} />;
      })}
    </React.Fragment>
  );
}

function Card({ article }) {
  const [cardState, setCardState] = useState({
    height: "collapsed",
  });

  return (
    <div className={`card article-${article.id} ${cardState.height}`}>
      <h3>{article.headline}</h3>
      <img src={article.image} alt={article.description} />
      <div className="article-text">{article.text}</div>

      {cardState.height === "collapsed" && (
        <button
          className={`read-button article-${article.id}`}
          onClick={() => setCardState({height: 'full'})}
        >
            Read
        </button>
      )}

      <button className="rateButton">Rate</button>
    </div>
  );
}

export default Articles;
