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
