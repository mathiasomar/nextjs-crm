"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import api from "@/app/utils/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: "AGENT" | "MANAGER" | "ADMIN" | "SUPPORT";
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: "AGENT" | "MANAGER" | "ADMIN" | "SUPPORT";
  department?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get("access_token");
      if (token) {
        const response = await api.get("/auth/me");
        setUser(response.data.data.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, tokens } = response.data.data;

      Cookies.set("access_token", tokens.accessToken, { secure: true });
      Cookies.set("refresh_token", tokens.refreshToken, { secure: true });

      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await api.post("/auth/register", data);
      const { user, tokens } = response.data.data;

      Cookies.set("access_token", tokens.accessToken, { secure: true });
      Cookies.set("refresh_token", tokens.refreshToken, { secure: true });

      setUser(user);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      setUser(null);
      window.location.href = "/login";
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.data.user);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
