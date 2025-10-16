"use client";
import Image from "next/image";
import Link from "next/link";
import Badge from "./ui/badge";
import { Product } from "@/types";
import { sanitizeImageUrl } from "@/lib/utils";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <div className="group rounded-2xl bg-anti_flash_white-900 p-3 shadow-soft transition hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
        {/* <Image src={p.images?.[0] || "https://i.imgur.com/QkIa5tT.jpeg"} alt={p.name} fill className="object-cover transition group-hover:scale-105" /> */}
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
