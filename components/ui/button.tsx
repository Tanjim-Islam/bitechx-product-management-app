"use client";
import clsx from "clsx";
import React from "react";

const base = "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
const variants = {
  primary: "bg-hookers_green text-anti_flash_white hover:opacity-90 focus:ring-hookers_green",
  secondary: "bg-lion text-rich_black hover:opacity-90 focus:ring-lion",
  ghost: "bg-transparent hover:bg-anti_flash_white-800",
  danger: "bg-chestnut text-anti_flash_white hover:opacity-90 focus:ring-chestnut"
};
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants };
export default function Button({ className, variant = "primary", ...props }: Props) {
  return <button className={clsx(base, variants[variant], className)} {...props} />;
}

