"use client";
import { useEffect, useState } from "react";
import Select from "./ui/select";

const STORAGE_KEY = "btx_page_size";
const SIZES = [12, 24, 48];

export default function PageSizeSelector({ value, onChange }: { value: number; onChange: (size: number) => void }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (SIZES.includes(parsed)) {
        onChange(parsed);
      }
    }
    setHydrated(true);
  }, [onChange]);

  const handleChange = (size: number) => {
    localStorage.setItem(STORAGE_KEY, String(size));
    onChange(size);
  };

  if (!hydrated) return null;

  return (
    <div className="relative">
      <Select 
        aria-label="Page size" 
        value={String(value)} 
        onChange={(e) => handleChange(parseInt(e.target.value, 10))}
        className="w-auto min-w-[120px]"
      >
        {SIZES.map((s) => (
          <option key={s} value={s}>{s} per page</option>
        ))}
      </Select>
    </div>
  );
}
