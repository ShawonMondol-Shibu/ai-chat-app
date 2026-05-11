"use client";

import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { type User } from "@/types";
import { useSession, signOut } from "@/lib/auth-client";

interface AuthContextValue {
  user: User | null;
  isPending: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const betterUser = session?.user;

  const user: User | null = betterUser
    ? {
        id: betterUser.id,
        name: betterUser.name,
        email: betterUser.email,
        avatar: betterUser.image ?? undefined,
      }
    : null;

  const handleSignIn = useCallback(() => {
    router.push("/sign-in");
  }, [router]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isPending,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
