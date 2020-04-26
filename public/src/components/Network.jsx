import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";

function Network({ name, rating, amount, isShowing, setIsShowing }) {
  const [rankState, setRankState] = useState({
    informationRank: 0,
    neutralityRank: 0,
    overallRank: 0,
    totalNetworks: 0,
  });

  const [chartState, setChartState] = useState({
    datasets: [
      {
        label: "Information",
        data: [rating.information, 100 - rating.information],
        backgroundColor: ["#629C44", "#FFFFFF"],
      },
      {
        label: "Neutrality",
        data: [rating.neutrality, 100 - rating.neutrality],
        backgroundColor: ["#633B8E", "#FFFFFF"],
      },
    ],
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
        bottom: 0,
      },
    },
  };

  function handleClose() {
    setIsShowing(false);
  }

  useEffect(() => {
    axios.get("/api/all").then((res) => {
      let totalRatings = 0;
      let informationArr = [];
      let neutralityArr = [];
      let overallArr = [];

      for (let network of res.data) {
        totalRatings += network.amount;
      }
      for (let network of res.data) {
        let n = network.amount;

        let a = network.rating[0].information;
        let informationWeight = Math.pow(
          Math.pow(100 - a, 2) + Math.pow(totalRatings - n, 2),
          0.5
        );
        informationArr.push(informationWeight);

        let b = network.rating[0].neutrality;
        let neutralityWeight = Math.pow(
          Math.pow(100 - b, 2) + Math.pow(totalRatings - n, 2),
          0.5
        );
        neutralityArr.push(neutralityWeight);

        overallArr.push((informationWeight + neutralityWeight) / 2);
      }
      let thisAccuracy = Math.pow(
        Math.pow(100 - rating.information, 2) +
          Math.pow(totalRatings - amount, 2),
        0.5
      );

      let thisNeutrality = Math.pow(
        Math.pow(100 - rating.neutrality, 2) +
          Math.pow(totalRatings - amount, 2),
        0.5
      );

      let thisOverall = (thisAccuracy + thisNeutrality) / 2;

      informationArr.sort((a, b) => a - b);
      neutralityArr.sort((a, b) => a - b);
      overallArr.sort((a, b) => a - b);

      setRankState({
        ...rankState,
        informationRank: informationArr.indexOf(thisAccuracy) + 1,
        neutralityRank: neutralityArr.indexOf(thisNeutrality) + 1,
        overallRank: overallArr.indexOf(thisOverall) + 1,
        totalNetworks: res.data.length,
      });
    });
  }, []);

  if (isShowing) {
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className="mask" onClick={() => handleClose()}></div>
        <aside className="modal network">
          <h3>{name}</h3>

          <Doughnut data={chartState} options={options} />

          <div className="network__amount">Articles Rated: {amount}</div>

          <table>
            <thead>
              <tr>
                <th className="information">Information</th>
                <th className="neutrality">Neutrality</th>
                <th className="overall">Overall</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="information">#{rankState.informationRank}</td>
                <td className="neutrality">#{rankState.neutralityRank}</td>
                <td className="overall">#{rankState.overallRank}</td>
              </tr>
            </tbody>
          </table>
          <div className="ranking__total">
            Out of {rankState.totalNetworks} total networks
          </div>
        </aside>
      </React.Fragment>,
      document.getElementById("network-root")
    );
  } else {
    return null;
  }
}

export default Network;
