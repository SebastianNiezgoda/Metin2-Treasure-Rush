import React, { useEffect, useState } from "react";

function Lootbox({ items, onSpin, isSpinning, freeSpins, spinCost, onSpinComplete }) {
  const [displayItem, setDisplayItem] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const [isAnimating, setIsAnimating] = useState(false);
  const [finalItem, setFinalItem] = useState(null);

  const spinSequence = [
    80, 90, 100, 110, 120, 130, 140, 150,
    170, 190, 220, 250, 300, 350, 400, 500,
    600
  ];

  const handleSpin = () => {
    if (isSpinning || isAnimating) return;

    const weightedItems = items.flatMap(item => Array(item.chance).fill(item));
    const randomItem = weightedItems[Math.floor(Math.random() * weightedItems.length)];
    setFinalItem(randomItem);
    setCurrentStep(0);
    setIsAnimating(true);
    onSpin(); // przekazuje do GamePage
  };

  useEffect(() => {
    if (!isAnimating || !finalItem) return;

    if (currentStep < spinSequence.length) {
      const timeout = setTimeout(() => {
        const random = items[Math.floor(Math.random() * items.length)];
        setDisplayItem(random);
        setCurrentStep(currentStep + 1);
      }, spinSequence[currentStep]);

      return () => clearTimeout(timeout);
    } else {
      // Zakończ losowanie i pokaż wynik
      setDisplayItem(finalItem);
      setTimeout(() => {
        onSpinComplete(finalItem);
        setIsAnimating(false);
        setFinalItem(null);
      }, 600);
    }
  }, [currentStep, isAnimating, finalItem, items, onSpinComplete]);

  return (
    <div className="lootbox-reel" style={{ textAlign: "center", marginTop: "20px" }}>
      <div
        style={{
          width: "120px",
          height: "120px",
          margin: "auto",
          border: "3px solid #ccc",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f8f8f8"
        }}
      >
        {displayItem ? (
          <>
            <img
              src={displayItem.img}
              alt={displayItem.name}
              style={{ width: "60px", height: "60px", objectFit: "contain" }}
            />
            <div style={{ fontSize: "12px", marginTop: "5px", color: "#000" }}>{displayItem.name}</div>
          </>
        ) : (
          <span style={{ color: "#aaa" }}>?</span>
        )}
      </div>

      <button
        style={{ marginTop: "20px" }}
        className="spin-button"
        onClick={handleSpin}
        disabled={isSpinning || isAnimating}
      >
        {freeSpins > 0 ? `DARMOWY SPIN (${freeSpins})` : `LOSUJ (${spinCost})`}
      </button>
    </div>
  );
}

export default Lootbox;