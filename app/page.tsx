"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

export default function HomeRedirectPage() {
  const token = useAppSelector((s) => s.auth.token);
  const r = useRouter();
  useEffect(() => {
    if (token) r.replace("/products");
    else r.replace("/login");
  }, [token, r]);
  return null;
}

