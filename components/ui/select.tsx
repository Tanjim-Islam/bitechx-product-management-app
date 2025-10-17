"use client";
import clsx from "clsx";
export default function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx(
        "w-full rounded-xl border border-rich_black/10 bg-anti_flash_white-900 px-3 py-2 text-sm shadow focus:border-hookers_green focus:outline-none focus-visible:ring-2 focus-visible:ring-hookers_green appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%3E%3cpath%20fill%3D%22%23333%22%20d%3D%22M6%208L0%200h12z%22%2F%3E%3c%2Fsvg%3E')] bg-[center_right_0.75rem] bg-no-repeat pr-8",
        className
      )}
      {...props}
    />
  );
}

