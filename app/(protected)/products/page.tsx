"use client";
import AuthGuard from "@/features/auth/auth-guard";
import { useEffect, useMemo, useRef, useState } from "react";
import { useListProductsQuery, useSearchProductsQuery } from "@/features/products/product-api";
import SearchBar, { SearchBarRef } from "@/components/search-bar";
import CategoryFilter from "@/components/category-filter";
import Pagination from "@/components/pagination";
import ProductCard from "@/components/product-card";
import RecentChips from "@/components/recent-chips";
import Skeleton from "@/components/ui/skeleton";
import HotkeyHint from "@/components/hotkey-hint";
import HelpModal from "@/components/help-modal";
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

  const listing = useListProductsQuery({ offset, limit: LIMIT, categoryId: cat }, { skip: q.trim().length >= 2 });
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
  }, [q, cat]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex w-full gap-2 sm:w-auto">
          <SearchBar ref={searchBarRef} onChange={setQ} />
          <CategoryFilter value={cat} onChange={setCat} />
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
            {data.map((p) => (
              <ProductCard key={p.id} p={p} />)
            )}
          </div>
          {q.trim().length < 2 && <Pagination offset={offset} limit={LIMIT} onPage={(o) => setOffset(o)} />}
        </>
      )}

      {!loading && data && data.length === 0 && <p className="text-sm text-rich_black/60">No products found.</p>}
      
      <HotkeyHint onShowHelp={() => setHelpOpen(true)} />
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
