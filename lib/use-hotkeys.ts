import { useEffect } from "react";

type HotkeyHandler = (e: KeyboardEvent) => void;

const isInputElement = (el: Element | null): boolean => {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || el.getAttribute("contenteditable") === "true";
};

export function useHotkeys(keys: Record<string, HotkeyHandler>) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const activeElement = document.activeElement;
      
      if (key === "escape") {
        if (keys.escape) {
          keys.escape(e);
        }
        return;
      }

      if (isInputElement(activeElement)) {
        return;
      }

      const handlerKey = Object.keys(keys).find(k => k.toLowerCase() === key);
      if (handlerKey && keys[handlerKey]) {
        e.preventDefault();
        keys[handlerKey](e);
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [keys]);
}
