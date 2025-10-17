"use client";
import { useCompareStore } from "@/lib/compare-store";
import Button from "./ui/button";

export default function CompareButton({ onCompare }: { onCompare: () => void }) {
  const { selectedIds } = useCompareStore();

  if (selectedIds.length !== 2) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button type="button" onClick={onCompare}>
        Compare ({selectedIds.length})
      </Button>
    </div>
  );
}
