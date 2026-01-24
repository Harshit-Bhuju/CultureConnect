import React, { createContext, useContext, useState, useEffect } from "react";
import default_logo from "../assets/default-image.jpg";
import API, { BASE_URL } from "../Configs/ApiEndpoints";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const normalizeUserData = (userData) => {
  if (!userData) return null;

  let avatarUrl =
    userData.avatar || userData.picture || userData.profile_pic || "";
  if (!avatarUrl || avatarUrl === "null" || avatarUrl === "undefined")
    avatarUrl = default_logo;
  else if (
    !avatarUrl.startsWith("http") &&
    !avatarUrl.startsWith("blob:") &&
    !avatarUrl.startsWith("data:")
  ) {
    avatarUrl = `${BASE_URL}/uploads/${avatarUrl}`;
  }

  // Handle location as either object or string
  let location = "";
  if (userData.location) {
    if (typeof userData.location === "object" && userData.location !== null) {
      const parts = [];
      if (userData.location.province) {
        parts.push(userData.location.province);
      }
      if (userData.location.district) {
        parts.push(userData.location.district);
      }
      if (userData.location.municipality) {
        parts.push(userData.location.municipality);
      }
      if (userData.location.ward) {
        parts.push(`${userData.location.ward}`);
      }

      location = parts.filter(Boolean).join(", ");
    } else if (typeof userData.location === "string") {
      location = userData.location.trim();
    }
  }

  const normalized = {
    id: userData.id || null,
    email: userData.email || "",
    name: userData.name || userData.username || "",
    avatar: avatarUrl,
    gender: userData.gender || "",
    location: location,
    role: userData.role || "user",
    // ✅ ADD: Include seller_id and teacher_id
    seller_id: userData.seller_id || null,
    teacher_id: userData.teacher_id || null,
  };

  return normalized;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load from localStorage initially
    const saved = localStorage.getItem("authUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [user]);

  // Check session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      await checkSession();
    };
    initializeAuth();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch(API.CHECK_SESSION, {
        method: "GET",
        credentials: "include",
      });
      const result = await res.json();
      if (result.status === "success" && result.logged_in) {
        const normalized = normalizeUserData(result.user);
        setUser(normalized);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Check session error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    const normalized = normalizeUserData(userData);
    setUser(normalized);
  };

  const logout = async () => {
    try {
      await fetch(API.LOGOUT, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        checkSession,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
