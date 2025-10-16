"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { useGetCategoriesQuery } from "@/features/categories/category-api";

export const PS = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  images: z.array(z.string().url("Must be a URL")).min(1, "At least one image URL"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
  categoryId: z.string().min(1, "Category is required")
});
export type PT = z.infer<typeof PS>;

export default function ProductForm({ initial, onSubmit }: { initial?: Partial<PT>; onSubmit: (v: PT) => Promise<void> }) {
  const { data: cats } = useGetCategoriesQuery();
  const f = useForm<any>({
    resolver: zodResolver(PS),
    defaultValues: initial ?? { name: "", description: "", images: [""], price: 0, categoryId: "" }
  });
  const { fields, append, remove } = useFieldArray({ control: f.control, name: "images" });
  return (
    <form
      onSubmit={f.handleSubmit(async (v) => {
        await onSubmit({ ...v, price: Number(v.price) });
      })}
      className="space-y-4"
    >
      <div>
        <label htmlFor="name" className="mb-1 block text-sm">Name</label>
        <Input id="name" aria-label="Name" {...f.register("name")} />
        {f.formState.errors.name && <p id="name_err" className="mt-1 text-xs text-chestnut">{String((f.formState.errors as any).name?.message)}</p>}
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm">Description</label>
        <Textarea id="description" aria-label="Description" rows={4} {...f.register("description")} />
        {f.formState.errors.description && <p id="desc_err" className="mt-1 text-xs text-chestnut">{String((f.formState.errors as any).description?.message)}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm">Images</label>
        <div className="space-y-2">
          {fields.map((fi, i) => (
            <div key={fi.id} className="flex gap-2">
              <Input aria-label={`Image URL ${i + 1}`} {...f.register(`images.${i}` as const)} placeholder="https://..." />
              <Button type="button" variant="ghost" onClick={() => remove(i)}>Remove</Button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={() => append("")}>Add image</Button>
        </div>
        {f.formState.errors.images && <p id="images_err" className="mt-1 text-xs text-chestnut">{String((f.formState.errors as any).images?.message)}</p>}
      </div>
      <div>
        <label htmlFor="price" className="mb-1 block text-sm">Price</label>
        <Input id="price" aria-label="Price" type="number" step="0.01" {...f.register("price", { valueAsNumber: true })} />
        {f.formState.errors.price && <p id="price_err" className="mt-1 text-xs text-chestnut">{String((f.formState.errors as any).price?.message)}</p>}
      </div>
      <div>
        <label htmlFor="categoryId" className="mb-1 block text-sm">Category</label>
        <Select id="categoryId" aria-label="Category" {...f.register("categoryId")}>
          <option value="">Select a category</option>
          {cats?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
        {f.formState.errors.categoryId && <p id="cat_err" className="mt-1 text-xs text-chestnut">{String((f.formState.errors as any).categoryId?.message)}</p>}
      </div>
      <Button type="submit" disabled={f.formState.isSubmitting}>{f.formState.isSubmitting ? "Saving..." : "Save"}</Button>
    </form>
  );
}
