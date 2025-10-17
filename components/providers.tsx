"use client";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { Toaster } from "sonner";
import { CompareProvider } from "@/lib/compare-store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CompareProvider>
        {children}
        <Toaster position="top-right" />
      </CompareProvider>
    </Provider>
  );
}

