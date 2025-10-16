export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-anti_flash_white-900 shadow-soft ${className}`}>{children}</div>;
}
export function CardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-rich_black/10 px-4 py-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      {action}
    </div>
  );
}
export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}</div>;
}

