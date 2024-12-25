'use client'

import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the context
interface UserContextType {
  username: string | null;
  setUsername: (username: string | null) => void;
}

// Create the Context with an initial value of `null`
const UserContext = createContext<UserContextType | null>(null);

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
