"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Input from "./ui/input";

export interface SearchBarRef {
  focus: () => void;
}

const SearchBar = forwardRef<SearchBarRef, { onChange: (q: string) => void }>(({ onChange }, ref) => {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus()
  }));

  useEffect(() => {
    const t = setTimeout(() => onChange(q), 350);
    return () => clearTimeout(t);
  }, [q, onChange]);

  return <Input ref={inputRef} aria-label="Search products" placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} />;
});

SearchBar.displayName = "SearchBar";
export default SearchBar;

