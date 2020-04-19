import React, { useState } from 'react';
import ReactDOM from "react-dom";
import { Doughnut } from "react-chartjs-2";

function Network({name, rating, amount, isShowing, setIsShowing}){
    let oldDiv = document.getElementById("modal-root");
    if(oldDiv){
        oldDiv.remove();
    }
    const modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "modal-root");
    document.body.append(modalRoot);
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

    console.log(rating[0]);
    // if(rating[0]){
    //     setChartState({
    //         datasets: [
    //             {
    //                 label: "Accuracy",
    //                 data: [rating[0].accuracy, 100 - rating[0].accuracy],
    //                 backgroundColor: ["#008000", "#FFFFFF"],
    //               },
    //               {
    //                 label: "Neutrality",
    //                 data: [rating.neutrality, 100 - rating.neutrality],
    //                 backgroundColor: ["#800080", "#FFFFFF"],
    //               }
    //         ]
    //       });
    // }

    

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
        modalRoot
      );
    } else {
      return null;
    }
}

export default Network;