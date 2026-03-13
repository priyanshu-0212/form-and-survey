"use client";

import { useMemo, useState, useTransition } from "react";

import { submitResponse } from "@/app/f/[slug]/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type QuestionType =
  | "SHORT_TEXT"
  | "LONG_TEXT"
  | "MULTIPLE_CHOICE"
  | "CHECKBOX"
  | "RATING"
  | "EMAIL";

export type PublicQuestion = {
  id: string;
  type: QuestionType;
  title: string;
  description: string | null;
  required: boolean;
  order: number;
  optionsJson: unknown;
};

export function PublicForm({
  formId,
  formTitle,
  formDescription,
  questions,
}: {
  formId: string;
  formTitle: string;
  formDescription: string | null;
  questions: PublicQuestion[];
}) {
  const ordered = useMemo(
    () => [...questions].sort((a, b) => a.order - b.order),
    [questions],
  );
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [submitted, setSubmitted] = useState<null | string>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const q = ordered[idx];

  if (submitted) {
    return (
      <Card className="p-7 sm:p-9">
        <div className="text-sm font-semibold tracking-tight">Thanks!</div>
        <div className="mt-2 text-sm leading-6 text-[var(--ff-muted)]">
          Your response has been submitted.
        </div>
        <div className="mt-6 rounded-2xl border border-black/10 bg-white/70 p-4 text-xs text-[var(--ff-muted)]">
          Response ID: {submitted}
        </div>
      </Card>
    );
  }

  if (!q) {
    return (
      <Card className="p-7 sm:p-9">
        <div className="text-sm font-semibold tracking-tight">{formTitle}</div>
        {formDescription ? (
          <div className="mt-2 text-sm leading-6 text-[var(--ff-muted)]">
            {formDescription}
          </div>
        ) : null}
        <div className="mt-6 rounded-2xl border border-black/10 bg-white/70 p-4 text-sm text-[var(--ff-muted)]">
          This form has no questions yet.
        </div>
      </Card>
    );
  }

  const progress = `${idx + 1} / ${ordered.length}`;

  const value = answers[q.id];

  return (
    <Card className="p-7 sm:p-9">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-sm font-semibold tracking-tight">{formTitle}</div>
          {formDescription ? (
            <div className="mt-1 text-xs text-[var(--ff-muted)]">
              {formDescription}
            </div>
          ) : null}
        </div>
        <div className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-[var(--ff-muted)]">
          {progress}
        </div>
      </div>

      <div className="mt-7">
        <div className="text-xs font-medium text-[var(--ff-muted)]">
          Question {idx + 1}
          {q.required ? (
            <span className="ml-2 rounded-full border border-black/10 bg-white/70 px-2 py-0.5 text-[10px]">
              Required
            </span>
          ) : null}
        </div>
        <div className="mt-2 text-xl font-semibold tracking-tight">
          {q.title}
        </div>
        {q.description ? (
          <div className="mt-2 text-sm leading-6 text-[var(--ff-muted)]">
            {q.description}
          </div>
        ) : null}

        <div className="mt-6">
          <QuestionInput
            question={q}
            value={value}
            setValue={(next) => {
              setError(null);
              setAnswers((prev) => ({ ...prev, [q.id]: next }));
            }}
          />
        </div>

        {error ? (
          <div className="mt-4 text-sm text-red-600">{error}</div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium transition hover:bg-white disabled:opacity-60"
              disabled={idx === 0 || pending}
              onClick={() => setIdx((x) => Math.max(0, x - 1))}
            >
              Back
            </button>
          </div>
          <div className="flex gap-2">
            {idx < ordered.length - 1 ? (
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-[var(--ff-fg)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-60"
                disabled={pending}
                onClick={() => {
                  const valid = validate(q, answers[q.id]);
                  if (!valid.ok) {
                    setError(valid.message);
                    return;
                  }
                  setIdx((x) => Math.min(ordered.length - 1, x + 1));
                }}
              >
                Next
              </button>
            ) : (
              <Button
                disabled={pending}
                onClick={() => {
                  const valid = validate(q, answers[q.id]);
                  if (!valid.ok) {
                    setError(valid.message);
                    return;
                  }
                  startTransition(async () => {
                    const id = await submitResponse(formId, answers);
                    setSubmitted(id);
                  });
                }}
              >
                {pending ? "Submitting…" : "Submit"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function QuestionInput({
  question,
  value,
  setValue,
}: {
  question: PublicQuestion;
  value: unknown;
  setValue: (v: unknown) => void;
}) {
  switch (question.type) {
    case "SHORT_TEXT":
    case "EMAIL":
      return (
        <input
          className="h-12 w-full rounded-2xl border border-black/10 bg-white/80 px-4 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-[rgba(124,58,237,0.18)]"
          placeholder={question.type === "EMAIL" ? "you@example.com" : "Type your answer…"}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => setValue(e.target.value)}
          inputMode={question.type === "EMAIL" ? "email" : "text"}
        />
      );
    case "LONG_TEXT":
      return (
        <textarea
          className="min-h-28 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-[rgba(124,58,237,0.18)]"
          placeholder="Type your answer…"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    case "MULTIPLE_CHOICE": {
      const opts = Array.isArray(question.optionsJson)
        ? (question.optionsJson as unknown[]).map(String)
        : [];
      return (
        <div className="space-y-2">
          {opts.map((opt) => {
            const checked = value === opt;
            return (
              <button
                key={opt}
                type="button"
                className={[
                  "w-full rounded-2xl border px-4 py-3 text-left text-sm transition",
                  checked
                    ? "border-[rgba(124,58,237,0.35)] bg-[rgba(124,58,237,0.10)]"
                    : "border-black/10 bg-white/80 hover:bg-white",
                ].join(" ")}
                onClick={() => setValue(opt)}
              >
                {opt}
              </button>
            );
          })}
        </div>
      );
    }
    case "CHECKBOX": {
      const opts = Array.isArray(question.optionsJson)
        ? (question.optionsJson as unknown[]).map(String)
        : [];
      const selected = Array.isArray(value) ? (value as unknown[]).map(String) : [];
      return (
        <div className="space-y-2">
          {opts.map((opt) => {
            const checked = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                className={[
                  "w-full rounded-2xl border px-4 py-3 text-left text-sm transition",
                  checked
                    ? "border-[rgba(37,99,235,0.35)] bg-[rgba(37,99,235,0.10)]"
                    : "border-black/10 bg-white/80 hover:bg-white",
                ].join(" ")}
                onClick={() => {
                  const next = checked
                    ? selected.filter((x) => x !== opt)
                    : [...selected, opt];
                  setValue(next);
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      );
    }
    case "RATING": {
      const current = typeof value === "number" ? value : null;
      return (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => {
            const n = i + 1;
            const active = current === n;
            return (
              <button
                key={n}
                type="button"
                className={[
                  "h-11 w-11 rounded-2xl border text-sm font-semibold transition",
                  active
                    ? "border-[rgba(236,72,153,0.35)] bg-[rgba(236,72,153,0.10)]"
                    : "border-black/10 bg-white/80 hover:bg-white",
                ].join(" ")}
                onClick={() => setValue(n)}
              >
                {n}
              </button>
            );
          })}
        </div>
      );
    }
  }
}

function validate(q: PublicQuestion, v: unknown): { ok: true } | { ok: false; message: string } {
  if (!q.required) return { ok: true };

  if (q.type === "CHECKBOX") {
    const arr = Array.isArray(v) ? v : [];
    return arr.length ? { ok: true } : { ok: false, message: "Please select at least one option." };
  }

  if (q.type === "RATING") {
    return typeof v === "number" ? { ok: true } : { ok: false, message: "Please choose a rating." };
  }

  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return { ok: false, message: "This question is required." };

  if (q.type === "EMAIL") {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
    return ok ? { ok: true } : { ok: false, message: "Please enter a valid email address." };
  }

  return { ok: true };
}

