import { describe, expect, it, vi } from "vitest";
import { createRecoverySessionInitializer, initialRecoveryStatus, isPasswordRecoveryUrl, isValidEmail, passwordResetRedirectUrl, passwordValidationError, recoveryStatusForAuthEvent, requestPasswordReset, updateRecoveryPassword } from "@/lib/passwordRecovery";

describe("password recovery", () => {
  it("creates a reset callback URL for the active deployment origin", () => {
    expect(passwordResetRedirectUrl("https://www.btbfitnessandhealth.com")).toBe("https://www.btbfitnessandhealth.com/reset-password");
    expect(passwordResetRedirectUrl("http://localhost:3000")).toBe("http://localhost:3000/reset-password");
  });

  it("validates reset request email addresses", () => {
    expect(isValidEmail("member@btb.test")).toBe(true);
    expect(isValidEmail("not-an-email")).toBe(false);
  });

  it("requests a password reset using the current deployment callback", async () => {
    const auth = {
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
      updateUser: vi.fn(),
    };

    await expect(requestPasswordReset(auth, "member@btb.test", "https://www.btbfitnessandhealth.com")).resolves.toBeNull();
    expect(auth.resetPasswordForEmail).toHaveBeenCalledWith("member@btb.test", {
      redirectTo: "https://www.btbfitnessandhealth.com/reset-password",
    });
  });

  it("does not request a reset for an invalid email address", async () => {
    const auth = {
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    };

    await expect(requestPasswordReset(auth, "not-an-email", "https://www.btbfitnessandhealth.com")).resolves.toBe("invalid-email");
    expect(auth.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it("detects Supabase recovery callbacks", () => {
    expect(isPasswordRecoveryUrl("https://www.btbfitnessandhealth.com/reset-password?code=one-time-code")).toBe(true);
    expect(isPasswordRecoveryUrl("https://www.btbfitnessandhealth.com/reset-password#access_token=token&type=recovery")).toBe(true);
    expect(isPasswordRecoveryUrl("https://www.btbfitnessandhealth.com/reset-password?type=recovery")).toBe(true);
    expect(isPasswordRecoveryUrl("https://www.btbfitnessandhealth.com/reset-password")).toBe(false);
  });

  it("keeps a recovery link loading until session establishment finishes", () => {
    expect(initialRecoveryStatus("https://www.btbfitnessandhealth.com/reset-password?code=one-time-code")).toBe("initializing");
    expect(initialRecoveryStatus("https://www.btbfitnessandhealth.com/reset-password")).toBeNull();
  });

  it("exchanges a PKCE code once, even when initialization runs twice", async () => {
    let resolveExchange: (value: { data: { session: unknown | null }; error: unknown | null }) => void;
    const auth = {
      exchangeCodeForSession: vi.fn(() => new Promise<{ data: { session: unknown | null }; error: unknown | null }>(resolve => { resolveExchange = resolve; })),
      setSession: vi.fn(),
    };
    const initialize = createRecoverySessionInitializer();
    const url = "https://www.btbfitnessandhealth.com/reset-password?code=one-time-code";
    const first = initialize(auth, url);
    const second = initialize(auth, url);

    expect(auth.exchangeCodeForSession).toHaveBeenCalledTimes(1);
    resolveExchange!({ data: { session: { access_token: "token" } }, error: null });
    await expect(first).resolves.toBe("ready");
    await expect(second).resolves.toBe("ready");
  });

  it("supports implicit recovery sessions and rejects invalid or expired links", async () => {
    const initialize = createRecoverySessionInitializer();
    const auth = {
      exchangeCodeForSession: vi.fn(),
      setSession: vi.fn().mockResolvedValue({ data: { session: { access_token: "token" } }, error: null }),
    };
    await expect(initialize(auth, "https://www.btbfitnessandhealth.com/reset-password#access_token=token&refresh_token=token&type=recovery")).resolves.toBe("ready");
    expect(auth.setSession).toHaveBeenCalledWith({ access_token: "token", refresh_token: "token" });
    await expect(initialize(auth, "https://www.btbfitnessandhealth.com/reset-password#type=recovery")).resolves.toBe("invalid");
    await expect(initialize(auth, "https://www.btbfitnessandhealth.com/reset-password")).resolves.toBe("invalid");
  });

  it("accepts Supabase's PASSWORD_RECOVERY event", () => {
    expect(recoveryStatusForAuthEvent("PASSWORD_RECOVERY")).toBe("ready");
    expect(recoveryStatusForAuthEvent("SIGNED_OUT")).toBeNull();
    expect(recoveryStatusForAuthEvent("SIGNED_IN")).toBeUndefined();
  });

  it("requires matching passwords with the configured minimum length", () => {
    expect(passwordValidationError("short", "short")).toBe("Password must be at least 6 characters.");
    expect(passwordValidationError("long-enough", "different")).toBe("Passwords do not match.");
    expect(passwordValidationError("long-enough", "long-enough")).toBeNull();
  });

  it("updates the password after a valid recovery session", async () => {
    const auth = {
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn().mockResolvedValue({ error: null }),
    };

    await expect(updateRecoveryPassword(auth, "new-password")).resolves.toBeNull();
    expect(auth.updateUser).toHaveBeenCalledWith({ password: "new-password" });
  });
});