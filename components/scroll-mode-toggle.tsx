"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "btx_scroll_mode";

export default function ScrollModeToggle({ value, onChange }: { value: "paginated" | "infinite"; onChange: (mode: "paginated" | "infinite") => void }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "infinite" || stored === "paginated") {
      onChange(stored);
    }
    setHydrated(true);
  }, [onChange]);

  const handleChange = (mode: "paginated" | "infinite") => {
    localStorage.setItem(STORAGE_KEY, mode);
    onChange(mode);
  };

  if (!hydrated) return null;

  return (
    <div className="inline-flex rounded-lg bg-anti_flash_white-900 p-1">
      <button
        type="button"
        onClick={() => handleChange("paginated")}
        className={`rounded-md px-3 py-1 text-xs font-medium transition ${
          value === "paginated" ? "bg-hookers_green text-anti_flash_white" : "text-rich_black/70 hover:text-rich_black"
        }`}
      >
        Paginated
      </button>
      <button
        type="button"
        onClick={() => handleChange("infinite")}
        className={`rounded-md px-3 py-1 text-xs font-medium transition ${
          value === "infinite" ? "bg-hookers_green text-anti_flash_white" : "text-rich_black/70 hover:text-rich_black"
        }`}
      >
        Infinite
      </button>
    </div>
  );
}
