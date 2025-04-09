import React, { useEffect } from "react";

function ResultModal({ result, onClose }) {
  if (!result) return null;

  // Dodajemy logowanie dla debugowania
  useEffect(() => {
    console.log("Wyświetlam przedmiot w modalu:", result);
  }, [result]);

  // Dodajemy klasy stylów bazujące na rzadkości przedmiotu
  const rarityClass = result.rarity || "common";

  return (
    <div className="result-container show" onClick={onClose}>
      <div className={`result-item ${rarityClass}`}>
        <img 
          src={result.img} 
          alt={result.name} 
          style={{ 
            width: "100px", 
            height: "100px", 
            objectFit: "contain" 
          }}
        />
        <div className="result-name" style={{ fontSize: "18px", fontWeight: "bold", margin: "10px 0" }}>
          {result.name}
        </div>
        <div className={`result-rarity ${rarityClass}`} style={{ 
          textTransform: "uppercase",
          padding: "5px",
          borderRadius: "3px",
          fontWeight: "bold"
        }}>
          {result.rarity}
        </div>
        <div className="result-value" style={{ marginTop: "5px" }}>
          Wartość: {result.value}
        </div>
      </div>
    </div>
  );
}

export default ResultModal;