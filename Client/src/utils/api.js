import { apiUrl } from "./env.js";

const TOKEN_KEY = "mithri_token";
const memoryCache = new Map();

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function cacheKey(path, options) {
  return `${path}:${JSON.stringify(options?.body ?? {})}`;
}

export function clearApiCache(prefix = "") {
  for (const key of memoryCache.keys()) {
    if (!prefix || key.startsWith(prefix)) memoryCache.delete(key);
  }
}

export async function apiRequest(path, options = {}) {
  const { auth = false, cacheMs = 0, ...requestOptions } = options;
  const key = cacheKey(path, requestOptions);
  const cached = memoryCache.get(key);

  if (cacheMs && cached && Date.now() - cached.createdAt < cacheMs) {
    return cached.data;
  }

  const headers = new Headers(requestOptions.headers);
  if (!headers.has("Content-Type") && requestOptions.body) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (auth && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...requestOptions,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message ?? "Request failed");
  }

  if (cacheMs) {
    memoryCache.set(key, { createdAt: Date.now(), data });
  }

  return data;
}
