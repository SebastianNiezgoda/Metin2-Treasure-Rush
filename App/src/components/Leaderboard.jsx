import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function LeaderboardPopover({ onClose }) {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Leaderboard"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLeaders(data.sort((a, b) => b.balance - a.balance)); // Sortowanie od najwyższego
      } catch (error) {
        console.error("Błąd pobierania Leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#2c2f33",
        border: "2px solid #f8d64e",
        borderRadius: "8px",
        padding: "15px",
        width: "300px",
        maxWidth: "90vw",
        boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
        zIndex: 1000
      }}>
      <h3 style={{ color: "#f8d64e", textAlign: "center" }}>🏆 Leaderboard</h3>
      <ul style={{ listStyle: "none", padding: 0, marginTop: "10px", maxHeight: "300px", overflowY: "auto" }}>
        {leaders.map((player) => (
            <li key={player.id} style={{
            marginBottom: "8px",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px"
            }}>
            <span>{player.Miejsce}. {player.Nick}</span>
            <span style={{ color: "#f8d64e" }}>{player.Punkty} Punktów</span>
            </li>
        ))}
        </ul>
      <button onClick={onClose} style={{
        marginTop: "10px",
        width: "100%",
        padding: "8px",
        backgroundColor: "#f8d64e",
        color: "#000",
        border: "none",
        borderRadius: "5px",
        fontWeight: "bold",
        cursor: "pointer"
      }}>
        Zamknij
      </button>
    </div>
  );
}

export default LeaderboardPopover;