import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";

function Modal({ isShowing, setIsShowing, articleState, setArticleState, setThankYouState }) {
  const [rangeState, setRangeState] = useState({
    accuracy: 50,
    neutrality: 50
  });
  const [chartState, setChartState] = useState({
    datasets: [
      {
        label: "Accuracy",
        data: [rangeState.accuracy, 100 - rangeState.accuracy],
        backgroundColor: ["#629C44", "#FFFFFF"]
      },
      {
        label: "Neutrality",
        data: [rangeState.neutrality, 100 - rangeState.neutrality],
        backgroundColor: ["#633B8E", "#FFFFFF"]
      }
    ]
  });
  const options = {
    events: [],
    tooltips: { enabled: false },
    hover: { mode: null },
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
          top: 0,
          left: 35,
          right: 35,
          bottom: 0
      }
  }
  };

  function handleRange(e, chart) {
    setRangeState({ ...rangeState, [chart]: e.target.value });
    if (chart === "accuracy") {
      setChartState({
        datasets: [
          {
            label: "Accuracy",
            data: [e.target.value, 100 - e.target.value],
            backgroundColor: ["#629C44", "#FFFFFF"]
          },
          {
            label: "Neutrality",
            data: [rangeState.neutrality, 100 - rangeState.neutrality],
            backgroundColor: ["#633B8E", "#FFFFFF"]
          }
        ]
      });
    } else if (chart === "neutrality") {
      setChartState({
        datasets: [
          {
            label: "Accuracy",
            data: [rangeState.accuracy, 100 - rangeState.accuracy],
            backgroundColor: ["#629C44", "#FFFFFF"]
          },
          {
            label: "Neutrality",
            data: [e.target.value, 100 - e.target.value],
            backgroundColor: ["#633B8E", "#FFFFFF"]
          }
        ]
      });
    }
  }

  async function handleSubmit() {
    handleClose();
    let card = document.getElementsByClassName(`article-${articleState.activeArticle.id}`);
    card[0].style.display = "none";
    
    setThankYouState({
      showing: true,
      name: articleState.activeArticle.network
    })


    let oldRating;
    let oldAmount;
    
    //calc new network rating based on new rating and update
    try {
      //check if network is in db
      let res = await axios.get(`/api/network/${articleState.activeArticle.network}`);

      //add network if it isn't
      if (res.data === "none") {
        await axios
          .post("/api/network", {
            name: articleState.activeArticle.network
          });
          oldRating = {
            accuracy: 0,
            neutrality: 0
          };
          oldAmount = 0;
      } else {
        oldRating = res.data.rating[0];
        oldAmount = res.data.amount;
      }

      let newAccuracy = (Number(oldRating.accuracy)*oldAmount + Number(rangeState.accuracy))/(oldAmount + 1);
      let newNeutrality = (Number(oldRating.neutrality)*oldAmount + Number(rangeState.neutrality))/(oldAmount + 1);

      axios
        .put("/api/network", {
          name: articleState.activeArticle.network,
          rating: {
            accuracy: newAccuracy,
            neutrality: newNeutrality
          },
          amount: oldAmount + 1
        })
        .then(function (data) {

        });
    } catch (err) {
      console.log(err);
    }

    //update user dailyRated
    let tempArr = [...articleState.rated, articleState.activeArticle.id];
    setArticleState({...articleState, rated: tempArr});
    axios({
      url:'/api/rate',
      method: 'put',
      data: {dailyRated: tempArr},
      xsrfCookieName: 'user'
    }).then(res => {
      
    })

  }

  function handleClose() {
    setIsShowing(false);
    setRangeState({
      accuracy: 50,
      neutrality: 50
    });
    setChartState({
      datasets: [
        {
          label: "Accuracy",
          data: [50, 50],
          backgroundColor: ["#629C44", "#FFFFFF"]
        },
        {
          label: "Neutrality",
          data: [50, 50],
          backgroundColor: ["#633B8E", "#FFFFFF"]
        }
      ]
    });
  }

  let headline = articleState.activeArticle.headline;
  if (articleState.activeArticle.headline.length > 40) {
    headline = `${articleState.activeArticle.headline.substring(0, 40)}...`;
  }

  if (isShowing) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="mask" onClick={() => handleClose()}></div>
        <aside className="modal rating">
          <h3>How Do You Rate "{headline}"?</h3>

          <Doughnut data={chartState} options={options} />

          <label htmlFor="accuracy">Accuracy</label>
          <input
            id="accuracy"
            name="accuracy"
            type="range"
            min="0"
            max="100"
            value={rangeState.accuracy}
            onChange={(event) => handleRange(event, "accuracy")}
          />

          <label htmlFor="neutrality">Neutrality</label>
          <input
            id="neutrality"
            name="neutrality"
            type="range"
            min="0"
            max="100"
            value={rangeState.neutrality}
            onChange={(event) => handleRange(event, "neutrality")}
          />

          <button className="submit" onClick={() => handleSubmit()}>
            Submit
          </button>
        </aside>
      </React.Fragment>,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
}

function Range({ name, value, onChange, rangeState}){

  return(
    <form>
    <label htmlFor={name}>{name}</label>
          <input
            id={name}
            name={name}
            type="range"
            min="0"
            max="100"
            value={rangeState[name]}
            onChange={(event) => handleRange(event, {name})}
          />
    </form>
  )

}

export default Modal;