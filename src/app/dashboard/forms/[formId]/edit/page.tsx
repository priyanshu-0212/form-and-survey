import Link from "next/link";
import { notFound } from "next/navigation";

import { Builder } from "@/app/dashboard/forms/[formId]/edit/builder";
import { MetaForm } from "@/app/dashboard/forms/[formId]/edit/meta-form";
import { CopyLinkButton } from "@/app/dashboard/copy-link-button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { prisma } from "@/server/db";

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;

  const form = await prisma.form.findUnique({
    where: { id: formId },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      _count: { select: { questions: true, responses: true } },
      questions: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          type: true,
          title: true,
          description: true,
          required: true,
          order: true,
          optionsJson: true,
        },
      },
    },
  });

  if (!form) return notFound();

  return (
    <div className="min-h-screen ff-bg-gradient">
      <header className="border-b border-black/5 bg-white/70 backdrop-blur">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="text-sm font-medium">
              ← Back
            </Link>
            <div className="flex items-center gap-2">
              <CopyLinkButton href={`/f/${form.slug}`} />
              <Link
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium transition hover:bg-white"
                href={`/f/${form.slug}`}
              >
                Open public form
              </Link>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-10">
        <Container>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Form Builder
              </h1>
              <p className="mt-1 text-sm text-[var(--ff-muted)]">
                {form._count.questions} questions · {form._count.responses}{" "}
                responses
              </p>
            </div>
            <div className="text-sm text-[var(--ff-muted)]">
              Build, preview, and share instantly.
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <Card className="p-6">
              <div className="text-sm font-semibold tracking-tight">
                Form details
              </div>
              <div className="mt-4">
                <MetaForm
                  formId={form.id}
                  initial={{ title: form.title, description: form.description }}
                />
              </div>
            </Card>

            <Card className="p-6">
              <Builder
                formId={form.id}
                initialQuestions={form.questions as never}
              />
            </Card>
          </div>
        </Container>
      </main>
    </div>
  );
}

