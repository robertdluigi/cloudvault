'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { validateAuth } from "@/lib/auth"; // Ensure this function validates the token and fetches the user data

interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  [key: string]: any;
}

interface UserContextProps {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logoutUser: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

// UserContextProvider component
export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Get token from localStorage
        if (token) {
          // Try to validate auth and get user data
          const userData = await validateAuth(token); // Pass the token to the validateAuth function
          setUser(userData); // Assuming the returned data is directly the user object
        } else {
          setUser(null); // Clear user if no token is found
        }
      } catch (error) {
        setUser(null); // Clear user if auth is invalid
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Function to logout the user
  const logoutUser = () => {
    setUser(null); // Clear user data locally
    localStorage.removeItem("authToken"); // Clear auth token
    // TODO: Call logout API to clear session on the server if necessary
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Helper function to use the UserContext
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};
