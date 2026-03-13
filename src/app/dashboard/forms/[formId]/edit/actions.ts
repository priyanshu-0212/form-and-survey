"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/server/db";

export async function updateFormMeta(formId: string, data: { title: string; description: string }) {
  await prisma.form.update({
    where: { id: formId },
    data: { title: data.title, description: data.description || null },
  });
  revalidatePath(`/dashboard/forms/${formId}/edit`);
  revalidatePath("/dashboard");
}

