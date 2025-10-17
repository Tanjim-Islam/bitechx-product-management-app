"use client";
import { useEffect, useState } from "react";
import Button from "./ui/button";

const STORAGE_KEY = "btx_hint_hotkeys_dismissed";

export default function HotkeyHint({ onShowHelp }: { onShowHelp: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-40 w-80 rounded-2xl bg-anti_flash_white-900 p-4 shadow-lg"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-sm font-semibold text-rich_black">Keyboard shortcuts available</p>
          <p className="mt-1 text-xs text-rich_black/70">
            Press <kbd className="rounded bg-anti_flash_white-800 px-1 py-0.5 text-xs">/</kbd> to search,{" "}
            <kbd className="rounded bg-anti_flash_white-800 px-1 py-0.5 text-xs">N</kbd> to create, and more.
          </p>
          <button
            type="button"
            onClick={onShowHelp}
            className="mt-2 text-xs text-hookers_green hover:underline"
          >
            View all shortcuts
          </button>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-rich_black/60 hover:text-rich_black"
          aria-label="Dismiss hint"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
