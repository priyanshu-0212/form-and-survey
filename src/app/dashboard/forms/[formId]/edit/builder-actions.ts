"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/server/db";
import { Prisma } from "@/generated/prisma/client";

export type QuestionTypeInput =
  | "SHORT_TEXT"
  | "LONG_TEXT"
  | "MULTIPLE_CHOICE"
  | "CHECKBOX"
  | "RATING"
  | "EMAIL";

export async function addQuestion(formId: string, type: QuestionTypeInput) {
  const max = await prisma.question.aggregate({
    where: { formId },
    _max: { order: true },
  });
  const nextOrder = (max._max.order ?? -1) + 1;

  await prisma.question.create({
    data: {
      formId,
      type,
      title: defaultTitle(type),
      description: null,
      required: false,
      order: nextOrder,
      optionsJson:
        type === "MULTIPLE_CHOICE" || type === "CHECKBOX"
          ? ["Option 1", "Option 2"]
          : undefined,
    },
  });

  revalidatePath(`/dashboard/forms/${formId}/edit`);
  revalidatePath("/dashboard");
}

export async function updateQuestion(
  formId: string,
  questionId: string,
  patch: {
    title?: string;
    description?: string | null;
    required?: boolean;
    type?: QuestionTypeInput;
    optionsJson?: unknown;
  },
) {
  await prisma.question.update({
    where: { id: questionId },
    data: {
      title: patch.title,
      description: patch.description,
      required: patch.required,
      type: patch.type,
      optionsJson:
        patch.optionsJson === null
          ? Prisma.DbNull
          : (patch.optionsJson as never),
    },
  });
  revalidatePath(`/dashboard/forms/${formId}/edit`);
  revalidatePath("/dashboard");
}

export async function deleteQuestion(formId: string, questionId: string) {
  await prisma.question.delete({ where: { id: questionId } });
  revalidatePath(`/dashboard/forms/${formId}/edit`);
  revalidatePath("/dashboard");
}

export async function reorderQuestions(formId: string, orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, idx) =>
      prisma.question.update({
        where: { id },
        data: { order: idx },
      }),
    ),
  );
  revalidatePath(`/dashboard/forms/${formId}/edit`);
}

function defaultTitle(type: QuestionTypeInput) {
  switch (type) {
    case "SHORT_TEXT":
      return "Short answer";
    case "LONG_TEXT":
      return "Long answer";
    case "MULTIPLE_CHOICE":
      return "Choose one";
    case "CHECKBOX":
      return "Select all that apply";
    case "RATING":
      return "Rate from 1 to 5";
    case "EMAIL":
      return "Email address";
  }
}

