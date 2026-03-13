import Link from "next/link";

import { createForm } from "@/app/dashboard/actions";
import { FormRow } from "@/app/dashboard/form-row";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { prisma } from "@/server/db";

export default async function DashboardPage() {
  const forms = await prisma.form.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      updatedAt: true,
      _count: { select: { responses: true, questions: true } },
    },
  });

  return (
    <div className="min-h-screen ff-bg-gradient">
      <header className="border-b border-black/5 bg-white/70 backdrop-blur">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-[var(--ff-accent-1)] via-[var(--ff-accent-2)] to-[var(--ff-accent-3)] shadow-[0_18px_40px_rgba(124,58,237,0.18)]" />
              <div className="text-sm font-semibold tracking-tight">
                FormFlow <span className="ff-gradient-text">AI</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <form action={createForm}>
                <Button type="submit">New form</Button>
              </form>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-10">
        <Container>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-[var(--ff-muted)]">
                Create forms, share links, and review responses.
              </p>
            </div>
          </div>

          {forms.length === 0 ? (
            <Card className="mt-8 p-8 sm:p-10">
              <div className="max-w-xl">
                <div className="text-lg font-semibold tracking-tight">
                  Create your first form
                </div>
                <div className="mt-2 text-sm leading-6 text-[var(--ff-muted)]">
                  Start from a blank template, add questions, and share a link to
                  collect responses. Then generate AI insights with one click.
                </div>
                <div className="mt-6">
                  <form action={createForm}>
                    <Button type="submit" size="lg">
                      Create Your Form
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          ) : (
            <div className="mt-8 grid gap-4">
              {forms.map((form) => (
                <FormRow key={form.id} form={form} />
              ))}
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}

