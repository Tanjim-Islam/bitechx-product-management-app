"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((s) => s.auth.token);
  const r = useRouter();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  useEffect(() => { if (!token) r.replace("/login"); }, [token, r]);
  if (!hydrated) return null;
  if (!token) return null;
  return <>{children}</>;
}
