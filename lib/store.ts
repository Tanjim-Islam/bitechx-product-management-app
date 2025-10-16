import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/features/api/api";
import authReducer from "@/features/auth/auth-slice";

export const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer, auth: authReducer },
  middleware: (gDM) => gDM().concat(api.middleware)
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
