"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { newFormSlug } from "@/lib/ids";
import { prisma } from "@/server/db";

export async function createForm() {
  const slug = newFormSlug();
  const form = await prisma.form.create({
    data: {
      title: "Untitled form",
      description: "A new FormFlow AI form.",
      slug,
    },
    select: { id: true },
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard/forms/${form.id}/edit`);
}

export async function deleteForm(formId: string) {
  await prisma.form.delete({ where: { id: formId } });
  revalidatePath("/dashboard");
}

