import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { passwordValidationError } from "@/lib/passwordRecovery";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const { configured, passwordRecoveryStatus, signOut, updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = passwordValidationError(password, confirmation);
    if (validationError) {
      setError(validationError);
      return;
    }
    setBusy(true);
    const result = await updatePassword(password);
    setBusy(false);
    setError(result);
    if (!result) setSuccess(true);
  };

  const returnToSignIn = async () => {
    await signOut();
    setLocation("/");
  };

  return (
    <main className="flex min-h-screen items-center bg-background px-5 py-10 text-white">
      <section className="mx-auto w-full max-w-md border border-lime/35 bg-[#0b0b0b] p-6 sm:p-8">
        <p className="meta text-[0.45rem] text-lime">BTB Fitness & Health</p>
        <h1 className="display mt-3 text-3xl font-bold">Set a new password.</h1>
        {!configured ? <p className="mt-5 text-sm text-white/65">Authentication is awaiting Supabase configuration.</p> : success ? (
          <div className="mt-5 space-y-4">
            <p role="status" className="text-sm text-lime">Your password has been updated.</p>
            <button type="button" onClick={() => void returnToSignIn()} className="h-11 w-full bg-lime text-sm font-bold text-black">Return to sign in</button>
          </div>
        ) : passwordRecoveryStatus === "initializing" ? (
          <p role="status" className="mt-5 text-sm text-white/65">Verifying your password reset link...</p>
        ) : passwordRecoveryStatus !== "ready" ? (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-white/65">This password reset link is invalid or has expired. Request a new link from the sign-in screen.</p>
            <Link href="/" className="block text-sm text-lime hover:text-white">Back to home</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" className="h-11 w-full border border-white/20 bg-black px-3 text-sm outline-none focus:border-lime" />
            <input type="password" required minLength={6} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Confirm new password" className="h-11 w-full border border-white/20 bg-black px-3 text-sm outline-none focus:border-lime" />
            {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
            <button disabled={busy} className="h-11 w-full bg-lime text-sm font-bold text-black disabled:opacity-60">{busy ? "Updating..." : "Update password"}</button>
          </form>
        )}
      </section>
    </main>
  );
}