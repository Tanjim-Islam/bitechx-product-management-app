"use client";
import AuthGuard from "@/features/auth/auth-guard";
import { useDeleteProductMutation, useGetBySlugQuery } from "@/features/products/product-api";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/button";
import ConfirmDelete from "@/components/confirm-delete";
import { toast } from "sonner";
import { sanitizeImageUrl } from "@/lib/utils";
import { useEffect } from "react";
import { addRecentProduct } from "@/lib/recent-products";

export default function DetailsPage() {
  return (
    <AuthGuard>
      <DetailsInner />
    </AuthGuard>
  );
}

function DetailsInner() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useGetBySlugQuery(slug);
  const [del] = useDeleteProductMutation();
  const r = useRouter();

  useEffect(() => {
    if (!data) return;
    addRecentProduct({
      id: data.id,
      name: data.name,
      slug: data.slug,
      image: sanitizeImageUrl(data.images?.[0]),
      categoryName: data.category?.name,
      viewedAtISO: new Date().toISOString()
    });
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p className="text-chestnut">Failed to load product.</p>;
  const p = data;

  const handleDelete = async () => {
    try {
      await del({ id: p.id }).unwrap();
      toast.success("Deleted");
      r.replace("/products");
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-anti_flash_white-900 shadow">
          <Image src={sanitizeImageUrl(p.images?.[0])} alt={p.name} fill className="object-cover" />
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{p.name}</h1>
        <p className="mt-2 text-rich_black/70">{p.description}</p>
        <div className="mt-4 text-lg font-semibold">$ {p.price}</div>
        <div className="mt-2 text-sm text-rich_black/60">Category: {p.category?.name}</div>
        <div className="mt-6 flex gap-2">
          <Link href={`/products/${p.slug}/edit`}><Button>Edit</Button></Link>
          <ConfirmDelete onConfirm={handleDelete} />
        </div>
      </div>
    </div>
  );
}
