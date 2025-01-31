"use client";

import { createContext, useState, useEffect, ReactNode } from "react";

// Define User Interface
interface User {
  name: string;
  email: string;
  img: string;
  rollNumber: string;
  school: string;
  college: string;
  contactNo: string;
  year: string;
  access: string;
  editProfileCount: number;
  regForm: boolean;
  blurhash: string;
}

// Define AuthContext Type
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (
    name: string,
    email: string,
    img: string,
    rollNumber: string,
    school: string,
    college: string,
    contactNo: string,
    year: string,
    access: string,
    editProfileCount: number,
    regForm: boolean,
    blurhash: string,
    token: string,
    expiry: number
  ) => void;
  logout: () => void;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = (
    name: string,
    email: string,
    img: string,
    rollNumber: string,
    school: string,
    college: string,
    contactNo: string,
    year: string,
    access: string,
    editProfileCount: number,
    regForm: boolean,
    blurhash: string,
    userToken: string,
    expiry: number
  ) => {
    const newUser: User = {
      name,
      email,
      img,
      rollNumber,
      school,
      college,
      contactNo,
      year,
      access,
      editProfileCount,
      regForm,
      blurhash,
    };

    setUser(newUser);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    // Auto logout after expiry time
    setTimeout(() => {
      logout();
    }, expiry);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;