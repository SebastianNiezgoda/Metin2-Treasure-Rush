import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useEffect } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const createAdminAccount = async () => {
      try {
        await createUserWithEmailAndPassword(auth, "admin@test.com", "1234");
        console.log("Konto admin utworzone.");
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          console.log("Konto admin już istnieje.");
        } else {
          console.error("Błąd tworzenia konta admin:", error);
        }
      }
    };
  
    createAdminAccount();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError("Błąd logowania/rejestracji: " + err.message);
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          {isRegistering ? "Zarejestruj się" : "Zaloguj się"}
        </button>
      </form>
      <p onClick={() => setIsRegistering(!isRegistering)} style={{ cursor: "pointer", marginTop: "1rem" }}>
        {isRegistering ? "Masz już konto? Zaloguj się" : "Nie masz konta? Zarejestruj się"}
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginForm;