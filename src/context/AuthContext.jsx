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

  console.log("Normalized user data:", normalized);
  return normalized;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load from localStorage initially
    const saved = localStorage.getItem("authUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [savedAccounts, setSavedAccounts] = useState([]);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      console.log("Saving user to localStorage:", user);
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

  // Load saved accounts when user changes
  useEffect(() => {
    if (user?.email) loadSavedAccounts();
    else setSavedAccounts([]);
  }, [user?.email]);

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

  const loadSavedAccounts = async () => {
    try {
      const res = await fetch(API.GET_SAVED_ACCOUNTS, {
        method: "GET",
        credentials: "include",
      });
      const result = await res.json();
      if (result.status === "success") {
        const normalized = (result.accounts || [])
          .map(normalizeUserData)
          .filter((acc) => acc && acc.email);
        setSavedAccounts(normalized);
      }
    } catch (err) {
      console.error("Load saved accounts error:", err);
      setSavedAccounts([]);
    }
  };

  const login = async (userData, skipAutoSave = false) => {
    console.log("Login called with userData:", userData);
    const normalized = normalizeUserData(userData);
    console.log("Setting user to:", normalized);
    setUser(normalized);

    // Only auto-save if this is a normal login (not part of add account flow)
    if (!skipAutoSave && normalized?.email && normalized?.role !== "admin") {
      try {
        const formData = new URLSearchParams();
        formData.append("account_email", normalized.email);

        await fetch(API.SAVE_ACCOUNT, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        });
      } catch (err) {
        console.error("Error saving account:", err);
      }
    }
  };

  const logout = async () => {
    try {
      await fetch(API.LOGOUT, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setSavedAccounts([]);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const switchAccount = async (accountEmail) => {
    try {
      const formData = new URLSearchParams();
      formData.append("account_email", accountEmail);

      const res = await fetch(API.SWITCH_ACCOUNT, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      const result = await res.json();

      if (result.status === "success") {
        const normalized = normalizeUserData(result.user);
        setUser(normalized);

        setTimeout(async () => {
          await loadSavedAccounts();
        }, 50);

        return { success: true, user: normalized };
      }

      return { success: false, message: result.message };
    } catch (err) {
      console.error("Switch account error:", err);
      return { success: false, message: "Network error" };
    }
  };

  const removeAccount = async (accountEmail) => {
    try {
      const formData = new URLSearchParams();
      formData.append("account_email", accountEmail);

      const res = await fetch(API.REMOVE_SAVED_ACCOUNT, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      const result = await res.json();
      if (result.status === "success") {
        await loadSavedAccounts();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Remove account error:", err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        savedAccounts,
        login,
        logout,
        checkSession,
        switchAccount,
        removeAccount,
        loadSavedAccounts,
      }}>
      {children}
    </AuthContext.Provider>
  );
};