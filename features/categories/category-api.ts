import { api } from "@/features/api/api";
import type { Category } from "@/types";

export const categoryApi = api.injectEndpoints({
  endpoints: (b) => ({
    getCategories: b.query<Category[], { offset?: number; limit?: number } | void>({
      query: (params) => {
        const qs = params ? `?offset=${params.offset ?? 0}&limit=${params.limit ?? 50}` : "";
        return { url: `/categories${qs}` };
      },
      providesTags: ["Categories"]
    }),
    searchCategories: b.query<Category[], string>({
      query: (q) => ({ url: `/categories/search?searchedText=${encodeURIComponent(q)}` }),
      providesTags: ["Categories"]
    })
  })
});
export const { useGetCategoriesQuery, useSearchCategoriesQuery } = categoryApi;
