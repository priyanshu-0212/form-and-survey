import Link from "next/link";

import { CopyLinkButton } from "@/app/dashboard/copy-link-button";
import { DeleteFormButton } from "@/app/dashboard/delete-form-button";
import { Card } from "@/components/ui/card";

export function FormRow({
  form,
}: {
  form: {
    id: string;
    title: string;
    description: string | null;
    slug: string;
    updatedAt: Date;
    _count: { responses: number; questions: number };
  };
}) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold tracking-tight">{form.title}</div>
          {form.description ? (
            <div className="mt-1 text-sm text-[var(--ff-muted)]">
              {form.description}
            </div>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--ff-muted)]">
            <span className="rounded-full border border-black/5 bg-white/70 px-3 py-1">
              {form._count.questions} questions
            </span>
            <span className="rounded-full border border-black/5 bg-white/70 px-3 py-1">
              {form._count.responses} responses
            </span>
            <CopyLinkButton href={`/f/${form.slug}`} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium transition hover:bg-white"
            href={`/dashboard/forms/${form.id}/edit`}
          >
            Edit
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium transition hover:bg-white"
            href={`/dashboard/forms/${form.id}/responses`}
          >
            Responses
          </Link>
          <DeleteFormButton formId={form.id} />
        </div>
      </div>
    </Card>
  );
}

