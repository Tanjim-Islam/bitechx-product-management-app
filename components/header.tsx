"use client";
import Link from "next/link";
import { logout } from "@/features/auth/auth-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Button from "./ui/button";
import { useEffect, useState } from "react";

export default function Header() {
  const d = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return (
    <header className="sticky top-0 z-40 border-b border-rich_black/10 bg-anti_flash_white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/products" className="text-xl font-bold text-hookers_green">BiTechX</Link>
        <nav className="flex items-center gap-3">
          {token ? (
            <>
              <Link href="/products" className="text-sm hover:underline">Products</Link>
              <Link href="/products/create" className="text-sm hover:underline">Create</Link>
              <Button variant="ghost" onClick={() => d(logout())}>Logout</Button>
            </>
          ) : (
            <Link href="/login" className="text-sm hover:underline">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
