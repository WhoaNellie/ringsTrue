import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { Doughnut } from 'react-chartjs-2';

function Articles() {
  const [articleState, setArticleState] = useState({
    rated: [],
    articleArr: [],
  });
  const Login = useContext(UserContext);

  function addRated(id){
    setArticleState({...articleState, rated:[...articleState.rated, id]});
  }

  useEffect(() => {
    axios.get("/api/articles").then((articles) => {
        let articleArr = [];
        let idArr = [];

        //get random article ids
        while(articleArr.length < 6-Login[0].dailyRated){
            let randID = Math.floor(Math.random()*20);
            if(!articleState.rated.includes(randID) && !idArr.includes(randID)){
                articleArr.push(articles.data[randID]);
                idArr.push(randID);
            }
        }
        setArticleState({ ...articleState, articleArr: articleArr });
    });
  }, []);

  return (
    <React.Fragment>
        <RatingModal/>
        {articleState.articleArr.map((article) => {
            return <Card article={article} addRated={() => addRated(article.id)} key={article.id}/>;
        })}
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
          onClick={() => setCardState({height: 'full'})}
        >
            Read
        </button>
      )}

      <button className="rate-button" onClick={addRated}>Rate</button>
    </div>
  );
}

function RatingModal(){
    const [chartState, setChartState] = useState({
        datasets: [{
            label: "Accuracy",
            data: [60, 40],
            backgroundColor: [
                "#008000",
                "#FFFFFF"
            ]
        },{
            label: "Neutrality",
            data: [60, 40],
            backgroundColor: [
                "#800080",
                "#FFFFFF"
            ]
        }]
    });

    let options = {
        events: [],
        tooltips: {enabled: false},
        hover: {mode: null},
      }

    return(
        <div className="modal rating">
            <Doughnut data={chartState} options={options}/>
        </div>
    )
}

export default Articles;
