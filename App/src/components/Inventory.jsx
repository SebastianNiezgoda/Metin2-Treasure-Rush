import React, { useState, useEffect } from "react";
import "../App.css";

function Inventory({ inventory, onSell, onEquip }) {
  const [selectedCategory, setSelectedCategory] = useState("wszystkie");
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  const [selectedItem, setSelectedItem] = useState(null);

  
  useEffect(() => {
    if (selectedItem && !inventory.some(item => item.inventoryId === selectedItem.inventoryId)) {
      // Jeśli wybrany przedmiot nie istnieje już w ekwipunku, zresetuj wybór
      setSelectedItem(null);
    }
  }, [inventory, selectedItem]);

  // Kategorie przedmiotów
  const categories = [
    { id: "wszystkie", name: "Wszystkie" },
    { id: "weapons", name: "Broń" },
    { id: "armor", name: "Zbroja" },
    { id: "accessories", name: "Dodatki" },
    { id: "legendary", name: "Legendarne" },
  ];

  // Funkcja generująca prawidłowy URL dla obrazków
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

  // Filtrowanie przedmiotów według kategorii i wyszukiwania
  const filteredItems = inventory.filter(item => {
    // Filtrowanie po kategorii
    if (selectedCategory !== "wszystkie") {
      if (selectedCategory === "legendary" && item.rarity !== "legendary") return false;
      if (selectedCategory === "weapons" && !isWeapon(item.name)) return false;
      if (selectedCategory === "armor" && !isArmor(item.name)) return false;
      if (selectedCategory === "accessories" && !isAccessory(item.name)) return false;
    }
    
    // Filtrowanie po tekście wyszukiwania
    if (searchText && !item.name.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Pomocnicze funkcje do kategoryzacji przedmiotów
  function isWeapon(name) {
    const weaponKeywords = ["miecz", "łuk", "sztylet", "włócznia", "topór", "młot", "kosa", "szpony"];
    return weaponKeywords.some(keyword => name.toLowerCase().includes(keyword));
  }
  
  function isArmor(name) {
    const armorKeywords = ["zbroja", "hełm", "buty", "rękawice", "tarcza", "kolczuga", "kamizelka", "szata"];
    return armorKeywords.some(keyword => name.toLowerCase().includes(keyword));
  }
  
  function isAccessory(name) {
    const accessoryKeywords = ["pierścień", "naszyjnik", "amulet", "pas", "bransoleta"];
    return accessoryKeywords.some(keyword => name.toLowerCase().includes(keyword));
  }

  // Sortowanie przedmiotów
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "rarity-asc":
        const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
      case "rarity-desc":
        const rarityOrderDesc = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
        return rarityOrderDesc[b.rarity] - rarityOrderDesc[a.rarity];
      case "value-asc":
        return a.value - b.value;
      case "value-desc":
        return b.value - a.value;
      default:
        return 0;
    }
  });

  // Obsługa kliknięcia na przedmiot
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  
  const handleSellItem = (item) => {
    // Bezpośrednio zresetuj selectedItem przed wywołaniem onSell
    setSelectedItem(null);
    
    onSell(item);
  };

  return (
    <div className="inventory-container" style={{ 
      backgroundColor: "#1e2023", 
      padding: "20px", 
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
      maxWidth: "800px",
      margin: "0 auto 20px"
    }}>
      <h2 style={{ color: "#f8d64e", textAlign: "center", marginBottom: "20px" }}>Ekwipunek</h2>
      
      {/* Panel filtrowania */}
      <div className="inventory-controls" style={{ marginBottom: "15px", display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between" }}>
        <div className="search-box" style={{ flexGrow: 1, marginRight: "10px" }}>
          <input
            type="text"
            placeholder="Szukaj przedmiotów..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#2c2f33",
              color: "white",
              border: "1px solid #444",
              borderRadius: "4px"
            }}
          />
        </div>
        
        <div className="sort-box">
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              padding: "8px",
              backgroundColor: "#2c2f33",
              color: "white",
              border: "1px solid #444",
              borderRadius: "4px"
            }}
          >
            <option value="name-asc">Nazwa (A-Z)</option>
            <option value="name-desc">Nazwa (Z-A)</option>
            <option value="rarity-asc">Rzadkość (rosnąco)</option>
            <option value="rarity-desc">Rzadkość (malejąco)</option>
            <option value="value-asc">Wartość (rosnąco)</option>
            <option value="value-desc">Wartość (malejąco)</option>
          </select>
        </div>
      </div>
      
      {/* Kategorie */}
      <div className="category-tabs" style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: "8px", 
        flexWrap: "wrap", 
        marginBottom: "15px" 
      }}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            style={{
              padding: "8px 12px",
              backgroundColor: selectedCategory === category.id ? "#f8d64e" : "#2c2f33",
              color: selectedCategory === category.id ? "#000" : "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: selectedCategory === category.id ? "bold" : "normal"
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Lista przedmiotów */}
      <div className="inventory-grid" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        gap: "10px",
        maxHeight: "400px",
        overflowY: "auto",
        padding: "10px",
        backgroundColor: "#272b30",
        borderRadius: "4px"
      }}>
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => (
            <div 
              key={`${item.id}-${item.inventoryId || Math.random()}`}
              className={`inventory-item ${selectedItem === item ? "selected" : ""}`}
              onClick={() => handleItemClick(item)}
              style={{
                backgroundColor: "#2c2f33",
                borderRadius: "5px",
                padding: "10px",
                textAlign: "center",
                border: selectedItem === item ? "2px solid #f8d64e" : `2px solid ${getRarityColor(item.rarity)}`,
                cursor: "pointer",
                transition: "transform 0.2s",
                position: "relative",
                boxShadow: `0 0 5px ${getRarityColor(item.rarity, 0.3)}`
              }}
            >
              <img 
                src={getImageUrl(item)} 
                alt={item.name} 
                style={{ 
                  width: "60px", 
                  height: "60px", 
                  objectFit: "contain",
                  marginBottom: "5px",
                  filter: "drop-shadow(0 0 2px rgba(255,255,255,0.2))"
                }}
              />
              <div style={{ 
                fontSize: "11px", 
                color: getRarityColor(item.rarity),
                whiteSpace: "nowrap", 
                overflow: "hidden", 
                textOverflow: "ellipsis"
              }}>
                {item.name}
              </div>
              <div style={{ fontSize: "10px", color: "#f8d64e", marginTop: "3px" }}>
                {item.value} Yang
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px", color: "#aaa" }}>
            Brak przedmiotów w ekwipunku
          </div>
        )}
      </div>
      
      {/* Szczegóły wybranego przedmiotu */}
      {selectedItem && (
        <div className="item-details" style={{ 
          marginTop: "20px", 
          padding: "15px", 
          backgroundColor: "#2c2f33",
          borderRadius: "5px",
          border: `1px solid ${getRarityColor(selectedItem.rarity)}`,
          display: "flex",
          gap: "15px"
        }}>
          <img 
            src={getImageUrl(selectedItem)} 
            alt={selectedItem.name} 
            style={{ 
              width: "80px", 
              height: "80px", 
              objectFit: "contain",
              backgroundColor: "#272b30",
              padding: "5px",
              borderRadius: "5px"
            }}
          />
          
          <div style={{ flex: 1 }}>
            <h3 style={{ 
              margin: "0 0 10px 0", 
              color: getRarityColor(selectedItem.rarity),
              textShadow: "0 0 2px rgba(0,0,0,0.5)" 
            }}>
              {selectedItem.name}
            </h3>
            
            <div style={{ fontSize: "12px", color: "#bbb", marginBottom: "5px" }}>
              <span style={{ 
                textTransform: "uppercase", 
                color: getRarityColor(selectedItem.rarity),
                fontWeight: "bold"
              }}>
                {selectedItem.rarity}
              </span> 
              {isWeapon(selectedItem.name) ? " • Broń" : isArmor(selectedItem.name) ? " • Zbroja" : isAccessory(selectedItem.name) ? " • Dodatek" : ""}
            </div>
            
            <div style={{ fontSize: "14px", color: "#f8d64e", marginBottom: "10px" }}>
              Wartość: {selectedItem.value} Yang
            </div>
            
            <div className="item-actions" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button 
                onClick={() => handleSellItem(selectedItem)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#b33a3a",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer"
                }}
              >
                Sprzedaj
              </button>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Pomocnicze funkcje dla kolorów
function getRarityColor(rarity, opacity = 1) {
  const colors = {
    common: `rgba(157, 157, 157, ${opacity})`,
    uncommon: `rgba(30, 255, 0, ${opacity})`,
    rare: `rgba(0, 112, 221, ${opacity})`,
    epic: `rgba(163, 53, 238, ${opacity})`,
    legendary: `rgba(255, 128, 0, ${opacity})`
  };
  return colors[rarity] || colors.common;
}

export default Inventory;