"use client";
import { formatRelativeTime } from "@/lib/utils";
import { toast } from "sonner";

type TimelineEntry = {
  label: string;
  timestamp: string;
};

export default function ActivityTimeline({ entries }: { entries: TimelineEntry[] }) {
  const copyTimestamp = async (timestamp: string) => {
    try {
      await navigator.clipboard.writeText(timestamp);
      toast.success("Timestamp copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-rich_black/70">Activity</h3>
      <div className="space-y-2">
        {entries.map((entry, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-anti_flash_white-900 p-3">
            <div>
              <p className="text-sm font-medium">{entry.label}</p>
              <p className="text-xs text-rich_black/60" title={entry.timestamp}>
                {formatRelativeTime(entry.timestamp)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyTimestamp(entry.timestamp)}
              className="text-xs text-hookers_green hover:underline"
              aria-label={`Copy ${entry.label} timestamp`}
            >
              Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
