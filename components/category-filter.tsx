"use client";
import { useGetCategoriesQuery } from "@/features/categories/category-api";
import Select from "./ui/select";

export default function CategoryFilter({ value, onChange }: { value?: string; onChange: (id?: string) => void }) {
  const { data } = useGetCategoriesQuery();
  return (
    <Select aria-label="Category filter" value={value ?? ""} onChange={(e) => onChange(e.target.value || undefined)}>
      <option value="">All categories</option>
      {data?.map((c) => (
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
    </Select>
  );
}
