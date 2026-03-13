"use server";

import { prisma } from "@/server/db";

export type Insights = {
  summary: string;
  keyThemes: string[];
  sentiment: { label: "Positive" | "Neutral" | "Negative"; score: number };
  commonFeedback: string[];
  recommendations: string[];
};

export async function generateInsights(formId: string): Promise<Insights> {
  const form = await prisma.form.findUnique({
    where: { id: formId },
    select: {
      title: true,
      questions: { select: { id: true, title: true, type: true } },
      responses: {
        select: {
          answers: { select: { questionId: true, valueJson: true } },
        },
      },
    },
  });

  if (!form) {
    return {
      summary: "Form not found.",
      keyThemes: [],
      sentiment: { label: "Neutral", score: 0 },
      commonFeedback: [],
      recommendations: [],
    };
  }

  const qById = new Map(form.questions.map((q) => [q.id, q] as const));

  const texts: string[] = [];
  const ratings: number[] = [];
  const choiceCounts = new Map<string, number>();

  for (const r of form.responses) {
    for (const a of r.answers) {
      const q = qById.get(a.questionId);
      const v = a.valueJson as unknown;
      if (!q) continue;

      if (q.type === "RATING" && typeof v === "number") {
        ratings.push(v);
      } else if (typeof v === "string") {
        const s = v.trim();
        if (s) texts.push(`${q.title}: ${s}`);
        if (q.type === "MULTIPLE_CHOICE") bump(choiceCounts, s);
      } else if (Array.isArray(v)) {
        for (const item of v) bump(choiceCounts, String(item));
      }
    }
  }

  const { label, score } = scoreSentiment(texts.join(" "));
  const themes = extractThemes(texts.join(" "));
  const topChoices = topN(choiceCounts, 5).map(([k, c]) => `${k} (${c})`);

  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, n) => sum + n, 0) / ratings.length
      : null;

  const summaryParts = [
    `${form.responses.length} response${form.responses.length === 1 ? "" : "s"} collected for “${form.title}”.`,
    avgRating != null
      ? `Average rating: ${avgRating.toFixed(1)} / 5 (${ratings.length} rating${ratings.length === 1 ? "" : "s"}).`
      : null,
    themes.length ? `Top themes: ${themes.slice(0, 3).join(", ")}.` : null,
  ].filter(Boolean) as string[];

  const recommendations: string[] = [];
  if (avgRating != null && avgRating < 3.5) {
    recommendations.push(
      "Prioritize fixing the top pain points mentioned in free-text feedback and follow up with users who rated 1–2.",
    );
  }
  if (themes.includes("pricing")) {
    recommendations.push(
      "Clarify pricing/plan differences and add an in-product tooltip or comparison table where users get stuck.",
    );
  }
  if (themes.includes("onboarding")) {
    recommendations.push(
      "Streamline onboarding: reduce steps, add examples, and provide a quick-start template.",
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      "Turn the top themes into 2–3 experiments, then re-run this survey after shipping improvements.",
    );
  }

  return {
    summary: summaryParts.join(" "),
    keyThemes: themes.slice(0, 6),
    sentiment: { label, score },
    commonFeedback: [
      ...topChoices,
      ...themes.slice(0, 3).map((t) => `Users frequently mention “${t}”.`),
    ].slice(0, 8),
    recommendations,
  };
}

function bump(map: Map<string, number>, key: string) {
  const k = key.trim();
  if (!k) return;
  map.set(k, (map.get(k) ?? 0) + 1);
}

function topN(map: Map<string, number>, n: number) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

function scoreSentiment(text: string) {
  const t = text.toLowerCase();
  const pos = [
    "love",
    "great",
    "awesome",
    "amazing",
    "good",
    "easy",
    "smooth",
    "fast",
    "helpful",
    "intuitive",
  ];
  const neg = [
    "hate",
    "bad",
    "bug",
    "slow",
    "confusing",
    "hard",
    "broken",
    "frustrating",
    "issue",
    "problem",
  ];
  let score = 0;
  for (const w of pos) if (t.includes(w)) score += 1;
  for (const w of neg) if (t.includes(w)) score -= 1;
  const label: Insights["sentiment"]["label"] =
    score > 1 ? "Positive" : score < -1 ? "Negative" : "Neutral";
  return { label, score };
}

function extractThemes(text: string) {
  const t = text.toLowerCase();
  const candidates = [
    "pricing",
    "onboarding",
    "performance",
    "ui",
    "ux",
    "analytics",
    "export",
    "templates",
    "sharing",
    "mobile",
    "notifications",
    "integration",
    "support",
  ];
  const found: string[] = [];
  for (const c of candidates) {
    if (t.includes(c)) found.push(c);
  }

  // fallback: word frequency (very small + safe)
  if (found.length === 0) {
    const words = t
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 5 && !STOP.has(w));
    const counts = new Map<string, number>();
    for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
    found.push(...topN(counts, 6).map(([w]) => w));
  }

  return found;
}

const STOP = new Set([
  "which",
  "their",
  "there",
  "about",
  "would",
  "could",
  "should",
  "these",
  "those",
  "because",
  "really",
  "thanks",
  "thank",
  "answer",
  "question",
  "experience",
  "improve",
  "improvement",
  "feature",
  "features",
  "please",
  "using",
  "users",
  "user",
  "formflow",
]);

