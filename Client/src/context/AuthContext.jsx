import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, clearToken, getToken, setToken } from "../utils/api.js";

const AuthContext = createContext(null);

function readJsonStorage(key) {
  const value = localStorage.getItem(key);

  if (!value || value === "undefined" || value === "null") {
    localStorage.removeItem(key);
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(Boolean(getToken()));
  const [user, setUser] = useState(() => {
    return readJsonStorage("mithri_user");
  });

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest("/auth/me", { auth: true });
        if (!active) return;
        setUser(data.user);
        localStorage.setItem("mithri_user", JSON.stringify(data.user));
      } catch {
        clearToken();
        localStorage.removeItem("mithri_user");
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login: async (credentials) => {
        const data = await apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify(credentials)
        });
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("mithri_user", JSON.stringify(data.user));
        return data.user;
      },
      register: async (payload) => {
        const data = await apiRequest("/auth/register", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("mithri_user", JSON.stringify(data.user));
        return data.user;
      },
      logout: () => {
        setUser(null);
        clearToken();
        localStorage.removeItem("mithri_user");
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
