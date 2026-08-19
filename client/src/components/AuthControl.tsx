import { useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function AuthControl() {
  const { user, configured, signIn, signInWithGoogle, signOut, signUp } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    const result = mode === "signin" ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    setError(result);
    if (!result && mode === "signin") setOpen(false);
  };

  if (user) {
    return (
      <button type="button" onClick={() => signOut()} className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-xs text-white/75 transition-colors hover:border-lime hover:text-lime">
        <UserRound className="h-3.5 w-3.5" />
        <span className="max-w-24 truncate">{user.email?.split("@")[0] ?? "Account"}</span>
        <LogOut className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex border border-lime/50 px-3 py-2 text-xs font-semibold text-lime transition-colors hover:bg-lime hover:text-black">
        Sign In / Sign Up
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-lime/35 bg-[#0b0b0b] text-white sm:max-w-sm">
          <DialogHeader className="text-left">
            <DialogTitle className="display text-2xl text-white">{mode === "signin" ? "Welcome back." : "Build your account."}</DialogTitle>
            <DialogDescription className="text-white/60">Save blueprints, routines, and training history to your profile.</DialogDescription>
          </DialogHeader>
          {!configured ? (
            <p className="border border-lime/30 bg-lime/[0.06] p-3 text-sm leading-relaxed text-white/75">Authentication is awaiting Supabase configuration.</p>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="h-11 w-full border border-white/20 bg-black px-3 text-sm outline-none focus:border-lime" />
              <input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="h-11 w-full border border-white/20 bg-black px-3 text-sm outline-none focus:border-lime" />
              {error && <p className="text-xs text-red-300">{error}</p>}
              <button disabled={busy} className="h-11 w-full bg-lime text-sm font-bold text-black disabled:opacity-60">{busy ? "Working..." : mode === "signin" ? "Sign In" : "Create Account"}</button>
              <button type="button" onClick={async () => setError(await signInWithGoogle())} className="h-10 w-full border border-white/20 text-sm font-semibold hover:border-lime hover:text-lime">Continue with Google</button>
              <button type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }} className="w-full text-xs text-white/60 hover:text-lime">{mode === "signin" ? "Need an account? Sign up" : "Already registered? Sign in"}</button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
