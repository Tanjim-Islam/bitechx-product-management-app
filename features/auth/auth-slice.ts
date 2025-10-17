import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "@/features/api/auth-api";

type AuthState = { email: string | null; token: string | null };
const initial: AuthState = { email: null, token: null };

const persisted = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("btx_auth") || "null") : null;

const slice = createSlice({
  name: "auth",
  initialState: persisted ?? initial,
  reducers: {
    setAuth: (s, a: PayloadAction<{ email: string; token: string }>) => {
      s.email = a.payload.email;
      s.token = a.payload.token;
      if (typeof window !== "undefined") localStorage.setItem("btx_auth", JSON.stringify(s));
    },
    logout: (s) => {
      s.email = null;
      s.token = null;
      if (typeof window !== "undefined") localStorage.removeItem("btx_auth");
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (s, { payload, meta }) => {
      const email = meta.arg.originalArgs.email;
      s.email = email;
      s.token = payload.token;
      if (typeof window !== "undefined") localStorage.setItem("btx_auth", JSON.stringify(s));
    });
  }
});
export const { setAuth, logout } = slice.actions;
export default slice.reducer;
