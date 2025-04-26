import React from "react";

function StatsBar({ balance, freeSpins, rank, onRankClick }) {
  const getRankColor = (rankName) => {
    const colors = {
      'początkujący': '#9d9d9d',
      'wojownik': '#1eff00',
      'weteran': '#0070dd',
      'mistrz': '#a335ee',
      'legenda': '#ff8000'
    };
    
    const lowerRank = rankName.toLowerCase();
    for (const [key, value] of Object.entries(colors)) {
      if (lowerRank.includes(key)) {
        return value;
      }
    }
    return colors['początkujący'];
  };

  


  return (
    <div className="stats-bar">
      <div className="stat">
        <div className="stat-label">Saldo</div>
        <div className="stat-value">{balance}</div>
      </div>
      <div className="stat">
        <div className="stat-label">Darmowe Spiny</div>
        <div className="stat-value">{freeSpins}</div>
      </div>
      <div className="stat">
        <div className="stat-label">Ranking</div>
        <div
          className="stat-value"
          onClick={onRankClick}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          {rank}
        </div>
      </div>
    </div>
  );
}

export default StatsBar;