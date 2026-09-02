export const PASSWORD_MIN_LENGTH = 6;

export function passwordResetRedirectUrl(origin: string) {
  return new URL("/reset-password", origin).toString();
}

export function isPasswordRecoveryUrl(url: string) {
  const parsed = new URL(url);
  const hash = new URLSearchParams(parsed.hash.slice(1));
  return Boolean(parsed.searchParams.get("code")) || parsed.searchParams.get("type") === "recovery" || hash.get("type") === "recovery";
}

export function recoveryCodeFromUrl(url: string) {
  return new URL(url).searchParams.get("code");
}

export function recoveryTokensFromUrl(url: string) {
  const hash = new URLSearchParams(new URL(url).hash.slice(1));
  const accessToken = hash.get("access_token");
  const refreshToken = hash.get("refresh_token");
  return accessToken && refreshToken ? { accessToken, refreshToken } : null;
}

export function passwordValidationError(password: string, confirmation: string) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (password !== confirmation) return "Passwords do not match.";
  return null;
}

export function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

type PasswordRecoveryAuth = {
  resetPasswordForEmail: (email: string, options: { redirectTo: string }) => Promise<{ error: unknown | null }>;
  updateUser: (attributes: { password: string }) => Promise<{ error: unknown | null }>;
};

type RecoverySessionAuth = {
  exchangeCodeForSession: (code: string) => Promise<{ data: { session: unknown | null }; error: unknown | null }>;
  setSession: (tokens: { access_token: string; refresh_token: string }) => Promise<{ data: { session: unknown | null }; error: unknown | null }>;
};

export type RecoveryStatus = "initializing" | "ready" | "invalid";

export function initialRecoveryStatus(url: string): RecoveryStatus | null {
  return isPasswordRecoveryUrl(url) ? "initializing" : null;
}

export function recoveryStatusForAuthEvent(event: string): RecoveryStatus | null | undefined {
  if (event === "PASSWORD_RECOVERY") return "ready";
  if (event === "SIGNED_OUT") return null;
  return undefined;
}

export function createRecoverySessionInitializer() {
  const exchanges = new Map<string, Promise<{ data: { session: unknown | null }; error: unknown | null }>>();

  return async (auth: RecoverySessionAuth, url: string): Promise<RecoveryStatus> => {
    const code = recoveryCodeFromUrl(url);
    if (code) {
      const exchange = exchanges.get(code) ?? auth.exchangeCodeForSession(code);
      exchanges.set(code, exchange);
      const { data, error } = await exchange;
      return !error && data.session ? "ready" : "invalid";
    }

    const tokens = recoveryTokensFromUrl(url);
    if (!tokens || !isPasswordRecoveryUrl(url)) return "invalid";
    const { data, error } = await auth.setSession({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    });
    return !error && data.session ? "ready" : "invalid";
  };
}

export async function requestPasswordReset(auth: PasswordRecoveryAuth, email: string, origin: string) {
  if (!isValidEmail(email)) return "invalid-email" as const;
  const { error } = await auth.resetPasswordForEmail(email, {
    redirectTo: passwordResetRedirectUrl(origin),
  });
  if (import.meta.env.DEV && error) {
    console.error("Supabase password reset request failed", error);
  }
  return error ? "request-failed" as const : null;
}

export async function updateRecoveryPassword(auth: PasswordRecoveryAuth, password: string) {
  const { error } = await auth.updateUser({ password });
  return error ? "update-failed" as const : null;
}