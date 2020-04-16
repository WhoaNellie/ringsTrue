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
        let randID = Math.floor(Math.random() * 20);
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
      headline={articleState.activeArticle.headline}
      />
    </React.Fragment>
  );
}

function Card({ article, addRated }) {
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

// function RatingModal(props) {
//   return (
//     <React.Fragment>
//       <div className="mask"></div>
//       <aside className="modal rating">
//         <h3>{props.title}</h3>

//         <Doughnut data={chartState} options={options} />

//         <label htmlFor="accuracy">Accuracy</label>
//         <input id="accuracy" name="accuracy" type="range" min="0" max="100" />

//         <label htmlFor="neutrality">Neutrality</label>
//         <input
//           id="neutrality"
//           name="neutrality"
//           type="range"
//           min="0"
//           max="100"
//         />

//         <button className="submit">Submit</button>
//       </aside>
//     </React.Fragment>
//   );
// }

export default Articles;
