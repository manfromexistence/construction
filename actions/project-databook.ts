"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { documents } from "@/db/schema/documents";
import { projects } from "@/db/schema/projects";
import { type ActionResponse, actionError, actionSuccess } from "@/lib/action-response";
import { canManageEdmsContent } from "@/lib/edms/rbac";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { uploadToCatbox } from "@/lib/edms/storage-catbox";
import { mergePDFsWithCover } from "@/lib/pdf-merger";
import { expandStorageUrl } from "@/lib/storage-utils";

interface DataBookDocument {
  id: string;
  documentNumber: string;
  title: string;
  discipline: string | null;
  category: string | null;
  revision: string | null;
  fileUrl: string;
  fileName: string;
}

export async function getProjectDataBookDocuments(
  projectId: string
): Promise<ActionResponse<{ documents: DataBookDocument[]; projectName: string }>> {
  try {
    const access = await getRequiredDashboardSessionUser();

    if (!canManageEdmsContent(access.role)) {
      return actionError("You do not have permission to generate project data books.");
    }

    const [project] = await db
      .select({ name: projects.name })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      return actionError("Project not found.");
    }

    const approvedDocs = await db
      .select({
        id: documents.id,
        documentNumber: documents.documentNumber,
        title: documents.title,
        discipline: documents.discipline,
        category: documents.category,
        revision: documents.revision,
        fileUrl: documents.fileUrl,
        fileName: documents.fileName,
      })
      .from(documents)
      .where(eq(documents.projectId, projectId))
      .orderBy(documents.documentNumber);

    return actionSuccess({
      documents: approvedDocs.map((doc) => ({
        id: String(doc.id),
        documentNumber: doc.documentNumber,
        title: doc.title,
        discipline: doc.discipline,
        category: doc.category,
        revision: doc.revision,
        fileUrl: expandStorageUrl(doc.fileUrl),
        fileName: doc.fileName,
      })),
      projectName: project.name,
    });
  } catch (error) {
    console.error("Error fetching project data book documents:", error);
    return actionError("Failed to fetch project documents for data book compilation.");
  }
}

export async function generateProjectDataBook(
  projectId: string,
  documentIds: string[]
): Promise<ActionResponse<{ downloadUrl: string; fileName: string }>> {
  try {
    const access = await getRequiredDashboardSessionUser();

    if (!canManageEdmsContent(access.role)) {
      return actionError("You do not have permission to generate project data books.");
    }

    const [project] = await db
      .select({ name: projects.name, projectNumber: projects.projectNumber })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      return actionError("Project not found.");
    }

    const allDocs = await db
      .select({
        id: documents.id,
        documentNumber: documents.documentNumber,
        title: documents.title,
        fileUrl: documents.fileUrl,
        fileName: documents.fileName,
      })
      .from(documents)
      .where(eq(documents.projectId, projectId))
      .orderBy(documents.documentNumber);

    const selectedDocs = allDocs.filter((doc) => documentIds.includes(String(doc.id)));

    if (selectedDocs.length === 0) {
      return actionError("No documents selected for compilation.");
    }

    const pdfFiles = selectedDocs.map((doc) => ({
      url: expandStorageUrl(doc.fileUrl),
      fileName: doc.fileName,
    }));

    const mergedPdfBytes = await mergePDFsWithCover(pdfFiles, project.name, project.projectNumber);

    const timestamp = new Date().toISOString().split("T")[0];
    const dataBookFileName = `${project.projectNumber || "PROJECT"}_DataBook_${timestamp}.pdf`;

    const pdfBuffer = Buffer.from(mergedPdfBytes);

    const uploadResult = await uploadToCatbox(pdfBuffer, dataBookFileName);

    if (!uploadResult.success) {
      return actionError("Failed to upload merged PDF to storage.");
    }

    return actionSuccess({
      downloadUrl: uploadResult.url,
      fileName: dataBookFileName,
    });
  } catch (error) {
    console.error("Error generating project data book:", error);
    return actionError(
      error instanceof Error ? error.message : "Failed to generate project data book."
    );
  }
}
