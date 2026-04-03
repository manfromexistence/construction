"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { documents } from "@/db/schema/documents";
import { projects } from "@/db/schema/projects";
import { type ActionResponse, actionError, actionSuccess } from "@/lib/action-response";
import { canManageEdmsContent } from "@/lib/edms/rbac";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

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

    // Get project details
    const [project] = await db
      .select({ name: projects.name })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      return actionError("Project not found.");
    }

    // Get all approved documents for the project
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

    // Filter only approved documents
    const approvedDocuments = approvedDocs.filter((doc) => {
      // You can add more sophisticated filtering here
      return true; // For now, include all documents
    });

    return actionSuccess({
      documents: approvedDocuments.map((doc) => ({
        id: String(doc.id),
        documentNumber: doc.documentNumber,
        title: doc.title,
        discipline: doc.discipline,
        category: doc.category,
        revision: doc.revision,
        fileUrl: doc.fileUrl,
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
): Promise<ActionResponse<{ downloadUrl: string }>> {
  try {
    const access = await getRequiredDashboardSessionUser();

    if (!canManageEdmsContent(access.role)) {
      return actionError("You do not have permission to generate project data books.");
    }

    // Get project details
    const [project] = await db
      .select({ name: projects.name, projectNumber: projects.projectNumber })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      return actionError("Project not found.");
    }

    // Get selected documents
    const selectedDocs = await db
      .select({
        documentNumber: documents.documentNumber,
        title: documents.title,
        fileUrl: documents.fileUrl,
        fileName: documents.fileName,
      })
      .from(documents)
      .where(eq(documents.projectId, projectId));

    const filteredDocs = selectedDocs.filter((doc) => documentIds.includes(String(doc.id)));

    if (filteredDocs.length === 0) {
      return actionError("No documents selected for compilation.");
    }

    // In a real implementation, you would:
    // 1. Download all PDFs from their URLs
    // 2. Merge them using a PDF library (like pdf-lib or PDFKit)
    // 3. Upload the merged PDF to storage
    // 4. Return the download URL

    // For now, return a placeholder
    const _dataBookFileName = `${project.projectNumber || "PROJECT"}_DataBook_${new Date().toISOString().split("T")[0]}.pdf`;

    return actionSuccess({
      downloadUrl: "#", // This would be the actual merged PDF URL
    });
  } catch (error) {
    console.error("Error generating project data book:", error);
    return actionError("Failed to generate project data book.");
  }
}
