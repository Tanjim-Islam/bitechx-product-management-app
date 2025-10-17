"use client";
import { useGetBySlugQuery } from "@/features/products/product-api";
import { useCompareStore } from "@/lib/compare-store";
import Modal from "./ui/modal";
import Image from "next/image";
import { sanitizeImageUrl } from "@/lib/utils";
import Button from "./ui/button";

export default function CompareModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { selectedIds, clear } = useCompareStore();
  const id1 = selectedIds[0];
  const id2 = selectedIds[1];

  const { data: p1 } = useGetBySlugQuery(id1 || "", { skip: !id1 });
  const { data: p2 } = useGetBySlugQuery(id2 || "", { skip: !id2 });

  if (!open || !p1 || !p2) return null;

  const handleClose = () => {
    clear();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold">Compare Products</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
              <Image src={sanitizeImageUrl(p1.images?.[0])} alt={p1.name} fill className="object-cover" />
            </div>
            <h3 className="font-semibold">{p1.name}</h3>
            <p className="text-sm text-rich_black/70">{p1.description}</p>
            <p className="text-lg font-semibold text-hookers_green">$ {p1.price}</p>
            <p className="text-xs text-rich_black/60">Category: {p1.category?.name}</p>
          </div>
          <div className="space-y-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
              <Image src={sanitizeImageUrl(p2.images?.[0])} alt={p2.name} fill className="object-cover" />
            </div>
            <h3 className="font-semibold">{p2.name}</h3>
            <p className="text-sm text-rich_black/70">{p2.description}</p>
            <p className="text-lg font-semibold text-hookers_green">$ {p2.price}</p>
            <p className="text-xs text-rich_black/60">Category: {p2.category?.name}</p>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={handleClose} variant="secondary">Close &amp; Clear</Button>
        </div>
      </div>
    </Modal>
  );
}
