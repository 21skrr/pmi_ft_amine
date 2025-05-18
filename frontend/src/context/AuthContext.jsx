import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin } from "../api/authApi";
import { getCurrentUser } from "../api/userApi";

const AuthContext = createContext(null);

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
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          // We'll fetch the latest user data in the next useEffect
        } catch (error) {
          console.error("Error parsing stored user:", error);
          logout(); // Clear invalid data
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Fetch current user data with latest onboarding progress when authenticated
  useEffect(() => {
    if (user && isAuthenticated) {
      getCurrentUser()
        .then((updatedUser) => {
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        })
        .catch((error) => {
          console.error("Error fetching current user:", error);
          // If we can't get the user data, the token might be invalid
          if (error.response && error.response.status === 401) {
            logout();
          }
        });
    }
  }, [isAuthenticated]);

  // Login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiLogin(email, password);
      const { user, token } = response;

      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Update user in context
  const updateUserContext = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    updateUserContext,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
