import React, { useEffect, useState } from "react";
const clickAudio = new Audio("/assets/sounds/click.mp3");

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
      
        // dzwiek cykacza
        if (clickAudio) {
          clickAudio.currentTime = 0; //reset dzwieku cykacza
          clickAudio.play();
        }
      
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
          <div style={{ margin: "auto", textAlign: "center" }}>
              {displayItem ? (
                <>
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      border: "3px solid #ccc",
                      borderRadius: "8px",
                      overflow: "hidden",
                      background: "#f8f8f8",
                      margin: "auto"
                    }}
                  >
                    <img
                      src={displayItem.img}
                      alt={displayItem.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      marginTop: "8px",
                      fontWeight: "bold",
                      color: "#ac7a33"
                    }}
                  >
                    {displayItem.name}
                  </div>
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