"use client";
import clsx from "clsx";
import { forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(
        "w-full rounded-xl border border-rich_black/10 bg-anti_flash_white-900 px-3 py-2 text-sm shadow focus:border-hookers_green focus:outline-none focus-visible:ring-2 focus-visible:ring-hookers_green"
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
export default Input;

