
"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";

interface AuthContextType {
  user: any | null; 
  loading: boolean;
  token: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  token: null,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  
  // Adapt NextAuth session user for the context
  const user = session?.user ? {
    ...session.user,
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role
  } : null;

  // NextAuth uses session cookies primarily, but we can pass a value if API needs it.
  const token = null;

  const logout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

