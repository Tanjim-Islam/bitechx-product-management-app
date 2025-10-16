"use client";
import AuthGuard from "@/features/auth/auth-guard";
import ProductForm, { PT } from "@/features/products/product-form";
import { useCreateProductMutation } from "@/features/products/product-api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CreatePage() {
  return (
    <AuthGuard>
      <Card>
        <CardHeader title="Create product" />
        <CardContent>
          <CreateInner />
        </CardContent>
      </Card>
    </AuthGuard>
  );
}
function CreateInner() {
  const [create] = useCreateProductMutation();
  const r = useRouter();
  const onSubmit = async (v: PT) => {
    try {
      const res = await create(v).unwrap();
      toast.success("Created");
      r.replace(`/products/${res.slug}`);
    } catch (e: any) {
      toast.error(e?.message || "Create failed");
    }
  };
  return <ProductForm onSubmit={onSubmit} />;
}
