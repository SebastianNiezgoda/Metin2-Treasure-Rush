import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
//import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="login-container">Ładowanie...</div>;

  return (
    <Routes>
     {/*<Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/game" />}
      />
      <Route
        path="/game"
        element={user ? <GamePage /> : <Navigate to="/login" />}
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/game" : "/login"} />}
      />*/}
    <Route path="*" element={<GamePage />} />
    </Routes>
  );
}

export default App;
