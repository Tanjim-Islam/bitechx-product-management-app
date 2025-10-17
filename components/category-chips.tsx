"use client";
import { useGetCategoriesQuery } from "@/features/categories/category-api";
import Select from "./ui/select";

export default function CategoryChips({ value, onChange }: { value?: string; onChange: (id?: string) => void }) {
  const { data } = useGetCategoriesQuery({ limit: 10 });

  if (!data || data.length === 0) return null;

  return (
    <>
      <Select
        aria-label="Category filter"
        value={value || ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="md:hidden"
      >
        <option value="">All Categories</option>
        {data.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </Select>
      <div className="hidden md:flex flex-wrap gap-2 pb-2">
      <button
        type="button"
        onClick={() => onChange(undefined)}
        className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
          !value
            ? "bg-hookers_green text-anti_flash_white"
            : "bg-anti_flash_white-900 text-rich_black hover:bg-anti_flash_white-800"
        }`}
      >
        All
      </button>
      {data.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(value === c.id ? undefined : c.id)}
          className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            value === c.id
              ? "bg-hookers_green text-anti_flash_white"
              : "bg-anti_flash_white-900 text-rich_black hover:bg-anti_flash_white-800"
          }`}
        >
          {c.name}
        </button>
      ))}
      </div>
    </>
  );
}
