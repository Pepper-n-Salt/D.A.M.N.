import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  organisationId?: string;
  role?: string;
} | null;

type AuthContextValue = {
  user: User;
  loading: boolean;
  login: (u: User) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/profile", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error(e);
        setUser(null);
      }
      setLoading(false);
    })();
  }, []);

  const login = (u: User) => setUser(u);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
