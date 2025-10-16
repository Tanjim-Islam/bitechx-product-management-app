"use client";
import { useEffect, useState } from "react";
import Input from "./ui/input";

export default function SearchBar({ onChange }: { onChange: (q: string) => void }) {
  const [q, setQ] = useState("");
  useEffect(() => {
    const t = setTimeout(() => onChange(q), 350);
    return () => clearTimeout(t);
  }, [q, onChange]);
  return <Input aria-label="Search products" placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} />;
}

