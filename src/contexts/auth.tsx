"use client";

import { UserBackendResponse } from "@/types/api";
import { createContext, useState, useContext } from "react"

export type AuthContextType = {
  userInfo: UserBackendResponse | null;
  isLoggedIn: boolean;
  setUserInfo: (user: UserBackendResponse | null) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  isLoadingAuth: boolean;
  setIsLoadingAuth: (loading: boolean) => void; 
};

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserBackendResponse | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); 

  const contextValue: AuthContextType = {
    userInfo,
    isLoggedIn,
    setUserInfo,
    setIsLoggedIn,
    isLoadingAuth, 
    setIsLoadingAuth, 
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);