const VIEWER_ID_KEY = "rf_viewer_id";
const LAST_SEEN_KEY = "rf_last_seen";
const VIEWER_NAME_KEY = "rf_viewer_name";

export function getViewerId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VIEWER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VIEWER_ID_KEY, id);
  }
  return id;
}

export function getLastSeen(): string {
  if (typeof window === "undefined") return new Date().toISOString();
  return localStorage.getItem(LAST_SEEN_KEY) || new Date(0).toISOString();
}

export function setLastSeenNow(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());
}

export function getViewerName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(VIEWER_NAME_KEY) || "";
}

export function setViewerName(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(VIEWER_NAME_KEY, name);
}
