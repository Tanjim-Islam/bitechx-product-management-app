"use client";
import * as React from "react";
export default function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rich_black/40">
      <div className="w-full max-w-md rounded-2xl bg-anti_flash_white-900 p-6 shadow">
        {children}
        <div className="mt-4 text-right">
          <button className="text-sm text-rich_black/60 hover:text-rich_black" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

