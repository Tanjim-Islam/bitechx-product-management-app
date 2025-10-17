import { useCallback, useEffect, useState } from "react";
import { RecentProduct, addRecentProduct, clearRecentProducts, getRecentProducts, removeRecentProduct, subscribeToRecentUpdates } from "./recent-products";

export function useRecentProducts() {
  const [items, setItems] = useState<RecentProduct[]>([]);

  useEffect(() => {
    setItems(getRecentProducts());
    const unsubscribe = subscribeToRecentUpdates(() => {
      setItems(getRecentProducts());
    });
    return unsubscribe;
  }, []);

  const clear = useCallback(() => {
    clearRecentProducts();
    setItems([]);
  }, []);

  const remove = useCallback((slug: string) => {
    removeRecentProduct(slug);
    setItems((prev) => prev.filter((item) => item.slug !== slug));
  }, []);

  const push = useCallback((item: RecentProduct) => {
    addRecentProduct(item);
  }, []);

  return { items, clear, remove, push };
}
