import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Header from "../components/Header";
import StatsBar from "../components/StatsBar";
import Lootbox from "../components/Lootbox";
import ResultModal from "../components/ResultModal";
import Inventory from "../components/Inventory";

function GamePage() {
  const [balance, setBalance] = useState(1000);
  const [freeSpins, setFreeSpins] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [rank, setRank] = useState("Początkujący");
  const [result, setResult] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [equippedItems, setEquippedItems] = useState([]);
  const [showInventory, setShowInventory] = useState(false);
  const spinCost = 100;

  // Pobieranie itemów z firebase
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
        console.error("Błąd pobierania przedmiotów:", error);
        // Ustaw przedmioty domyślne jeśli firebase nie zadziała
        setItems([
          { id: 1, name: "Miecz Smogorożca", img: "/api/placeholder/60/60", rarity: "legendary", chance: 5, value: 5000 },
          { id: 2, name: "Zbroja Niebieskiego Smoka", img: "/api/placeholder/60/60", rarity: "epic", chance: 10, value: 2000 },
          // ...inne przedmioty
        ]);
      }
    };
  
    fetchItems();
    
    // Pobierz zapisany ekwipunek z lokalnego storage
    try {
      const savedInventory = localStorage.getItem('metin2-inventory');
      if (savedInventory) {
        setInventory(JSON.parse(savedInventory));
        console.log("Załadowano ekwipunek z localStorage:", JSON.parse(savedInventory));
      }
      
      const savedEquipped = localStorage.getItem('metin2-equipped');
      if (savedEquipped) {
        setEquippedItems(JSON.parse(savedEquipped));
      }
      
      const savedBalance = localStorage.getItem('metin2-balance');
      if (savedBalance) {
        setBalance(parseInt(savedBalance));
      }
    } catch (error) {
      console.error("Błąd ładowania danych z localStorage:", error);
      // Możesz zresetować localStorage jeśli dane są uszkodzone
      localStorage.removeItem('metin2-inventory');
      localStorage.removeItem('metin2-equipped');
    }
  }, []);
  // Zapisuj ekwipunek do localStorage przy każdej zmianie
  useEffect(() => {
    // Zapisuj tylko gdy inventory zawiera elementy lub jest pustą tablicą po sprzedaży
    localStorage.setItem('metin2-inventory', JSON.stringify(inventory));
  }, [inventory]);
  
  // Zapisuj założone przedmioty do localStorage
  useEffect(() => {
    if (equippedItems.length > 0) {
      localStorage.setItem('metin2-equipped', JSON.stringify(equippedItems));
    }
  }, [equippedItems]);
  
  // Zapisuj balans do localStorage
  useEffect(() => {
    localStorage.setItem('metin2-balance', balance.toString());
  }, [balance]);

  const handleLogout = () => {
    alert("Wylogowanie wyłączone w trybie offline");
  };

  const handleSpin = () => {
    if (isSpinning || (!freeSpins && balance < spinCost) || items.length === 0) return;

    if (freeSpins > 0) {
      setFreeSpins(freeSpins - 1);
    } else {
      setBalance(balance - spinCost);
    }

    navigator.vibrate?.([100, 50, 100]);

    // Losowanie przedmiotu wg szans
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
    const newBalance = balance + Math.floor(item.value * multiplier);
    setBalance(newBalance);
    setMultiplier((prev) => Math.min(5.0, Math.round((prev + 0.5) * 10) / 10));
    setRank("Legenda");
    setIsSpinning(false);
    setResult(item);
    
    // Dodaj przedmiot do ekwipunku
    const newItem = {
      ...item,
      inventoryId: Date.now(), // unikalny identyfikator dla tego konkretnego egzemplarza przedmiotu
      obtainedAt: new Date().toISOString()
    };
    
    setInventory(prev => [...prev, newItem]);
  };
  
  // Funkcja do sprzedawania przedmiotów
// Modyfikacja funkcji handleSellItem w GamePage.jsx

// Funkcja do sprzedawania przedmiotów
const handleSellItem = (item) => {
  if (window.confirm(`Czy na pewno chcesz sprzedać ${item.name} za ${item.value} Yang?`)) {
    // Aktualizacja stanu inventory
    const updatedInventory = inventory.filter(i => i.inventoryId !== item.inventoryId);
    setInventory(updatedInventory);
    
    // Natychmiastowe zapisanie do localStorage
    localStorage.setItem('metin2-inventory', JSON.stringify(updatedInventory));
    
    // Aktualizacja stanu balance
    const newBalance = balance + item.value;
    setBalance(newBalance);
    
    // Natychmiastowe zapisanie do localStorage
    localStorage.setItem('metin2-balance', newBalance.toString());
    
    // Jeśli przedmiot był założony, usuń go z listy założonych
    if (equippedItems.some(i => i.inventoryId === item.inventoryId)) {
      const updatedEquipped = equippedItems.filter(i => i.inventoryId !== item.inventoryId);
      setEquippedItems(updatedEquipped);
      
      // Natychmiastowe zapisanie do localStorage
      localStorage.setItem('metin2-equipped', JSON.stringify(updatedEquipped));
    }
  }
};
  
  // Funkcja do zakładania przedmiotów
  const handleEquipItem = (item) => {
    // Sprawdź typ przedmiotu i czy nie ma już założonego przedmiotu tego typu
    let itemType = "misc";
    if (item.name.toLowerCase().includes("miecz") || 
        item.name.toLowerCase().includes("sztylet") ||
        item.name.toLowerCase().includes("łuk")) {
      itemType = "weapon";
    } else if (item.name.toLowerCase().includes("zbroja") ||
              item.name.toLowerCase().includes("kolczuga")) {
      itemType = "chest";
    } else if (item.name.toLowerCase().includes("hełm")) {
      itemType = "head";
    } else if (item.name.toLowerCase().includes("buty")) {
      itemType = "feet";
    } else if (item.name.toLowerCase().includes("pierścień") ||
              item.name.toLowerCase().includes("naszyjnik") ||
              item.name.toLowerCase().includes("amulet")) {
      itemType = "accessory";
    }
    
    // Sprawdź czy podobny przedmiot jest już założony
    const existingEquipped = equippedItems.find(i => 
      getItemType(i.name) === itemType && itemType !== "accessory"
    );
    
    if (existingEquipped) {
      if (window.confirm(`Masz już założony przedmiot tego typu (${existingEquipped.name}). Czy chcesz go zamienić?`)) {
        // Usuń stary przedmiot i dodaj nowy
        setEquippedItems(prev => [...prev.filter(i => i.inventoryId !== existingEquipped.inventoryId), item]);
      }
    } else {
      // Po prostu dodaj przedmiot do ekwipowanych
      setEquippedItems(prev => [...prev, item]);
      alert(`Założono: ${item.name}`);
    }
  };
  
  // Pomocnicza funkcja do określenia typu przedmiotu
  function getItemType(name) {
    name = name.toLowerCase();
    if (name.includes("miecz") || name.includes("sztylet") || name.includes("łuk")) return "weapon";
    if (name.includes("zbroja") || name.includes("kolczuga")) return "chest";
    if (name.includes("hełm")) return "head";
    if (name.includes("buty")) return "feet";
    if (name.includes("pierścień") || name.includes("naszyjnik") || name.includes("amulet")) return "accessory";
    return "misc";
  }
  
  // Przełączanie widoku ekwipunku
  const toggleInventory = () => {
    setShowInventory(prev => !prev);
  };

  return (
    <div className="app-container">
      <Header onLogout={handleLogout} />
      <StatsBar
        balance={balance}
        freeSpins={freeSpins}
        multiplier={multiplier}
        rank={rank}
      />
      
      {/* Przyciski nawigacyjne */}
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
            fontWeight: "bold",
            position: "relative"
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
      
      {/* Wyświetl albo losowanie albo ekwipunek */}
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
          onEquip={handleEquipItem}
        />
      )}
      
      <ResultModal result={result} onClose={() => setResult(null)} />
      <footer>Metin2 Treasure Rush © 2025 - Symulator Skrzynek</footer>
    </div>
  );
}

export default GamePage;