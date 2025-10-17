export const apiBase = process.env.NEXT_PUBLIC_API_BASE || "https://api.bitechx.com";
export const toQuery = (q: Record<string, string | number | undefined>) =>
  Object.entries(q)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");

export const fallbackImage = "https://placehold.co/600x400.png";
export function sanitizeImageUrl(u?: string): string {
  if (!u) return fallbackImage;
  try {
    const url = new URL(u);
    const host = url.hostname.toLowerCase();
    if (host.includes("istockphoto.com")) return fallbackImage;
    if (url.pathname.endsWith(".svg")) return fallbackImage;
    return u;
  } catch {
    return fallbackImage;
  }
}

export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
}
