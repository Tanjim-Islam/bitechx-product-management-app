"use client";
import { useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((s) => s.auth.token);
  const r = useRouter();
  useEffect(() => { if (!token) r.replace("/login"); }, [token, r]);
  if (!token) return null;
  return <>{children}</>;
}
