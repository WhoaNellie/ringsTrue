import React, { useState } from 'react';
import ReactDOM from "react-dom";
import { Doughnut } from "react-chartjs-2";

function Network({name, rating, amount, isShowing, setIsShowing}){
    let oldDiv = document.getElementById("network-root");
    if(oldDiv){
        oldDiv.remove();
    }
    const networkRoot = document.createElement("div");
    networkRoot.setAttribute("id", "network-root");
    document.getElementById("app").append(networkRoot);
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
                        <td>[39]</td>
                        <td>[16]</td>
                        <td>[7]</td>
                    </tr>
                </tbody>
            </table>
            <div className="ranking__total">Out of [total networks]</div>
  
          </aside>
        </React.Fragment>,
        networkRoot
      );
    } else {
      return null;
    }
}

export default Network;