"use client";
import Modal from "./ui/modal";

const shortcuts = [
  { key: "/", description: "Focus search input" },
  { key: "N", description: "Create new product" },
  { key: "J", description: "Next page" },
  { key: "K", description: "Previous page" },
  { key: "Esc", description: "Close modal or blur active element" },
  { key: "Enter", description: "Submit focused form" }
];

export default function HelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
      <div className="mt-4 space-y-2">
        {shortcuts.map((s) => (
          <div key={s.key} className="flex items-center justify-between text-sm">
            <span className="text-rich_black/70">{s.description}</span>
            <kbd className="rounded bg-anti_flash_white-800 px-2 py-1 font-mono text-xs">{s.key}</kbd>
          </div>
        ))}
      </div>
    </Modal>
  );
}
