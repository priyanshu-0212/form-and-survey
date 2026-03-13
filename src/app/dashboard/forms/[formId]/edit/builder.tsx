"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState, useTransition } from "react";

import {
  addQuestion,
  deleteQuestion,
  reorderQuestions,
  updateQuestion,
  type QuestionTypeInput,
} from "@/app/dashboard/forms/[formId]/edit/builder-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type BuilderQuestion = {
  id: string;
  type: QuestionTypeInput;
  title: string;
  description: string | null;
  required: boolean;
  order: number;
  optionsJson: unknown;
};

const QUESTION_TYPES: Array<{ type: QuestionTypeInput; label: string }> = [
  { type: "SHORT_TEXT", label: "Short text" },
  { type: "LONG_TEXT", label: "Long text" },
  { type: "MULTIPLE_CHOICE", label: "Multiple choice" },
  { type: "CHECKBOX", label: "Checkbox" },
  { type: "RATING", label: "Rating scale" },
  { type: "EMAIL", label: "Email" },
];

export function Builder({
  formId,
  initialQuestions,
}: {
  formId: string;
  initialQuestions: BuilderQuestion[];
}) {
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState<BuilderQuestion[]>(
    [...initialQuestions].sort((a, b) => a.order - b.order),
  );

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const ids = useMemo(() => items.map((q) => q.id), [items]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold tracking-tight">Questions</div>
          <div className="mt-1 text-sm text-[var(--ff-muted)]">
            Drag to reorder. Changes save instantly.
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUESTION_TYPES.map((qt) => (
            <button
              key={qt.type}
              type="button"
              disabled={pending}
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-xs font-medium transition hover:bg-white disabled:opacity-60"
              onClick={() =>
                startTransition(async () => {
                  await addQuestion(formId, qt.type);
                })
              }
            >
              + {qt.label}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <Card className="p-6">
          <div className="text-sm font-semibold tracking-tight">
            Add your first question
          </div>
          <div className="mt-2 text-sm leading-6 text-[var(--ff-muted)]">
            Choose a question type above. Your public form link will update
            automatically.
          </div>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (!over || active.id === over.id) return;
            setItems((prev) => {
              const oldIndex = prev.findIndex((q) => q.id === active.id);
              const newIndex = prev.findIndex((q) => q.id === over.id);
              const next = arrayMove(prev, oldIndex, newIndex).map((q, idx) => ({
                ...q,
                order: idx,
              }));
              startTransition(async () => {
                await reorderQuestions(formId, next.map((q) => q.id));
              });
              return next;
            });
          }}
        >
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  index={idx}
                  q={q}
                  onLocalChange={(next) =>
                    setItems((prev) => prev.map((x) => (x.id === q.id ? next : x)))
                  }
                  onSave={(patch) =>
                    startTransition(async () => {
                      await updateQuestion(formId, q.id, patch);
                    })
                  }
                  onDelete={() =>
                    startTransition(async () => {
                      await deleteQuestion(formId, q.id);
                      setItems((prev) => prev.filter((x) => x.id !== q.id));
                    })
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="text-xs text-[var(--ff-muted)]">
        {pending ? "Saving…" : "All changes saved."}
      </div>
    </div>
  );
}

function QuestionCard({
  q,
  index,
  onLocalChange,
  onSave,
  onDelete,
}: {
  q: BuilderQuestion;
  index: number;
  onLocalChange: (next: BuilderQuestion) => void;
  onSave: (patch: Partial<BuilderQuestion>) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: q.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const optionsText =
    q.type === "MULTIPLE_CHOICE" || q.type === "CHECKBOX"
      ? Array.isArray(q.optionsJson)
        ? (q.optionsJson as unknown[]).map(String).join("\n")
        : "Option 1\nOption 2"
      : "";

  return (
    <Card
      ref={setNodeRef as unknown as never}
      style={style as never}
      className={[
        "p-5",
        isDragging ? "opacity-80 ring-4 ring-[rgba(37,99,235,0.14)]" : "",
      ].join(" ")}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-black/10 bg-white/80 text-xs font-semibold text-[var(--ff-muted)] transition hover:bg-white"
            title="Drag to reorder"
            {...attributes}
            {...listeners}
          >
            {index + 1}
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={q.type}
                className="h-9 rounded-full border border-black/10 bg-white/80 px-3 text-xs font-medium outline-none transition focus-visible:ring-4 focus-visible:ring-[rgba(124,58,237,0.18)]"
                onChange={(e) => {
                  const type = e.target.value as QuestionTypeInput;
                  const next: BuilderQuestion = {
                    ...q,
                    type,
                    optionsJson:
                      type === "MULTIPLE_CHOICE" || type === "CHECKBOX"
                        ? Array.isArray(q.optionsJson)
                          ? q.optionsJson
                          : ["Option 1", "Option 2"]
                        : null,
                  };
                  onLocalChange(next);
                  onSave({ type: next.type, optionsJson: next.optionsJson });
                }}
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t.type} value={t.type}>
                    {t.label}
                  </option>
                ))}
              </select>

              <label className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-2 text-xs font-medium">
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={(e) => {
                    const required = e.target.checked;
                    onLocalChange({ ...q, required });
                    onSave({ required });
                  }}
                />
                Required
              </label>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-[var(--ff-muted)]">
                Question title
              </label>
              <input
                value={q.title}
                className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white/80 px-4 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-[rgba(124,58,237,0.18)]"
                placeholder="e.g. What’s your feedback?"
                onChange={(e) => onLocalChange({ ...q, title: e.target.value })}
                onBlur={(e) => onSave({ title: e.target.value.trim() || q.title })}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-[var(--ff-muted)]">
                Description (optional)
              </label>
              <input
                value={q.description ?? ""}
                className="mt-1 h-11 w-full rounded-2xl border border-black/10 bg-white/80 px-4 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-[rgba(124,58,237,0.18)]"
                placeholder="Add a hint for respondents"
                onChange={(e) =>
                  onLocalChange({ ...q, description: e.target.value })
                }
                onBlur={(e) => onSave({ description: e.target.value.trim() || null })}
              />
            </div>

            {(q.type === "MULTIPLE_CHOICE" || q.type === "CHECKBOX") && (
              <div className="mt-3">
                <label className="text-xs font-medium text-[var(--ff-muted)]">
                  Options (one per line)
                </label>
                <textarea
                  defaultValue={optionsText}
                  className="mt-1 min-h-24 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-[rgba(124,58,237,0.18)]"
                  onBlur={(e) => {
                    const options = e.currentTarget.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    const next = options.length ? options : ["Option 1", "Option 2"];
                    onLocalChange({ ...q, optionsJson: next });
                    onSave({ optionsJson: next });
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
          <Button
            type="button"
            variant="secondary"
            className="h-10 px-4 text-sm"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}

