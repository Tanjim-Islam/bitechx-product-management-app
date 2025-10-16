export default function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded-full bg-anti_flash_white-800 px-2 py-1 text-xs text-rich_black/70">{children}</span>;
}

