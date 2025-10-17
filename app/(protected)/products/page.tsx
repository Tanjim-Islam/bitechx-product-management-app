"use client";
import AuthGuard from "@/features/auth/auth-guard";
import { useEffect, useMemo, useRef, useState } from "react";
import { useListProductsQuery, useSearchProductsQuery } from "@/features/products/product-api";
import SearchBar, { SearchBarRef } from "@/components/search-bar";
import CategoryChips from "@/components/category-chips";
import Pagination from "@/components/pagination";
import ProductCard from "@/components/product-card";
import RecentChips from "@/components/recent-chips";
import Skeleton from "@/components/ui/skeleton";
import HotkeyHint from "@/components/hotkey-hint";
import PageSizeSelector from "@/components/page-size-selector";
import ScrollModeToggle from "@/components/scroll-mode-toggle";
import Button from "@/components/ui/button";
import HelpModal from "@/components/help-modal";
import CompareButton from "@/components/compare-button";
import CompareModal from "@/components/compare-modal";
import { useHotkeys } from "@/lib/use-hotkeys";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LIMIT = 12;

export default function ProductsPage() {
  return (
    <AuthGuard>
      <ProductsInner />
    </AuthGuard>
  );
}

function ProductsInner() {
  const router = useRouter();
  const searchBarRef = useRef<SearchBarRef>(null);
  const [offset, setOffset] = useState(0);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | undefined>(undefined);
  const [helpOpen, setHelpOpen] = useState(false);
  const [limit, setLimit] = useState(12);
  const [scrollMode, setScrollMode] = useState<"paginated" | "infinite">("paginated");
  const [accumulatedData, setAccumulatedData] = useState<any[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  const listing = useListProductsQuery({ offset, limit, categoryId: cat }, { skip: q.trim().length >= 2 });
  const search = useSearchProductsQuery({ q }, { skip: q.trim().length < 2 });

  useHotkeys({
    "/": () => searchBarRef.current?.focus(),
    "n": () => router.push("/products/create"),
    "j": () => {
      if (q.trim().length < 2 && data && data.length > 0) {
        setOffset((prev) => prev + LIMIT);
      }
    },
    "k": () => {
      if (q.trim().length < 2 && offset > 0) {
        setOffset((prev) => Math.max(0, prev - LIMIT));
      }
    },
    "escape": () => {
      if (helpOpen) {
        setHelpOpen(false);
      } else if (document.activeElement && document.activeElement !== document.body) {
        (document.activeElement as HTMLElement).blur();
      }
    }
  });

  useEffect(() => {
    if (listing.isError) toast.error("Failed to load products");
    if (search.isError) toast.error("Search failed");
  }, [listing.isError, search.isError]);

  const data = useMemo(() => (q.trim().length >= 2 ? search.data : listing.data), [q, search.data, listing.data]);
  const loading = listing.isLoading || search.isLoading;

  useEffect(() => {
    setOffset(0);
    setAccumulatedData([]);
  }, [q, cat, limit]);

  useEffect(() => {
    if (scrollMode === "infinite" && data && data.length > 0) {
      setAccumulatedData((prev) => {
        const existing = new Set(prev.map((p) => p.id));
        const newItems = data.filter((p) => !existing.has(p.id));
        return [...prev, ...newItems];
      });
    }
  }, [data, scrollMode]);

  useEffect(() => {
    if (scrollMode !== "infinite" || !sentinelRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && data && data.length === limit) {
        setOffset((prev) => prev + limit);
      }
    });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [scrollMode, loading, data, limit]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex w-full gap-2 sm:w-auto">
          <SearchBar ref={searchBarRef} onChange={setQ} />
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CategoryChips value={cat} onChange={setCat} />
        <div className="flex items-center gap-2">
          <ScrollModeToggle value={scrollMode} onChange={setScrollMode} />
          <PageSizeSelector value={limit} onChange={setLimit} />
        </div>
      </div>
      <RecentChips />

      {loading && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      )}

      {!loading && data && data.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {(scrollMode === "infinite" ? accumulatedData : data).map((p) => (
              <ProductCard key={p.id} p={p} />)
            )}
          </div>
          {scrollMode === "paginated" && q.trim().length < 2 && <Pagination offset={offset} limit={limit} onPage={(o) => setOffset(o)} />}
          {scrollMode === "infinite" && data.length === limit && (
            <>
              <div ref={sentinelRef} className="h-4" />
              <div className="text-center">
                <Button variant="ghost" onClick={() => setOffset((prev) => prev + limit)}>Load more</Button>
              </div>
            </>
          )}
        </>
      )}

      {!loading && data && data.length === 0 && <p className="text-sm text-rich_black/60">No products found.</p>}
      
      <HotkeyHint onShowHelp={() => setHelpOpen(true)} />
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <CompareButton onCompare={() => setCompareOpen(true)} />
      <CompareModal open={compareOpen} onClose={() => setCompareOpen(false)} />
    </div>
  );
}
