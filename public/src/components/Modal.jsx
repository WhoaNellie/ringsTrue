import React, { useEffect, useContext, useState } from "react";
import ReactDOM from "react-dom";
import { Doughnut } from 'react-chartjs-2';

function Modal({isShowing, setIsShowing, headline}) {
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.append(modalRoot);
    const [chartState, setChartState] = useState({
        datasets: [
          {
            label: "Accuracy",
            data: [60, 40],
            backgroundColor: ["#008000", "#FFFFFF"],
          },
          {
            label: "Neutrality",
            data: [60, 40],
            backgroundColor: ["#800080", "#FFFFFF"],
          },
        ],
      });
        const options = {
        events: [],
        tooltips: { enabled: false },
        hover: { mode: null },
      };
      

    if(isShowing) {
        return ReactDOM.createPortal(
            <React.Fragment>
            <div className="mask"></div>
            <aside className="modal rating">
                    <h3>How Do You Rate "{headline}"?</h3>
    
                    <Doughnut data={chartState} options={options}/>
    
                    <label htmlFor="accuracy">Accuracy</label>
                    <input id="accuracy" name="accuracy" type="range" min="0" max="100"/>
    
                    <label htmlFor="neutrality">Neutrality</label>
                    <input id="neutrality" name="neutrality" type="range" min="0" max="100"/>
    
                    <button className="submit" onClick={() => setIsShowing(false)}>Submit</button>
                </aside>
            </React.Fragment>, modalRoot
    );
    }else{
        return null;
    }
}
     

export default Modal;