"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Badge from "./ui/badge";
import { Product } from "@/types";
import { sanitizeImageUrl } from "@/lib/utils";
import { useCompareStore } from "@/lib/compare-store";

export default function ProductCard({ p }: { p: Product }) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const prefetchedRef = useRef(false);
  const { selectedIds, toggle } = useCompareStore();
  const isSelected = selectedIds.includes(p.slug);
  const canSelect = selectedIds.length < 2 || isSelected;

  useEffect(() => {
    prefetchedRef.current = false;
  }, [p.slug]);

  const prefetchDetails = useCallback(() => {
    if (prefetchedRef.current) return;
    if (typeof navigator !== "undefined") {
      if (navigator.onLine === false) return;
      const connection = (navigator as any).connection;
      if (connection?.saveData) return;
    }
    router.prefetch(`/products/${p.slug}`);
    prefetchedRef.current = true;
  }, [p.slug, router]);

  useEffect(() => {
    const node = cardRef.current;
    if (!node || typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
    const prefersCoarsePointer = window.matchMedia?.("(pointer: coarse)").matches;
    if (!prefersCoarsePointer) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          prefetchDetails();
          observer.disconnect();
        }
      });
    }, { rootMargin: "0px 0px 200px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [prefetchDetails]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={prefetchDetails}
      onFocus={prefetchDetails}
      onTouchStart={prefetchDetails}
      className="group relative rounded-2xl bg-anti_flash_white-900 p-3 shadow transition hover:-translate-y-0.5"
    >
      <Link href={`/products/${p.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
          <Image src={sanitizeImageUrl(p.images?.[0])} alt={p.name} fill className="object-cover transition group-hover:scale-105" />
        </div>
        <div className="mt-3 flex items-start justify-between">
          <div>
            <h3 className="line-clamp-1 text-sm font-semibold">{p.name}</h3>
            <div className="mt-1 text-xs text-rich_black/60">$ {p.price}</div>
          </div>
          <Badge>{p.category?.name}</Badge>
        </div>
      </Link>
      {canSelect && (
        <div className="absolute right-5 top-5 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              toggle(p.slug);
            }}
            onClick={(e) => e.stopPropagation()}
            className="h-5 w-5 cursor-pointer rounded border-2 border-anti_flash_white accent-hookers_green"
            aria-label="Compare this product"
          />
        </div>
      )}
    </div>
  );
}
