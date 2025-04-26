import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Header from "../components/Header";
import StatsBar from "../components/StatsBar";
import Lootbox from "../components/Lootbox";
import ResultModal from "../components/ResultModal";
import Inventory from "../components/Inventory";
import RankPopover from "../components/RankPopover";


function GamePage() {
  const [ranks, setRanks] = useState([]);
  const [balance, setBalance] = useState(1000);
  const [freeSpins, setFreeSpins] = useState(0);
  const [rank, setRank] = useState("Początkujący");
  const [result, setResult] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [equippedItems, setEquippedItems] = useState([]);
  const [showInventory, setShowInventory] = useState(false);
  const [showRankInfo, setShowRankInfo] = useState(false);


  const spinCost = 100;

  const currentRankDescription = ranks.find(r => r.name === rank)?.description || "";
  const nextRank = ranks
  .filter(r => r.minBalance > balance)
  .sort((a, b) => a.minBalance - b.minBalance)[0] || null;


  // Ładowanie przedmiotów i localStorage
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "items"));
        const itemList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(itemList);
      } catch (error) {
        console.error("Błąd pobierania itemów:", error);
      }
    };

    fetchItems();

    // Wczytaj dane z localStorage
    try {
      const savedInventory = localStorage.getItem("metin2-inventory");
      if (savedInventory) setInventory(JSON.parse(savedInventory));

      const savedEquipped = localStorage.getItem("metin2-equipped");
      if (savedEquipped) setEquippedItems(JSON.parse(savedEquipped));

      const savedBalance = localStorage.getItem("metin2-balance");
      if (savedBalance) setBalance(parseInt(savedBalance, 10));
    } catch (error) {
      console.error("Błąd ładowania localStorage:", error);
      localStorage.removeItem('metin2-inventory');
      localStorage.removeItem('metin2-equipped');
    }

    setFreeSpins(prev => prev + 2);
  }, []);

  // Ładowanie rang z Firebase
  useEffect(() => {
    const fetchRanks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Ranking"));
        const rankList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        const sortedRanks = rankList.sort((a, b) => b.minBalance - a.minBalance);
        setRanks(sortedRanks);
      } catch (error) {
        console.error("Błąd pobierania rang:", error);
      }
    };

    fetchRanks();
  }, []);

  // Zapisywanie do localStorage
  useEffect(() => {
    localStorage.setItem('metin2-inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    if (equippedItems.length > 0) {
      localStorage.setItem('metin2-equipped', JSON.stringify(equippedItems));
    }
  }, [equippedItems]);

  useEffect(() => {
    localStorage.setItem('metin2-balance', balance.toString());
  }, [balance]);

  const handleLogout = () => {
    alert("Wylogowanie wyłączone w trybie offline");
  };

  const handleSpin = () => {
    if (isSpinning || (!freeSpins && balance < spinCost) || items.length === 0) return;

    if (freeSpins > 0) {
      setFreeSpins(prev => prev - 1);
    } else {
      setBalance(prev => prev - spinCost);
    }

    navigator.vibrate?.([100, 50, 100]);

    const totalWeight = items.reduce((sum, item) => sum + item.chance, 0);
    const roll = Math.random() * totalWeight;
    let cumulative = 0;
    let rolledItem = items[0];

    for (let i = 0; i < items.length; i++) {
      cumulative += items[i].chance;
      if (roll <= cumulative) {
        rolledItem = items[i];
        break;
      }
    }

    setSelectedItem(rolledItem);
    setIsSpinning(true);
  };

  const handleSpinComplete = (item) => {
    setIsSpinning(false);
    setResult(item);

    const newItem = {
      ...item,
      inventoryId: Date.now(),
      obtainedAt: new Date().toISOString()
    };

    setInventory(prev => [...prev, newItem]);
  };

  const updateRank = (currentBalance) => {
    if (ranks.length === 0) return;

    const foundRank = ranks.find(r => currentBalance >= r.minBalance) || { name: "Początkujący", description: "" };

    if (foundRank.name !== rank) {
      setRank(foundRank.name);
      setFreeSpins(prev => prev + 2);
      alert(`Awansowałeś na rangę: ${foundRank.name}! Otrzymujesz 2 darmowe spiny!`);
    }
  };

  const handleSellItem = (item) => {
    if (window.confirm(`Czy na pewno chcesz sprzedać ${item.name} za ${item.value} Yang?`)) {
      const updatedInventory = inventory.filter(i => i.inventoryId !== item.inventoryId);
      setInventory(updatedInventory);

      const newBalance = balance + item.value;
      setBalance(newBalance);
      updateRank(newBalance);

      localStorage.setItem('metin2-inventory', JSON.stringify(updatedInventory));
      localStorage.setItem('metin2-balance', newBalance.toString());
    }
  };

  const toggleInventory = () => {
    setShowInventory(prev => !prev);
  };

  return (
    <div className="app-container">
      <Header onLogout={handleLogout} />
      <StatsBar
        balance={balance}
        freeSpins={freeSpins}
        rank={rank}
        onRankClick={() => setShowRankInfo(true)}
      />
{showRankInfo && (
      <RankPopover
        rankName={rank}
        rankDescription={currentRankDescription}
        nextRankName={nextRank?.name}
        pointsToNext={nextRank ? nextRank.minBalance - balance : 0}
        onClose={() => setShowRankInfo(false)}
      />
    )}

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        margin: "20px 0"
      }}>
        <button
          onClick={() => setShowInventory(false)}
          style={{
            padding: "10px 20px",
            backgroundColor: !showInventory ? "#f8d64e" : "#2c2f33",
            color: !showInventory ? "#000" : "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Losowanie
        </button>
        <button
          onClick={() => setShowInventory(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: showInventory ? "#f8d64e" : "#2c2f33",
            color: showInventory ? "#000" : "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            position: "relative",
            fontWeight: "bold"
          }}
        >
          Inventory
          {inventory.length > 0 && (
            <span style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              backgroundColor: "#f44336",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "12px"
            }}>
              {inventory.length}
            </span>
          )}
        </button>
      </div>

      {!showInventory ? (
        <Lootbox
          items={items}
          selectedItem={selectedItem}
          onSpin={handleSpin}
          isSpinning={isSpinning}
          freeSpins={freeSpins}
          spinCost={spinCost}
          onSpinComplete={handleSpinComplete}
        />
      ) : (
        <Inventory
          inventory={inventory}
          onSell={handleSellItem}
        />
      )}

      <ResultModal result={result} onClose={() => setResult(null)} />
      <footer>Metin2 Treasure Rush © 2025 - Symulator Skrzynek</footer>
    </div>
  );
}

export default GamePage;
GamePage.jsx
