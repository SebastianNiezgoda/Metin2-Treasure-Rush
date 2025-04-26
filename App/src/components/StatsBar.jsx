import React from "react";

function StatsBar({ balance, freeSpins, multiplier, rank }) {
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
        <div className="stat-value">{rank}</div>
      </div>
    </div>
  );
}

export default StatsBar;