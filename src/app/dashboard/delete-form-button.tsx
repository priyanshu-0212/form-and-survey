"use client";

import { useTransition } from "react";

import { deleteForm } from "@/app/dashboard/actions";

export function DeleteFormButton({ formId }: { formId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full border border-red-500/25 bg-white/70 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
      onClick={() => startTransition(async () => deleteForm(formId))}
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

