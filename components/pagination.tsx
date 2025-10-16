"use client";
import Button from "./ui/button";

export default function Pagination({ offset, limit, total = 50, onPage }: { offset: number; limit: number; total?: number; onPage: (off: number) => void }) {
  const prev = Math.max(0, offset - limit);
  const next = offset + limit;
  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="ghost" onClick={() => onPage(prev)} disabled={offset === 0}>Prev</Button>
      <Button variant="ghost" onClick={() => onPage(next)} disabled={next >= total}>Next</Button>
    </div>
  );
}

