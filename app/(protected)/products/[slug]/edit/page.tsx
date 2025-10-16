"use client";
import AuthGuard from "@/features/auth/auth-guard";
import { useGetBySlugQuery, useUpdateProductMutation } from "@/features/products/product-api";
import { useParams, useRouter } from "next/navigation";
import ProductForm, { PT } from "@/features/products/product-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

export default function EditPage() {
  return (
    <AuthGuard>
      <EditInner />
    </AuthGuard>
  );
}

function EditInner() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useGetBySlugQuery(slug);
  const [upd] = useUpdateProductMutation();
  const r = useRouter();

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p className="text-chestnut">Failed to load product.</p>;
  const p = data;

  const init = { name: p.name, description: p.description, images: p.images, price: p.price, categoryId: p.category.id };

  const onSubmit = async (v: PT) => {
    try {
      await upd({ id: p.id, patch: { name: v.name, description: v.description, images: v.images, price: v.price, categoryId: v.categoryId } }).unwrap();
      toast.success("Updated");
      r.replace(`/products/${slug}`);
    } catch (e: any) {
      toast.error(e?.message || "Update failed");
    }
  };

  return (
    <Card>
      <CardHeader title="Edit product" />
      <CardContent><ProductForm initial={init} onSubmit={onSubmit} /></CardContent>
    </Card>
  );
}
