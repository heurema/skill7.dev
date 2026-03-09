export const SIFT_ZITADEL_ISSUER = "https://auth.10g.dev";
export const SIFT_ZITADEL_CLIENT_ID = "363219421096902778";
export const SIFT_ZITADEL_PROJECT_ID = "363219420929065082";
export const SIFT_AUTH_REDIRECT_URI = "https://skill7.dev/auth/callback";
export const SIFT_AUTH_DEFAULT_RETURN_TO = "/sift/app";
export const SIFT_AUTH_EVENT_NAME = "skill7:sift-auth-changed";
export const SIFT_AUTH_SCOPES = [
  "openid",
  "profile",
  "email",
  "offline_access",
  `urn:zitadel:iam:org:project:id:${SIFT_ZITADEL_PROJECT_ID}:aud`,
].join(" ");

const AUTHORIZE_ENDPOINT = `${SIFT_ZITADEL_ISSUER}/oauth/v2/authorize`;
const TOKEN_ENDPOINT = `${SIFT_ZITADEL_ISSUER}/oauth/v2/token`;
const SESSION_STORAGE_KEY = "skill7.sift.session";
const REQUEST_STORAGE_KEY = "skill7.sift.auth_request";

export interface SiftAuthSession {
  accessToken: string;
  idToken?: string;
  refreshToken?: string;
  tokenType: string;
  scope: string;
  expiresAt: number;
  createdAt: number;
}

interface SiftAuthRequest {
  state: string;
  codeVerifier: string;
  returnTo: string;
  createdAt: number;
}

function ensureBrowser(): void {
  if (typeof window === "undefined") {
    throw new Error("browser-only auth helper");
  }
}

function base64UrlEncode(input: Uint8Array): string {
  const binary = Array.from(input, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=");
  return atob(padded);
}

function randomString(bytes = 32): string {
  ensureBrowser();
  const buffer = new Uint8Array(bytes);
  window.crypto.getRandomValues(buffer);
  return base64UrlEncode(buffer);
}

async function sha256(input: string): Promise<Uint8Array> {
  ensureBrowser();
  const encoded = new TextEncoder().encode(input);
  const digest = await window.crypto.subtle.digest("SHA-256", encoded);
  return new Uint8Array(digest);
}

function saveAuthRequest(request: SiftAuthRequest): void {
  ensureBrowser();
  window.sessionStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(request));
}

function emitAuthChange(): void {
  ensureBrowser();
  window.dispatchEvent(new CustomEvent(SIFT_AUTH_EVENT_NAME));
}

export function getAuthRequest(): SiftAuthRequest | null {
  ensureBrowser();
  const raw = window.sessionStorage.getItem(REQUEST_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SiftAuthRequest;
  } catch {
    window.sessionStorage.removeItem(REQUEST_STORAGE_KEY);
    return null;
  }
}

export function clearAuthRequest(): void {
  ensureBrowser();
  window.sessionStorage.removeItem(REQUEST_STORAGE_KEY);
}

export function storeSession(session: SiftAuthSession): void {
  ensureBrowser();
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  emitAuthChange();
}

export function getSession(): SiftAuthSession | null {
  ensureBrowser();
  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SiftAuthSession;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function clearSession(): void {
  ensureBrowser();
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  emitAuthChange();
}

export function isSessionValid(session: SiftAuthSession | null): session is SiftAuthSession {
  if (!session) return false;
  return session.expiresAt > Date.now() + 15_000;
}

export async function beginSiftLogin(returnTo = SIFT_AUTH_DEFAULT_RETURN_TO): Promise<string> {
  const state = randomString(24);
  const codeVerifier = randomString(48);
  const codeChallenge = base64UrlEncode(await sha256(codeVerifier));
  const safeReturnTo = normalizeReturnTo(returnTo);

  saveAuthRequest({
    state,
    codeVerifier,
    returnTo: safeReturnTo,
    createdAt: Date.now(),
  });

  const url = new URL(AUTHORIZE_ENDPOINT);
  url.searchParams.set("client_id", SIFT_ZITADEL_CLIENT_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", SIFT_AUTH_REDIRECT_URI);
  url.searchParams.set("scope", SIFT_AUTH_SCOPES);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", state);
  return url.toString();
}

export async function exchangeCodeForSession(code: string, codeVerifier: string): Promise<SiftAuthSession> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: SIFT_ZITADEL_CLIENT_ID,
    code,
    code_verifier: codeVerifier,
    redirect_uri: SIFT_AUTH_REDIRECT_URI,
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `token exchange failed with ${response.status}`);
  }

  const payload = (await response.json()) as {
    access_token: string;
    id_token?: string;
    refresh_token?: string;
    token_type: string;
    scope?: string;
    expires_in: number;
  };

  return {
    accessToken: payload.access_token,
    idToken: payload.id_token,
    refreshToken: payload.refresh_token,
    tokenType: payload.token_type,
    scope: payload.scope ?? SIFT_AUTH_SCOPES,
    createdAt: Date.now(),
    expiresAt: Date.now() + payload.expires_in * 1000,
  };
}

export function normalizeReturnTo(value: string | null | undefined): string {
  if (!value || !value.startsWith("/")) {
    return SIFT_AUTH_DEFAULT_RETURN_TO;
  }
  if (value.startsWith("//")) {
    return SIFT_AUTH_DEFAULT_RETURN_TO;
  }
  return value;
}

export function decodeJwtPayload(token: string | undefined): Record<string, unknown> | null {
  if (!token) return null;
  const [, payload] = token.split(".");
  if (!payload) return null;

  try {
    const decoded = base64UrlDecode(payload);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getDisplayIdentity(session: SiftAuthSession | null): {
  label: string;
  email?: string;
  sub?: string;
} | null {
  if (!session) return null;

  const payload = decodeJwtPayload(session.idToken) ?? decodeJwtPayload(session.accessToken);
  if (!payload) {
    return { label: "Authenticated session" };
  }

  const email = typeof payload.email === "string" ? payload.email : undefined;
  const preferredUsername =
    typeof payload.preferred_username === "string" ? payload.preferred_username : undefined;
  const name = typeof payload.name === "string" ? payload.name : undefined;
  const sub = typeof payload.sub === "string" ? payload.sub : undefined;

  return {
    label: name ?? preferredUsername ?? email ?? "Authenticated session",
    email,
    sub,
  };
}
