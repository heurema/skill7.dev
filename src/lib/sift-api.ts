import type { SiftAuthSession } from "./auth";

export const SIFT_API_BASE = "https://api.skill7.dev";

const SIFT_WS_PROTOCOL = "sift.v1";
const SIFT_WS_BEARER_PREFIX = "bearer.";

export interface SiftDigest {
  scope: string;
  window: string;
  markdown_url: string;
  event_count: number;
  generated_at: string;
}

export interface SiftEvent {
  event_id: string;
  category: string;
  status: string;
  event_type: string;
  title: string;
  summary_1l: string;
  summary_5l?: string[];
  assets?: string[];
  topics?: string[];
  published_at: string;
  updated_at: string;
  first_seen_at: string;
  last_verified_at: string;
  importance_score: number;
  confidence_score: number;
  source_cluster_size: number;
}

interface SiftEventListResponse {
  items: SiftEvent[];
  next_cursor: string | null;
}

export interface SiftStreamEnvelope {
  type: string;
  generated_at: string;
  payload?: Record<string, unknown>;
}

export class SiftAPIError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(message: string, status: number, body = "") {
    super(message);
    this.name = "SiftAPIError";
    this.status = status;
    this.body = body;
  }
}

function authHeader(session: SiftAuthSession): string {
  const tokenType = session.tokenType?.trim() || "Bearer";
  return `${tokenType} ${session.accessToken}`;
}

function buildAPIURL(pathname: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(pathname, SIFT_API_BASE);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) {
        continue;
      }
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function buildWebSocketURL(pathname: string): string {
  const url = new URL(pathname, SIFT_API_BASE);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}

async function readErrorBody(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const payload = (await response.json()) as { error?: string; message?: string; detail?: string } | string;
      if (typeof payload === "string" && payload.trim() !== "") {
        return payload;
      }
      if (payload && typeof payload === "object") {
        if (typeof payload.error === "string" && payload.error.trim() !== "") {
          return payload.error;
        }
        if (typeof payload.message === "string" && payload.message.trim() !== "") {
          return payload.message;
        }
        if (typeof payload.detail === "string" && payload.detail.trim() !== "") {
          return payload.detail;
        }
      }
      return JSON.stringify(payload);
    } catch {
      return "";
    }
  }

  try {
    return (await response.text()).trim();
  } catch {
    return "";
  }
}

async function requestJSON<T>(
  pathname: string,
  session: SiftAuthSession,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const response = await fetch(buildAPIURL(pathname, params), {
    method: "GET",
    headers: {
      Authorization: authHeader(session),
    },
  });

  if (!response.ok) {
    const body = await readErrorBody(response);
    throw new SiftAPIError(body || `request failed with ${response.status}`, response.status, body);
  }

  return (await response.json()) as T;
}

export async function listSiftEvents(
  session: SiftAuthSession,
  params: {
    category?: string;
    limit?: number;
  } = {},
): Promise<SiftEvent[]> {
  const payload = await requestJSON<SiftEventListResponse>("/v1/events", session, {
    category: params.category ?? "crypto",
    limit: params.limit ?? 8,
  });

  return payload.items;
}

export async function getSiftDigest(
  session: SiftAuthSession,
  scope = "crypto",
  window = "24h",
): Promise<SiftDigest> {
  return requestJSON<SiftDigest>(`/v1/digests/${encodeURIComponent(scope)}/${encodeURIComponent(window)}`, session);
}

export function openSiftUpdatesSocket(session: SiftAuthSession): WebSocket {
  return new WebSocket(buildWebSocketURL("/v1/ws"), [
    SIFT_WS_PROTOCOL,
    `${SIFT_WS_BEARER_PREFIX}${session.accessToken}`,
  ]);
}

export function resolveSiftAssetURL(pathname: string): string | null {
  try {
    const baseURL = new URL(SIFT_API_BASE);
    const resolved = new URL(pathname, baseURL);

    if (resolved.protocol !== "https:" && resolved.protocol !== "http:") {
      return null;
    }

    if (resolved.origin !== baseURL.origin) {
      return null;
    }

    return resolved.toString();
  } catch {
    return null;
  }
}
