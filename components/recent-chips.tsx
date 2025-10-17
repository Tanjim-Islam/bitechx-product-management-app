"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { sanitizeImageUrl } from "@/lib/utils";
import { useRecentProducts } from "@/lib/use-recent-products";
import { useAppDispatch } from "@/lib/hooks";
import { productApi } from "@/features/products/product-api";


export default function RecentChips() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, clear, remove } = useRecentProducts();

  if (!items.length) return null;

  const handleClear = () => {
    clear();
    toast.info("Recently viewed cleared");
  };

  const handleClick = async (slug: string) => {
    const subscription = dispatch(
      productApi.endpoints.getBySlug.initiate(slug, { forceRefetch: true, subscribe: false })
    );
    try {
      await subscription.unwrap();
      router.push(`/products/${slug}`);
    } catch {
      remove(slug);
      toast.error("That product is no longer available");
    } finally {
      subscription.unsubscribe();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-rich_black/70">Recently viewed</p>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-hookers_green underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hookers_green"
          aria-label="Clear recently viewed"
        >
          Clear
        </button>
      </div>
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleClick(item.slug)}
            className="group flex min-w-[160px] snap-start items-center gap-2 rounded-2xl bg-anti_flash_white-900 px-3 py-2 shadow transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hookers_green md:min-w-0"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-anti_flash_white-800">
              <Image
                fill
                alt={item.name}
                src={sanitizeImageUrl(item.image ?? undefined)}
                className="object-cover transition group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="flex flex-1 flex-col text-left">
              <span className="line-clamp-1 text-sm font-semibold text-rich_black">{item.name}</span>
              {item.categoryName && (
                <span className="mt-0.5">
                  <Badge>{item.categoryName}</Badge>
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
