import React, { useState, useEffect } from "react";
import axios from "axios";

function Leaderboard() {
  const [ranks, setRanks] = useState({
    informationRank: [],
    neutralityRank: [],
    overallRank: [],
  });

  const [showBody, setShowBody] = useState(false);

  useEffect(() => {
    axios.get("/api/leaderboard").then((res) => {
      let informationSort = [...res.data];
      let neutralitySort = [...res.data];
      let overallSort = [...res.data];

      informationSort.sort((a,b) => (a.informationWeight > b.informationWeight) ? 1: -1);
      neutralitySort.sort((a,b) => (a.neutralityWeight > b.neutralityWeight) ? 1: -1);
      overallSort.sort((a,b) => (a.overallWeight > b.overallWeight) ? 1: -1);

      setRanks({
          informationRank: informationSort,
          neutralityRank: neutralitySort,
          overallRank: overallSort
      });
      setShowBody(true);
    });
  }, []);

  return (
    <React.Fragment>
    <h2 className="leaderboard">Leaderboard</h2>
    <div className="leaderboard">
      <div>
      <h3 className="leaderboard__category--information">Information</h3>
      <RankList table="information" ranks={ranks.informationRank} showBody={showBody}/>
      </div>
      
      <div>
      <h3 className="leaderboard__category--neutrality">Neutrality</h3>
            <RankList table="neutrality" ranks={ranks.neutralityRank} showBody={showBody}/>

      </div>

      <div>
      <h3 className="leaderboard__category--overall">Overall</h3>
            <RankList table="overall" ranks={ranks.overallRank} showBody={showBody}/>
      </div>
      
    </div>
    </React.Fragment>
  );
}

function RankList({ table, ranks, showBody }) {
  if(showBody){
    let lis = [];
    for (let i = 0; i < Math.min(10, ranks.length); i++) {
        lis.push(<li key={`${i}-rank`}>
            {ranks[i].name}
        </li>);
    }

    return (<ol className={`leaderboard__${table}--rank`}>
        {lis}
    </ol>);
  }else{
      return null;
  }
}

export default Leaderboard;
