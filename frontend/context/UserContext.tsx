'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { validateAuth } from "@/lib/auth";

// Define the user interface
interface User {
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  [key: string]: any; // Add other fields as needed
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
        const userData = await validateAuth();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Function to logout the user
  const logoutUser = () => {
    setUser(null); // Clear user data locally
    // Add any other logout logic (e.g., API call to logout)
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