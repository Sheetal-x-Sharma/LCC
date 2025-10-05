// context/authContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "../axios"; // uses the configured axios instance
import { googleLogout } from "@react-oauth/google";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("jwt") || null);
  const [googleIdToken, setGoogleIdToken] = useState(
    localStorage.getItem("googleIdToken") || null
  );

  // ✅ Login stores JWT + Google ID token
  const login = (userData, userToken, googleToken) => {
    setCurrentUser(userData);
    setToken(userToken);
    setGoogleIdToken(googleToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("jwt", userToken);
    localStorage.setItem("googleIdToken", googleToken);
  };

  // ✅ Logout clears backend + Google + revoke ID token
  const logout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Backend logout failed:", err);
    }

    try {
      googleLogout();

      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }

      if (googleIdToken) {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${googleIdToken}`, {
          method: "POST",
          headers: { "Content-type": "application/x-www-form-urlencoded" },
        });
      }
    } catch (err) {
      console.error("Google logout failed:", err);
    }

    setCurrentUser(null);
    setToken(null);
    setGoogleIdToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    localStorage.removeItem("googleIdToken");
  };

  useEffect(() => {
    if (currentUser && token) {
      localStorage.setItem("user", JSON.stringify(currentUser));
      localStorage.setItem("jwt", token);
    }
  }, [currentUser, token]);

  return (
    <AuthContext.Provider value={{ currentUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
