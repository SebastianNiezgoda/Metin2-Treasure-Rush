import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import "../App.css";

function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/game");
    } catch (error) {
      console.error("Błąd logowania:", error);
      alert("Nie udało się zalogować. Spróbuj ponownie.");
    }
  };

  return (
    <div className="login-container">
      <h1>Metin2 Treasure Rush</h1>
      <p>Zaloguj się przez Google lub Email</p>

      <button onClick={handleGoogleLogin} className="spin-button" style={{ marginBottom: "1rem" }}>
        Zaloguj przez Google
      </button>

      <LoginForm />
    </div>
  );
}

export default LoginPage;
