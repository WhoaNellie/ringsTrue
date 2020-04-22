import React, { useState, useEffect } from "react";
import axios from "axios";

function Leaderboard() {
  const [ranks, setRanks] = useState({
    accuracyRank: [],
    neutralityRank: [],
    overallRank: [],
  });

  const [showBody, setShowBody] = useState(false);

  useEffect(() => {
    axios.get("/api/leaderboard").then((res) => {
      let accuracySort = [...res.data];
      let neutralitySort = [...res.data];
      let overallSort = [...res.data];

      accuracySort.sort((a,b) => (a.accuracyWeight > b.accuracyWeight) ? 1: -1);
      neutralitySort.sort((a,b) => (a.neutralityWeight > b.neutralityWeight) ? 1: -1);
      overallSort.sort((a,b) => (a.overallWeight > b.overallWeight) ? 1: -1);

      setRanks({
          accuracyRank: accuracySort,
          neutralityRank: neutralitySort,
          overallRank: overallSort
      });
      setShowBody(true);
    });
  }, []);

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>

      <h3 className="leaderboard__category--accuracy">Accuracy</h3>
      <RankList table="accuracy" ranks={ranks.accuracyRank} showBody={showBody}/>

      <h3>Neutrality</h3>
      <RankList table="neutrality" ranks={ranks.neutralityRank} showBody={showBody}/>

      <h3>Overall</h3>
      <RankList table="overall" ranks={ranks.overallRank} showBody={showBody}/>
    </div>
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
