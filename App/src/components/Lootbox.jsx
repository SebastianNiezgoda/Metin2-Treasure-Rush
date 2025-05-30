import React, { useEffect, useState } from "react";
const clickAudio = new Audio("/assets/sounds/click.mp3");


const raritySounds = {
  common: new Audio("assets/sounds/common.mp3"),
  uncommon: new Audio("assets/sounds/uncommon.mp3"),
  rare: new Audio("assets/sounds/rare.mp3"),
  epic: new Audio("assets/sounds/epic.mp3"),
  legendary: new Audio("assets/sounds/legendary.mp3")
};

function Lootbox({ items, onSpin, isSpinning, freeSpins, spinCost, onSpinComplete }) {
  const [displayItem, setDisplayItem] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const [isAnimating, setIsAnimating] = useState(false);
  const [finalItem, setFinalItem] = useState(null);

  const spinSequence = [
    220, 230, 240, 250, 260, 270, 280, 300,
    310, 320, 330, 340, 350, 350, 400, 500,
    600
  ];
  // funkcja do odtwarzania dzwieku w zalezcnosci od rzadkosci
  const playRaritySound = (item) => {
    let rarity = item.rarity ; 
  
    const sound = raritySounds[rarity];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  };

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
        if (finalItem) {
          playRaritySound(finalItem);
        }
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