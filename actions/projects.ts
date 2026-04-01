"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { projectMembers, projects } from "@/db/schema/projects";
import { getCurrentUserId, logError } from "@/lib/shared";
import { type ActionResult, actionError, actionSuccess, ErrorCode } from "@/types/errors";

const projectStatuses = ["active", "on-hold", "completed", "archived"] as const;

const createProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Project name must be at least 2 characters.")
      .max(255, "Project name is too long."),
    projectNumber: z.string().trim().max(100, "Project number is too long.").optional(),
    location: z.string().trim().max(255, "Location is too long.").optional(),
    description: z.string().trim().max(2000, "Description is too long.").optional(),
    status: z.enum(projectStatuses),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (value) => {
      if (!value.startDate || !value.endDate) {
        return true;
      }

      return new Date(value.endDate) >= new Date(value.startDate);
    },
    {
      message: "End date must be on or after the start date.",
      path: ["endDate"],
    }
  );

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export async function createProject(
  input: CreateProjectInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const validation = createProjectSchema.safeParse(input);

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message ?? "Invalid project data.";
      return actionError(ErrorCode.VALIDATION_ERROR, firstError);
    }

    const userId = await getCurrentUserId();
    const values = validation.data;
    const now = new Date();

    const [createdProject] = await db.transaction(async (tx) => {
      const [insertedProject] = await tx
        .insert(projects)
        .values({
          name: values.name,
          description: normalizeOptionalString(values.description),
          projectNumber: normalizeOptionalString(values.projectNumber),
          location: normalizeOptionalString(values.location),
          status: values.status,
          startDate: parseOptionalDate(values.startDate),
          endDate: parseOptionalDate(values.endDate),
          createdBy: userId,
          updatedAt: now,
        })
        .returning({ id: projects.id });

      await tx.insert(projectMembers).values({
        projectId: insertedProject.id,
        userId,
        role: "admin",
        assignedBy: userId,
      });

      return [insertedProject];
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    revalidatePath(`/dashboard/projects/${createdProject.id}`);

    return actionSuccess({ id: createdProject.id });
  } catch (error) {
    logError(error as Error, { action: "createProject", input });

    if (error instanceof Error && error.message.includes("does not exist")) {
      return actionError(
        ErrorCode.UNKNOWN_ERROR,
        "Project tables are not available yet. Run the EDMS migrations before creating projects."
      );
    }

    return actionError(ErrorCode.UNKNOWN_ERROR, "Failed to create project. Please try again.");
  }
}

function normalizeOptionalString(value: string | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseOptionalDate(value: string | undefined) {
  if (!value) {
    return null;
  }

  return new Date(value);
}
