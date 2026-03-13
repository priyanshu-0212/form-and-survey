import Link from "next/link";
import { ComponentProps, ReactNode } from "react";

type CommonProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(124,58,237,0.18)] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<NonNullable<CommonProps["variant"]>, string> = {
  primary:
    "text-white shadow-[0_18px_45px_rgba(124,58,237,0.18)] bg-gradient-to-r from-[var(--ff-accent-1)] via-[var(--ff-accent-2)] to-[var(--ff-accent-3)] hover:brightness-110 active:brightness-95",
  secondary:
    "border border-[var(--ff-border)] bg-white/70 text-[var(--ff-fg)] hover:bg-white shadow-[0_12px_30px_rgba(10,14,28,0.08)]",
  ghost: "text-[var(--ff-fg)] hover:bg-black/5",
};

const sizes: Record<NonNullable<CommonProps["size"]>, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

type ButtonProps = CommonProps & ComponentProps<"button">;
export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cx(base, variants[variant], sizes[size], className)}
    />
  );
}

type ButtonLinkProps = CommonProps &
  Omit<ComponentProps<typeof Link>, "className"> & { href: string };
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={cx(base, variants[variant], sizes[size], className)}
    />
  );
}

