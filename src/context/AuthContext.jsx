import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session status on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch(
        "http://localhost/CultureConnect/backend/check_session.php",
        {
          method: "GET",
          credentials: "include", // Important: send cookies with request
        }
      );

      const result = await response.json();

      if (result.status === "success" && result.logged_in) {
        setUser(result.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch("http://localhost/CultureConnect/backend/logout.php", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};