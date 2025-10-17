import { api } from "@/features/api/api";
import type { Product } from "@/types";

type ListArgs = { offset?: number; limit?: number; categoryId?: string };
type CreateBody = { name: string; description: string; images: string[]; price: number; categoryId: string };
type UpdateArgs = { id: string; slug: string; patch: Partial<CreateBody> & { name?: string; description?: string } };

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
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const tempId = `temp-${Date.now()}`;
        const placeholder: Product = {
          id: tempId,
          name: body.name,
          description: body.description,
          images: body.images,
          price: body.price,
          slug: `temp-slug-${Date.now()}`,
          categoryId: body.categoryId,
          category: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const patchers: Array<() => void> = [];
        const commonArgs: Array<ListArgs | void> = [undefined, { offset: 0, limit: 12 }];
        
        for (const args of commonArgs) {
          const p = dispatch(
            productApi.util.updateQueryData("listProducts", args as any, (draft) => {
              if (Array.isArray(draft)) {
                draft.unshift(placeholder);
              }
            })
          );
          patchers.push(p.undo);
        }
        
        try {
          const result = await queryFulfilled;
          for (const args of commonArgs) {
            dispatch(
              productApi.util.updateQueryData("listProducts", args as any, (draft) => {
                if (Array.isArray(draft)) {
                  const idx = draft.findIndex((x) => x.id === tempId);
                  if (idx !== -1) {
                    draft[idx] = result.data;
                  }
                }
              })
            );
          }
        } catch {
          patchers.forEach((u) => u());
        }
      },
      invalidatesTags: ["Products", "Categories"]
    }),
    updateProduct: b.mutation<Product, UpdateArgs>({
      query: ({ id, patch }) => ({ url: `/products/${id}`, method: "PUT", body: patch }),
      async onQueryStarted({ id, slug, patch }, { dispatch, queryFulfilled }) {
        const patchers: Array<() => void> = [];
        
        const listPatches = dispatch(
          productApi.util.updateQueryData("listProducts", undefined as any, (draft) => {
            if (Array.isArray(draft)) {
              const idx = draft.findIndex((x) => x.id === id);
              if (idx !== -1) {
                draft[idx] = { ...draft[idx], ...patch };
              }
            }
          })
        );
        patchers.push(listPatches.undo);
        
        const detailPatch = dispatch(
          productApi.util.updateQueryData("getBySlug", slug, (draft) => {
            Object.assign(draft, patch);
          })
        );
        patchers.push(detailPatch.undo);
        
        try {
          const result = await queryFulfilled;
          if (result.data.slug !== slug) {
            dispatch(
              productApi.util.updateQueryData("getBySlug", result.data.slug, () => result.data)
            );
          }
        } catch {
          patchers.forEach((u) => u());
        }
      },
      invalidatesTags: (result, _e, arg) => {
        const tags: any[] = [{ type: "Product", id: arg.slug }, "Products", "Categories"];
        if (result?.slug && result.slug !== arg.slug) tags.push({ type: "Product", id: result.slug });
        return tags;
      }
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
