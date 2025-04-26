import React, { useEffect } from "react";

function ResultModal({ result, onClose }) {
  if (!result) return null;

  useEffect(() => {
    console.log("Wyświetlam przedmiot w modalu:", result);
  }, [result]);

  const getImageUrl = (item) => {
    if (!item.img || item.img.includes('/api/placeholder')) {
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

  const rarityClass = result.rarity || "common";

  return (
    <div 
      className="result-container show" 
      onClick={onClose} 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      <div 
        className={`result-item ${rarityClass}`} 
        style={{
          backgroundColor: "#222",
          padding: "25px",
          borderRadius: "15px",
          textAlign: "center",
          border: "4px solid gold",
          width: "100%",
          maxWidth: "350px",
          boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Glow effect based on rarity */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: getRarityColor(result.rarity),
          boxShadow: `0 0 10px ${getRarityColor(result.rarity)}`
        }}></div>
        
        <img 
          src={getImageUrl(result)} 
          alt={result.name} 
          style={{ 
            width: "120px", 
            height: "120px", 
            objectFit: "contain",
            marginBottom: "15px",
            filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))"
          }}
        />
        
        <div style={{ 
          fontSize: "22px", 
          fontWeight: "bold", 
          margin: "10px 0", 
          color: "white",
          textShadow: "0 0 5px rgba(255, 255, 255, 0.3)"
        }}>
          {result.name}
        </div>
        
        <div style={{ 
          textTransform: "uppercase",
          padding: "6px 12px",
          borderRadius: "20px",
          fontWeight: "bold",
          color: "white",
          backgroundColor: getRarityColor(result.rarity),
          display: "inline-block",
          marginBottom: "10px",
          fontSize: "14px",
          boxShadow: `0 0 5px ${getRarityColor(result.rarity)}`
        }}>
          {result.rarity}
        </div>
        
        <div style={{ 
          marginTop: "10px", 
          color: "gold",
          fontSize: "18px",
          fontWeight: "bold"
        }}>
          Wartość: {result.value} Yang
        </div>
        
        <div style={{
          marginTop: "20px",
          color: "#aaa",
          fontSize: "14px"
        }}>
          Dotknij aby zamknąć
        </div>
      </div>
    </div>
  );
}

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