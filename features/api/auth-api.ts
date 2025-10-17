import { api } from "@/features/api/api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string }, { email: string }>({
      query: (body) => ({
        url: "/auth",
        method: "POST",
        body
      })
    })
  })
});

export const { useLoginMutation } = authApi;
