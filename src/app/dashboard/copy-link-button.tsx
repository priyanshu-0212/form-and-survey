"use client";

import { useMemo, useState } from "react";

import { absoluteUrl } from "@/lib/urls";

export function CopyLinkButton({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  const url = useMemo(() => absoluteUrl(href), [href]);
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  return (
    <button
      type="button"
      className={[
        "inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-xs font-medium text-[var(--ff-fg)] transition hover:bg-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setStatus("copied");
          setTimeout(() => setStatus("idle"), 1200);
        } catch {
          setStatus("error");
          setTimeout(() => setStatus("idle"), 1200);
        }
      }}
      aria-label="Copy share link"
    >
      {status === "copied"
        ? "Copied"
        : status === "error"
          ? "Copy failed"
          : "Copy link"}
    </button>
  );
}

