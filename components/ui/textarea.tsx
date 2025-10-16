"use client";
import clsx from "clsx";
export default function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "w-full rounded-xl border border-rich_black/10 bg-anti_flash_white-900 px-3 py-2 text-sm shadow-soft focus:border-hookers_green focus:outline-none focus-visible:ring-2 focus-visible:ring-hookers_green"
      )}
      {...props}
    />
  );
}

