import { api } from "@/features/api/api";
import type { Product } from "@/types";

type ListArgs = { offset?: number; limit?: number; categoryId?: string };
type CreateBody = { name: string; description: string; images: string[]; price: number; categoryId: string };

export const productApi = api.injectEndpoints({
  endpoints: (b) => ({
    listProducts: b.query<Product[], ListArgs | void>({
      query: (p) => {
        const qs = new URLSearchParams();
        if (p?.offset !== undefined) qs.set("offset", String(p.offset));
        if (p?.limit !== undefined) qs.set("limit", String(p.limit));
        if (p?.categoryId) qs.set("categoryId", p.categoryId);
        const s = qs.toString();
        return { url: `/products${s ? `?${s}` : ""}` };
      },
      providesTags: (res) =>
        res ? [...res.map((p) => ({ type: "Product" as const, id: p.id })), { type: "Products" as const }] : [{ type: "Products" as const }]
    }),
    searchProducts: b.query<Product[], { q: string}>({
      query: ({ q }) => ({ url: `/products/search?searchedText=${encodeURIComponent(q)}` }),
      providesTags: [{ type: "Products" }]
    }),
    getBySlug: b.query<Product, string>({ query: (slug) => ({ url: `/products/${slug}` }), providesTags: (_r, _e, slug) => [{ type: "Product", id: slug }] }),
    createProduct: b.mutation<Product, CreateBody>({
      query: (body) => ({ url: `/products`, method: "POST", body }),
      invalidatesTags: ["Products", "Categories"]
    }),
    updateProduct: b.mutation<Product, { id: string; patch: Partial<CreateBody> & { name?: string; description?: string } }>({
      query: ({ id, patch }) => ({ url: `/products/${id}`, method: "PUT", body: patch }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Product", id: arg.id }, "Products", "Categories"]
    }),
    deleteProduct: b.mutation<{ id: string }, { id: string}>({
      query: ({ id }) => ({ url: `/products/${id}`, method: "DELETE" }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        // Optimistically remove from common caches
        const patchers: Array<() => void> = [];
        const commonArgs: Array<ListArgs | void> = [undefined, { offset: 0, limit: 12 }, { offset: 0, limit: 50 }];
        for (const args of commonArgs) {
          const p = dispatch(
            productApi.util.updateQueryData("listProducts", args as any, (draft) => {
              if (Array.isArray(draft)) {
                const idx = draft.findIndex((x) => x.id === id);
                if (idx !== -1) draft.splice(idx, 1);
              }
            })
          );
          patchers.push(p.undo);
        }
        try {
          await queryFulfilled;
        } catch {
          patchers.forEach((u) => u());
        }
      },
      invalidatesTags: (_r, _e, arg) => [{ type: "Product", id: arg.id }, "Products", "Categories"]
    })
  })
});
export const {
  useListProductsQuery,
  useSearchProductsQuery,
  useGetBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} = productApi;
