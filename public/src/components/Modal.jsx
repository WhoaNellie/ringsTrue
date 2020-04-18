import React, { useEffect, useContext, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";

function Modal({ isShowing, setIsShowing, article }) {
  const modalRoot = document.createElement("div");
  modalRoot.setAttribute("id", "modal-root");
  document.body.append(modalRoot);
  const [rangeState, setRangeState] = useState({
    accuracy: 50,
    neutrality: 50,
  });
  const [chartState, setChartState] = useState({
    datasets: [
      {
        label: "Accuracy",
        data: [rangeState.accuracy, 100 - rangeState.accuracy],
        backgroundColor: ["#008000", "#FFFFFF"],
      },
      {
        label: "Neutrality",
        data: [rangeState.neutrality, 100 - rangeState.neutrality],
        backgroundColor: ["#800080", "#FFFFFF"],
      },
    ],
  });
  const options = {
    events: [],
    tooltips: { enabled: false },
    hover: { mode: null },
  };

  function handleRange(e, chart) {
    setRangeState({ ...rangeState, [chart]: e.target.value });
    if (chart === "accuracy") {
      setChartState({
        datasets: [
          {
            label: "Accuracy",
            data: [e.target.value, 100 - e.target.value],
            backgroundColor: ["#008000", "#FFFFFF"],
          },
          {
            label: "Neutrality",
            data: [rangeState.neutrality, 100 - rangeState.neutrality],
            backgroundColor: ["#800080", "#FFFFFF"],
          },
        ],
      });
    } else if (chart === "neutrality") {
      setChartState({
        datasets: [
          {
            label: "Accuracy",
            data: [rangeState.accuracy, 100 - rangeState.accuracy],
            backgroundColor: ["#008000", "#FFFFFF"],
          },
          {
            label: "Neutrality",
            data: [e.target.value, 100 - e.target.value],
            backgroundColor: ["#800080", "#FFFFFF"],
          },
        ],
      });
    }
  }

  async function handleSubmit() {
    handleClose();
    let oldRating;
    let oldAmount;
    try {
      let res = await axios.get(`/api/network/${article.network}`);
      console.log(res.data);
      if (res.data === "none") {
        await axios
          .post("/api/network", {
            name: article.network,
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

      console.log(oldRating);
      console.log(oldAmount);

      let newAccuracy = (Number(oldRating.accuracy)*oldAmount + Number(rangeState.accuracy))/(oldAmount + 1);
      let newNeutrality = (Number(oldRating.neutrality)*oldAmount + Number(rangeState.neutrality))/(oldAmount + 1);

      axios
        .put("/api/network", {
          name: article.network,
          rating: {
            accuracy: newAccuracy,
            neutrality: newNeutrality
          },
          amount: oldAmount + 1
        })
        .then(function (data) {
          console.log(data);
        });
    } catch (err) {
      console.log(err);
    }
  }

  function handleClose() {
    setIsShowing(false);
    setRangeState({
      accuracy: 50,
      neutrality: 50,
    });
    setChartState({
      datasets: [
        {
          label: "Accuracy",
          data: [50, 50],
          backgroundColor: ["#008000", "#FFFFFF"],
        },
        {
          label: "Neutrality",
          data: [50, 50],
          backgroundColor: ["#800080", "#FFFFFF"],
        },
      ]
    });
  }

  let headline = article.headline;
  if (article.headline.length > 40) {
    headline = `${article.headline.substring(0, 40)}...`;
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
      modalRoot
    );
  } else {
    return null;
  }
}

export default Modal;
