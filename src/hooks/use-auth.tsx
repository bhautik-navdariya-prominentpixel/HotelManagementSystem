import { useState } from "react";
import { UserModel } from "../models/UserModel";

export const useAuthStore = () => {
  const [user, setUser] = useState<UserModel>(new UserModel());
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData: UserModel) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(new UserModel());
    setIsAuthenticated(false);
  };

  return { user, isAuthenticated, login, logout };
};