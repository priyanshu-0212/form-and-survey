import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicForm } from "@/app/f/[slug]/form-client";
import { Container } from "@/components/ui/container";
import { prisma } from "@/server/db";

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const form = await prisma.form.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      description: true,
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
            <Link href="/" className="text-sm font-medium">
              FormFlow <span className="ff-gradient-text">AI</span>
            </Link>
            <div className="text-xs text-[var(--ff-muted)]">
              Powered by FormFlow AI
            </div>
          </div>
        </Container>
      </header>

      <main className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-2xl">
            <PublicForm
              formId={form.id}
              formTitle={form.title}
              formDescription={form.description}
              questions={form.questions as never}
            />
            <div className="mt-6 text-center text-xs text-[var(--ff-muted)]">
              Made with FormFlow AI ·{" "}
              <Link className="underline hover:text-[var(--ff-fg)]" href="/dashboard">
                Create your own
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

