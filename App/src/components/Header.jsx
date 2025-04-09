import React from "react";

function Header({ onLogout }) {
  return (
    <header>
      <h1>Metin2 Treasure Rush</h1>
      <button onClick={onLogout} style={{ position: "absolute", right: "1rem", top: "1rem" }}>
        Wyloguj
      </button>
    </header>
  );
}

export default Header;