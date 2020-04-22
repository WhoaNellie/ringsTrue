import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import { Doughnut } from "react-chartjs-2";
import axios from 'axios';

function Network({name, rating, amount, isShowing, setIsShowing}){
    const [rankState, setRankState] = useState({
      accuracyRank: 0,
      neutralityRank: 0,
      overallRank: 0,
      totalNetworks: 0
    })

    const [chartState, setChartState] = useState({
        datasets: [
            {
                label: "Accuracy",
                data: [rating.accuracy, 100 - rating.accuracy],
                backgroundColor: ["#008000", "#FFFFFF"],
              },
              {
                label: "Neutrality",
                data: [rating.neutrality, 100 - rating.neutrality],
                backgroundColor: ["#800080", "#FFFFFF"],
              }
        ]
      });

    const options = {
      events: [],
      tooltips: { enabled: false },
      hover: { mode: null },
    };
  
    function handleClose() {
      setIsShowing(false);
    }

    useEffect(() => {
      axios.get("/api/all").then(res => {
        let totalRatings = 0;
        let accuracyArr = [];
        let neutralityArr = [];
        let overallArr = [];

        for(let network of res.data){
          totalRatings += network.amount;
        }
        for(let network of res.data){
          let n = network.amount;

          let a = network.rating[0].accuracy;
          let accuracyWeight = Math.pow(Math.pow((100-a),2) + Math.pow((totalRatings - n), 2), 0.5);
          accuracyArr.push(accuracyWeight);

          let b = network.rating[0].neutrality;
          let neutralityWeight = Math.pow(Math.pow((100-b),2) + Math.pow((totalRatings - n), 2), 0.5);
          neutralityArr.push(neutralityWeight);

          overallArr.push((accuracyWeight + neutralityWeight)/2);
        }
        let thisAccuracy = Math.pow(Math.pow((100-rating.accuracy),2) + Math.pow((totalRatings - amount), 2), 0.5);

        let thisNeutrality = Math.pow(Math.pow((100-rating.neutrality),2) + Math.pow((totalRatings - amount), 2), 0.5);

        let thisOverall = (thisAccuracy + thisNeutrality)/2;

        accuracyArr.sort((a,b)=>a-b);
        neutralityArr.sort((a,b)=>a-b);
        overallArr.sort((a,b)=>a-b)

        setRankState({...rankState, 
        accuracyRank: accuracyArr.indexOf(thisAccuracy) + 1,
        neutralityRank: neutralityArr.indexOf(thisNeutrality) + 1,
        overallRank: overallArr.indexOf(thisOverall) + 1,
        totalNetworks: res.data.length})
      })
    }, [])

    if (isShowing) {
      return ReactDOM.createPortal(
        <React.Fragment>
          <div className="mask" onClick={() => handleClose()}></div>
          <aside className="modal network">
            <h3>{name}</h3>
  
            <Doughnut data={chartState} options={options} />

            <div className="network__amount">Number of ratings: {amount}</div>

            <table>
                <thead>
                    <tr>
                        <th>Accuracy</th>
                        <th>Neutrality</th>
                        <th>Overall</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{rankState.accuracyRank}</td>
                        <td>{rankState.neutralityRank}</td>
                        <td>{rankState.overallRank}</td>
                    </tr>
                </tbody>
            </table>
      <div className="ranking__total">Out of {rankState.totalNetworks} total networks</div>
  
          </aside>
        </React.Fragment>,
        document.getElementById("network-root")
      );
    } else {
      return null;
    }
}

export default Network;