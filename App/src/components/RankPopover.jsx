import React from "react";

function RankPopover({ rankName, rankDescription, nextRankName, pointsToNext, onClose }) {
  return (
    <div style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#2c2f33",
      border: "2px solid #f8d64e",
      borderRadius: "8px",
      padding: "20px",
      width: "300px",
      maxWidth: "90vw",
      boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
      zIndex: 2000
    }}>
      <h3 style={{ color: "#f8d64e", marginBottom: "10px", textAlign: "center" }}>
        {rankName}
      </h3>
      <p style={{ color: "white", fontSize: "14px", marginBottom: "10px" }}>
        {rankDescription}
      </p>

      {nextRankName ? (
        <p style={{ color: "#f8d64e", fontSize: "14px" }}>
          Brakuje Ci <b>{pointsToNext}</b> punktów do rangi <b>{nextRankName}</b>!
        </p>
      ) : (
        <p style={{ color: "#00e676", fontSize: "14px" }}>
          Osiągnąłeś najwyższą możliwą rangę!
        </p>
      )}

      <button onClick={onClose} style={{
        marginTop: "15px",
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

export default RankPopover;