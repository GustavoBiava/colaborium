import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { loginRequest, meRequest } from "./authApi";
import { tokenStore } from "./tokenStore";
import type { AuthUser } from "./types";
import { useEffect } from "react";


type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tokenStore.get()) {
      setIsLoading(false);
      return;
    }

    meRequest()
      .then(setUser)
      .catch(() => tokenStore.set(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    const data = await loginRequest(email, senha);

    tokenStore.set(data.accessToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    tokenStore.set(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}