import { createContext, useContext, useState, ReactNode, createElement } from "react";

interface CompareContextType {
  selectedIds: string[];
  toggle: (id: string) => void;
  clear: () => void;
}

const CompareContext = createContext<CompareContextType | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 2) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const clear = () => setSelectedIds([]);

  return createElement(CompareContext.Provider, { value: { selectedIds, toggle, clear } }, children);
}

export function useCompareStore() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompareStore must be used within CompareProvider");
  return ctx;
}
