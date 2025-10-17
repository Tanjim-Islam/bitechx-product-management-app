export type RecentProduct = {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  categoryName?: string | null;
  viewedAtISO: string;
};

const RECENT_KEY = "btx_recent_products";
const MAX_RECENT = 8;
const UPDATE_EVENT = "btx_recent_products:update";

const isBrowser = typeof window !== "undefined";

function readRaw(): RecentProduct[] {
  if (!isBrowser) return [];
  try {
    const stored = window.localStorage.getItem(RECENT_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is RecentProduct =>
      typeof item === "object" && !!item && typeof item.id === "string" && typeof item.slug === "string"
    );
  } catch {
    return [];
  }
}

function notifySubscribers() {
  if (!isBrowser) return;
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

function writeRaw(items: RecentProduct[]) {
  if (!isBrowser) return;
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(items));
  notifySubscribers();
}

export function getRecentProducts(): RecentProduct[] {
  return readRaw();
}

export function clearRecentProducts() {
  if (!isBrowser) return;
  window.localStorage.removeItem(RECENT_KEY);
  notifySubscribers();
}

export function addRecentProduct(item: RecentProduct) {
  if (!isBrowser) return;
  const now = item.viewedAtISO || new Date().toISOString();
  const candidates = readRaw().filter((existing) => existing.id !== item.id);
  candidates.unshift({ ...item, viewedAtISO: now });
  const trimmed = candidates.slice(0, MAX_RECENT);
  writeRaw(trimmed);
}

export function removeRecentProduct(slug: string) {
  if (!isBrowser) return;
  const filtered = readRaw().filter((item) => item.slug !== slug);
  writeRaw(filtered);
}

export function subscribeToRecentUpdates(listener: () => void) {
  if (!isBrowser) return () => undefined;
  const handler = () => listener();
  const storageHandler = (event: StorageEvent) => {
    if (event.key === RECENT_KEY) listener();
  };
  window.addEventListener(UPDATE_EVENT, handler);
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(UPDATE_EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}
