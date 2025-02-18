import { createContext, useContext } from "react";
import useSWR, { type KeyedMutator } from "swr";

import { useSessionContext } from "@/feature/auth/application/contexts/SessionContext";
import { getProfile } from "../service/userService";
import { type User } from "../types/user";

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  mutate: KeyedMutator<User | null>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { session } = useSessionContext();
  const {
    data: user,
    isLoading,
    error,
    mutate,
  } = useSWR<User | null>(session?.user.id ?? null, getProfile, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // 5秒間は重複したリクエストを防ぐ
  });

  return (
    <UserContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error: error as Error | null,
        mutate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
