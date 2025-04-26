import React, { useState } from "react";
import Leaderboard from "./Leaderboard";

function Header({ onLogout }) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const toggleLeaderboard = () => {
    setShowLeaderboard(prev => !prev);
  };

  return (
    <header style={{ 
      position: "relative", 
      padding: "10px 20px", 
      backgroundColor: "#1e2023", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center",
      gap: "10px" 
    }}>
      {/* Rząd guzików */}
      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <button onClick={toggleLeaderboard} style={{
          padding: "6px 12px",
          backgroundColor: "#f8d64e",
          color: "#000",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold"
        }}>
          Leaderboard
        </button>

        <button onClick={onLogout} style={{
          padding: "6px 12px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold"
        }}>
          Wyloguj
        </button>
      </div>

      {/* Napis */}
      <h1 style={{ 
        color: "#f8d64e", 
        textAlign: "center", 
        margin: "0",
        fontSize: "2.5rem"
      }}>
        Metin2 Treasure Rush
      </h1>

      {/* Dymek Leaderboard */}
      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
    </header>
  );
}

export default Header;