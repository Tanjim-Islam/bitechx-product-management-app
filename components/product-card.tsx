"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Badge from "./ui/badge";
import { Product } from "@/types";
import { sanitizeImageUrl } from "@/lib/utils";

export default function ProductCard({ p }: { p: Product }) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const prefetchedRef = useRef(false);

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
      className="group rounded-2xl bg-anti_flash_white-900 p-3 shadow transition hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
        <Image src={sanitizeImageUrl(p.images?.[0])} alt={p.name} fill className="object-cover transition group-hover:scale-105" />
      </div>
      <div className="mt-3 flex items-start justify-between">
        <div>
          <Link href={`/products/${p.slug}`} className="line-clamp-1 text-sm font-semibold hover:underline">{p.name}</Link>
          <div className="mt-1 text-xs text-rich_black/60">$ {p.price}</div>
        </div>
        <Badge>{p.category?.name}</Badge>
      </div>
    </div>
  );
}
