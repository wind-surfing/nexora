"use client";

import { mockUser } from "@/config";
import { getCredentials, updateCurrentUser } from "@/helper/idb";
import { User } from "@/types/users";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  user: User;
  loading: boolean;
  updateUser: (updates: Partial<User>) => void;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(mockUser);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);

    try {
      const user = await getCredentials();

      if (user) {
        setUser({
          username: user.username ?? "",
          currentSignalGauge: user.currentSignalGauge ?? 0,
          requiredSignalGauge: user.requiredSignalGauge ?? 0,
          currentSignalLevel: user.currentSignalLevel ?? 0,
          lastSignalAt: user.lastSignalAt ?? new Date(),
          nexoins: user.nexoins ?? 0,
          ownedItems: user.ownedItems ?? {},
        });
      } else {
        setUser(mockUser);
      }
    } catch (error) {
      setUser(mockUser);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const updateUser = async (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
    await updateCurrentUser({ ...updates });
  };

  return (
    <UserContext.Provider
      value={{ user, loading, updateUser, setUser, refreshUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
