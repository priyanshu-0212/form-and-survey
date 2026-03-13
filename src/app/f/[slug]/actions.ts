"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/server/db";

export async function submitResponse(formId: string, answers: Record<string, unknown>) {
  const questionIds = Object.keys(answers);

  const response = await prisma.response.create({
    data: {
      formId,
      answers: {
        create: questionIds.map((questionId) => ({
          questionId,
          valueJson: answers[questionId] as never,
        })),
      },
    },
    select: { id: true },
  });

  revalidatePath(`/dashboard/forms/${formId}/responses`);
  revalidatePath("/dashboard");
  return response.id;
}

