"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/features/api/auth-api";

const S = z.object({ email: z.string().email("Enter a valid email") });
type T = z.infer<typeof S>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<T>({ resolver: zodResolver(S) });
  const r = useRouter();
  const [login] = useLoginMutation();

  const onSubmit = async (v: T) => {
    try {
      const data = await login({ email: v.email }).unwrap();
      toast.success("Logged in");
      r.replace("/products");
    } catch (e: any) {
      const message = e?.data?.message || e?.message || "Login error";
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl bg-anti_flash_white-900 p-6 shadow">
      <h1 className="mb-4 text-2xl font-semibold">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm">Email</label>
          <Input id="email" aria-label="Email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-chestnut">{errors.email.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Sign in"}</Button>
      </form>
      <p className="mt-3 text-xs text-rich_black/60">Auth calls POST /auth and stores JWT. All subsequent requests include Authorization: Bearer token.</p>
    </div>
  );
}
