"use client";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster position="top-right" />
    </Provider>
  );
}

