import React, { useEffect } from "react";

function ResultModal({ result, onClose }) {
  if (!result) return null;

  // Dodajemy logowanie dla debugowania
  useEffect(() => {
    console.log("Wyświetlam przedmiot w modalu:", result);
  }, [result]);

  // Funkcja do uzyskania prawidłowego adresu obrazu
  const getImageUrl = (item) => {
    if (!item.img || item.img.includes('/api/placeholder')) {
      // Mapa kolorów w zależności od rzadkości
      const colors = {
        common: 'bbbbbb',
        uncommon: '1eff00',
        rare: '0070dd',
        epic: 'a335ee',
        legendary: 'ff8000'
      };
      const color = colors[item.rarity] || 'bbbbbb';
      return `https://via.placeholder.com/60x60/${color}/FFFFFF?text=${item.name.substring(0, 2)}`;
    }
    return item.img;
  };

  // Dodajemy klasy stylów bazujące na rzadkości przedmiotu
  const rarityClass = result.rarity || "common";

  return (
    <div className="result-container show" onClick={onClose} style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div className={`result-item ${rarityClass}`} style={{
        backgroundColor: "#222",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        border: "3px solid gold"
      }}>
        <img 
          src={getImageUrl(result)} 
          alt={result.name} 
          style={{ 
            width: "100px", 
            height: "100px", 
            objectFit: "contain" 
          }}
        />
        <div className="result-name" style={{ fontSize: "18px", fontWeight: "bold", margin: "10px 0", color: "white" }}>
          {result.name}
        </div>
        <div className={`result-rarity ${rarityClass}`} style={{ 
          textTransform: "uppercase",
          padding: "5px",
          borderRadius: "3px",
          fontWeight: "bold",
          color: getRarityColor(result.rarity)
        }}>
          {result.rarity}
        </div>
        <div className="result-value" style={{ marginTop: "5px", color: "gold" }}>
          Wartość: {result.value}
        </div>
      </div>
    </div>
  );
}

// Pomocnicza funkcja - kolor tekstu zależny od rzadkości
function getRarityColor(rarity) {
  const colors = {
    common: '#9d9d9d',
    uncommon: '#1eff00',
    rare: '#0070dd',
    epic: '#a335ee',
    legendary: '#ff8000'
  };
  return colors[rarity] || colors.common;
}

export default ResultModal;