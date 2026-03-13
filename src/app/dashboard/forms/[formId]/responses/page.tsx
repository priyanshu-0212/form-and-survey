import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { prisma } from "@/server/db";

export default async function ResponsesPage({
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
      slug: true,
      questions: { orderBy: { order: "asc" }, select: { id: true, title: true } },
      responses: {
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          createdAt: true,
          answers: { select: { questionId: true, valueJson: true } },
        },
      },
      _count: { select: { responses: true } },
    },
  });

  if (!form) return notFound();

  const columns = form.questions;

  return (
    <div className="min-h-screen ff-bg-gradient">
      <header className="border-b border-black/5 bg-white/70 backdrop-blur">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href={`/dashboard/forms/${formId}/edit`} className="text-sm font-medium">
              ← Back to builder
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium transition hover:bg-white"
              href={`/f/${form.slug}`}
            >
              Open public form
            </Link>
          </div>
        </Container>
      </header>

      <main className="py-10">
        <Container>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Responses
              </h1>
              <p className="mt-1 text-sm text-[var(--ff-muted)]">
                {form.title} · {form._count.responses} total
              </p>
            </div>
          </div>

          <Card className="mt-8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full text-left text-sm">
                <thead className="bg-white/70">
                  <tr className="border-b border-black/5">
                    <th className="px-4 py-3 text-xs font-semibold text-[var(--ff-muted)]">
                      Submitted
                    </th>
                    {columns.map((q) => (
                      <th
                        key={q.id}
                        className="px-4 py-3 text-xs font-semibold text-[var(--ff-muted)]"
                      >
                        {q.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {form.responses.length === 0 ? (
                    <tr>
                      <td
                        colSpan={1 + columns.length}
                        className="px-4 py-10 text-center text-[var(--ff-muted)]"
                      >
                        No responses yet.
                      </td>
                    </tr>
                  ) : (
                    form.responses.map((r) => {
                      const map = new Map(
                        r.answers.map((a) => [a.questionId, a.valueJson] as const),
                      );
                      return (
                        <tr key={r.id} className="border-b border-black/5">
                          <td className="px-4 py-4 text-[var(--ff-muted)]">
                            {new Date(r.createdAt).toLocaleString()}
                          </td>
                          {columns.map((q) => (
                            <td key={q.id} className="px-4 py-4">
                              <span className="text-[var(--ff-fg)]">
                                {formatCell(map.get(q.id))}
                              </span>
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </Container>
      </main>
    </div>
  );
}

function formatCell(v: unknown) {
  if (v == null) return "—";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

