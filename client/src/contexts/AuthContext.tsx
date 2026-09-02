import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { initialRecoveryStatus, isPasswordRecoveryUrl, recoveryStatusForAuthEvent, requestPasswordReset as sendPasswordReset, type RecoveryStatus, updateRecoveryPassword } from "@/lib/passwordRecovery";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  passwordRecoveryStatus: RecoveryStatus | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  requestPasswordReset: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
  signInWithGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordRecoveryStatus, setPasswordRecoveryStatus] = useState<RecoveryStatus | null>(() =>
    typeof window !== "undefined" && window.location.pathname === "/reset-password" ? initialRecoveryStatus(window.location.href) : null,
  );

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      const recoveryStatus = recoveryStatusForAuthEvent(event);
      if (recoveryStatus !== undefined) setPasswordRecoveryStatus(recoveryStatus);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || typeof window === "undefined" || window.location.pathname !== "/reset-password" || !isPasswordRecoveryUrl(window.location.href)) return;

    let active = true;
    setPasswordRecoveryStatus("initializing");
    void supabase.auth.getSession().then(({ data }) => {
      if (active) setPasswordRecoveryStatus(data.session ? "ready" : "invalid");
    });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      configured: isSupabaseConfigured,
      passwordRecoveryStatus,
      async signIn(email, password) {
        if (!supabase) return "Authentication is not configured yet.";
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error?.message ?? null;
      },
      async signUp(email, password) {
        if (!supabase) return "Authentication is not configured yet.";
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        return error?.message ?? null;
      },
      async requestPasswordReset(email) {
        if (!supabase) return "Authentication is not configured yet.";
        const result = await sendPasswordReset(supabase.auth, email, window.location.origin);
        if (result === "invalid-email") return "Enter a valid email address.";
        return result ? "We could not send a reset email. Please try again." : null;
      },
      async updatePassword(password) {
        if (!supabase || passwordRecoveryStatus !== "ready") return "This password reset link is invalid or has expired.";
        const result = await updateRecoveryPassword(supabase.auth, password);
        if (result) return "We could not update your password. Request a new reset link and try again.";
        setPasswordRecoveryStatus(null);
        return null;
      },
      async signInWithGoogle() {
        if (!supabase) return "Authentication is not configured yet.";
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: window.location.origin },
        });
        return error?.message ?? null;
      },
      async signOut() {
        await supabase?.auth.signOut();
      },
    }),
    [loading, passwordRecoveryStatus, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
