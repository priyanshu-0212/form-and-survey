"use client";

import { useState, useTransition } from "react";

import {
  generateInsights,
  type Insights,
} from "@/app/dashboard/forms/[formId]/responses/insights-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function InsightsPanel({ formId }: { formId: string }) {
  const [pending, startTransition] = useTransition();
  const [insights, setInsights] = useState<Insights | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold tracking-tight">
            AI Insights
          </div>
          <div className="mt-1 text-sm text-[var(--ff-muted)]">
            Summarize responses, spot themes, and get recommendations.
          </div>
        </div>
        <Button
          variant="primary"
          className="h-10 px-4 text-sm"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              setError(null);
              try {
                const res = await generateInsights(formId);
                setInsights(res);
              } catch {
                setError("Failed to generate insights. Please try again.");
              }
            })
          }
        >
          {pending ? "Generating…" : "Generate AI Insights"}
        </Button>
      </div>

      {error ? <div className="mt-4 text-sm text-red-600">{error}</div> : null}

      {insights ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
            <div className="text-xs font-semibold text-[var(--ff-muted)]">
              Summary
            </div>
            <div className="mt-2 text-sm leading-6">{insights.summary}</div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--ff-muted)]">
              <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1">
                Sentiment: {insights.sentiment.label}
              </span>
              <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1">
                Score: {insights.sentiment.score}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
            <div className="text-xs font-semibold text-[var(--ff-muted)]">
              Key themes
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {insights.keyThemes.length ? (
                insights.keyThemes.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[var(--ff-accent-2)]" />
                    <span className="capitalize">{t}</span>
                  </li>
                ))
              ) : (
                <li className="text-[var(--ff-muted)]">No themes detected yet.</li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
            <div className="text-xs font-semibold text-[var(--ff-muted)]">
              Common feedback
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {insights.commonFeedback.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[var(--ff-accent-3)]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
            <div className="text-xs font-semibold text-[var(--ff-muted)]">
              Recommendations
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {insights.recommendations.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[var(--ff-accent-1)]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="mt-5 text-sm text-[var(--ff-muted)]">
          Click “Generate AI Insights” to analyze submitted responses.
        </div>
      )}
    </Card>
  );
}

