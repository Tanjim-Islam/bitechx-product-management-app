import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = { email: string | null; token: string | null };
const initial: AuthState = { email: null, token: null };

const persisted = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("btx_auth") || "null") : null;

const slice = createSlice({
  name: "auth",
  initialState: persisted ?? initial,
  reducers: {
    setAuth: (s, a: PayloadAction<{ email: string; token: string }>) => {
      s.email = a.payload.email; s.token = a.payload.token;
      if (typeof window !== "undefined") localStorage.setItem("btx_auth", JSON.stringify(s));
    },
    logout: (s) => {
      s.email = null; s.token = null;
      if (typeof window !== "undefined") localStorage.removeItem("btx_auth");
    }
  }
});
export const { setAuth, logout } = slice.actions;
export default slice.reducer;
