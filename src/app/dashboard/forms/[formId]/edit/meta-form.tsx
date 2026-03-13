"use client";

import { useTransition } from "react";

import { updateFormMeta } from "@/app/dashboard/forms/[formId]/edit/actions";
import { Button } from "@/components/ui/button";

export function MetaForm({
  formId,
  initial,
}: {
  formId: string;
  initial: { title: string; description: string | null };
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const title = String(fd.get("title") || "").trim();
        const description = String(fd.get("description") || "").trim();
        startTransition(async () => {
          await updateFormMeta(formId, {
            title: title || "Untitled form",
            description,
          });
        });
      }}
    >
      <div>
        <label className="text-xs font-medium text-[var(--ff-muted)]">
          Title
        </label>
        <input
          name="title"
          defaultValue={initial.title}
          className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white/80 px-4 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-[rgba(124,58,237,0.18)]"
          placeholder="Form title"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-[var(--ff-muted)]">
          Description
        </label>
        <textarea
          name="description"
          defaultValue={initial.description ?? ""}
          className="mt-1 min-h-24 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-[rgba(124,58,237,0.18)]"
          placeholder="Optional description"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}

