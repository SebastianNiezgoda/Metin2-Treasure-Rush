import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Header from "../components/Header";
import StatsBar from "../components/StatsBar";
import Lootbox from "../components/Lootbox";
import ResultModal from "../components/ResultModal";

{/* function GamePage() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(1000);
  const [freeSpins, setFreeSpins] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [rank, setRank] = useState("Początkujący");
  const [result, setResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinCost = 100;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            balance: 1000,
            freeSpins: 0,
            multiplier: 1.0,
            rank: "Początkujący"
          });
        } else {
          const data = userSnap.data();
          setBalance(data.balance);
          setFreeSpins(data.freeSpins);
          setMultiplier(data.multiplier);
          setRank(data.rank);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSpin = async () => {
    if (isSpinning || (!freeSpins && balance < spinCost)) return;

    setIsSpinning(true);
    if (freeSpins > 0) {
      setFreeSpins(freeSpins - 1);
    } else {
      setBalance(balance - spinCost);
    }

    navigator.vibrate?.([100, 50, 100]);

    // Symulacja wylosowanego przedmiotu
    const item = {
      name: "Miecz Smogorożca",
      rarity: "legendary",
      value: 5000,
      img: "/api/placeholder/60/60"
    };

    setTimeout(() => {
      const newBalance = balance + Math.floor(item.value * multiplier);
      setResult(item);
      setBalance(newBalance);
      setMultiplier((prev) => Math.min(5.0, Math.round((prev + 0.5) * 10) / 10));
      setRank("Legenda");
      setIsSpinning(false);

      updateDoc(doc(db, "users", user.uid), {
        balance: newBalance,
        freeSpins: freeSpins > 0 ? freeSpins - 1 : 0,
        multiplier,
        rank: "Legenda"
      });
    }, 3000);
  };

  if (!user) return null;

  return (
    <div className="app-container">
      <Header onLogout={handleLogout} />
      <StatsBar
        balance={balance}
        freeSpins={freeSpins}
        multiplier={multiplier}
        rank={rank}
      />
      <Lootbox
        onSpin={handleSpin}
        isSpinning={isSpinning}
        freeSpins={freeSpins}
        spinCost={spinCost}
      />
      <ResultModal result={result} onClose={() => setResult(null)} />
      <footer>Metin2 Treasure Rush © 2025 - Symulator Skrzynek</footer>
    </div>
  );
}

export default GamePage; */}


function GamePage() {
  const [balance, setBalance] = useState(1000);
  const [freeSpins, setFreeSpins] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [rank, setRank] = useState("Początkujący");
  const [result, setResult] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [items, setItems] = useState([]);
  const spinCost = 100;

{/*   const items = [
    { id: 1, name: "Miecz Smogorożca", img: "/api/placeholder/60/60", rarity: "legendary", chance: 5, value: 5000 },
    { id: 2, name: "Zbroja Niebieskiego Smoka", img: "/api/placeholder/60/60", rarity: "epic", chance: 10, value: 2000 },
    { id: 3, name: "Miecz Czerwonego Smoka", img: "/api/placeholder/60/60", rarity: "epic", chance: 10, value: 1800 },
    { id: 4, name: "Łuk Fenixa", img: "/api/placeholder/60/60", rarity: "rare", chance: 15, value: 1000 },
    { id: 5, name: "Hełm Mściciela", img: "/api/placeholder/60/60", rarity: "rare", chance: 15, value: 800 },
    { id: 6, name: "Naszyjnik Żmii", img: "/api/placeholder/60/60", rarity: "uncommon", chance: 20, value: 400 },
    { id: 7, name: "Buty Wędrowca", img: "/api/placeholder/60/60", rarity: "uncommon", chance: 20, value: 300 },
    { id: 8, name: "Żelazny Miecz", img: "/api/placeholder/60/60", rarity: "common", chance: 25, value: 100 },
    { id: 9, name: "Skórzany Hełm", img: "/api/placeholder/60/60", rarity: "common", chance: 30, value: 50 },
    { id: 10, name: "Zardzewiała Zbroja", img: "/api/placeholder/60/60", rarity: "common", chance: 50, value: 20 },
    { id: 11, name: "Miecz Duszy", img: "/api/placeholder/60/60", rarity: "legendary", chance: 4, value: 5200 },
    { id: 12, name: "Zbroja Cienia", img: "/api/placeholder/60/60", rarity: "legendary", chance: 5, value: 4800 },
    { id: 13, name: "Pierścień Króla Demonów", img: "/api/placeholder/60/60", rarity: "legendary", chance: 5, value: 5000 },
    { id: 14, name: "Szpony Bestii", img: "/api/placeholder/60/60", rarity: "epic", chance: 8, value: 2200 },
    { id: 15, name: "Hełm Czerwonej Krwi", img: "/api/placeholder/60/60", rarity: "epic", chance: 9, value: 2100 },
    { id: 16, name: "Tarcza Smoczego Oka", img: "/api/placeholder/60/60", rarity: "epic", chance: 10, value: 2000 },
    { id: 17, name: "Zbroja Złotego Wilka", img: "/api/placeholder/60/60", rarity: "rare", chance: 13, value: 1200 },
    { id: 18, name: "Miecz Płomienia", img: "/api/placeholder/60/60", rarity: "rare", chance: 15, value: 1100 },
    { id: 19, name: "Amulet Przeznaczenia", img: "/api/placeholder/60/60", rarity: "rare", chance: 14, value: 1000 },
    { id: 20, name: "Buty Cienia", img: "/api/placeholder/60/60", rarity: "rare", chance: 15, value: 900 },
    { id: 21, name: "Szata Mędrca", img: "/api/placeholder/60/60", rarity: "uncommon", chance: 18, value: 600 },
    { id: 22, name: "Rękawice Zwinności", img: "/api/placeholder/60/60", rarity: "uncommon", chance: 20, value: 500 },
    { id: 23, name: "Bransoleta Ognia", img: "/api/placeholder/60/60", rarity: "uncommon", chance: 19, value: 450 },
    { id: 24, name: "Kolczuga Strażnika", img: "/api/placeholder/60/60", rarity: "uncommon", chance: 21, value: 470 },
    { id: 25, name: "Pas Wojownika", img: "/api/placeholder/60/60", rarity: "uncommon", chance: 20, value: 400 },
    { id: 26, name: "Sztylet Złodzieja", img: "/api/placeholder/60/60", rarity: "common", chance: 25, value: 150 },
    { id: 27, name: "Pierścień Odporności", img: "/api/placeholder/60/60", rarity: "common", chance: 30, value: 100 },
    { id: 28, name: "Kaptur Zwiadowcy", img: "/api/placeholder/60/60", rarity: "common", chance: 28, value: 90 },
    { id: 29, name: "Skórzana Kamizelka", img: "/api/placeholder/60/60", rarity: "common", chance: 35, value: 80 },
    { id: 30, name: "Stary Łuk", img: "/api/placeholder/60/60", rarity: "common", chance: 40, value: 70 },
    { id: 31, name: "Miecz Półksiężyca", img: "/api/placeholder/60/60", rarity: "epic", chance: 9, value: 1900 },
    { id: 32, name: "Zbroja Nocnego Wędrowca", img: "/api/placeholder/60/60", rarity: "epic", chance: 10, value: 1850 },
    { id: 33, name: "Hełm Lotosu", img: "/api/placeholder/60/60", rarity: "rare", chance: 14, value: 950 },
    { id: 34, name: "Bransoleta Księżyca", img: "/api/placeholder/60/60", rarity: "rare", chance: 15, value: 800 },
    { id: 35, name: "Kolczuga Weterana", img: "/api/placeholder/60/60", rarity: "uncommon", chance: 20, value: 350 },
    { id: 36, name: "Amulet Czystości", img: "/api/placeholder/60/60", rarity: "uncommon", chance: 20, value: 300 },
    { id: 37, name: "Hełm Rybaka", img: "/api/placeholder/60/60", rarity: "common", chance: 30, value: 60 },
    { id: 38, name: "Skórzane Rękawice", img: "/api/placeholder/60/60", rarity: "common", chance: 35, value: 50 },
    { id: 39, name: "Złamana Włócznia", img: "/api/placeholder/60/60", rarity: "common", chance: 45, value: 30 },
    { id: 40, name: "Zbutwiałe Buty", img: "/api/placeholder/60/60", rarity: "common", chance: 50, value: 20 }
  ]; */}

// Pobieranie itemow z firebase
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
    }
  };

  fetchItems();
}, []);

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
    <Lootbox
      items={items}
      selectedItem={selectedItem}
      onSpin={handleSpin}
      isSpinning={isSpinning}
      freeSpins={freeSpins}
      spinCost={spinCost}
      onSpinComplete={handleSpinComplete}
    />
    <ResultModal result={result} onClose={() => setResult(null)} />
    <footer>Metin2 Treasure Rush © 2025 - Symulator Skrzynek</footer>
  </div>
);
}

export default GamePage;