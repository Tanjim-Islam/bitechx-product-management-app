import "./globals.css";
import Header from "@/components/header";
import Providers from "@/components/providers";

export const metadata = { title: "BiTechX Products", description: "Product Management App" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

