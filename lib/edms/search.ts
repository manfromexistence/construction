import "server-only";

import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { documents } from "@/db/schema/documents";
import { notifications } from "@/db/schema/notifications";
import { projects } from "@/db/schema/projects";
import { transmittals } from "@/db/schema/transmittals";
import { documentWorkflows } from "@/db/schema/workflows";
import { getEdmsDashboardData } from "./dashboard";
import type { DashboardSessionUser } from "./session";

export interface GlobalSearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: "project" | "document" | "workflow" | "transmittal" | "notification";
  href: string;
  meta: string;
}

export interface GlobalSearchData {
  query: string;
  results: GlobalSearchResult[];
  isUsingFallbackData: boolean;
  statusMessage: string | null;
}

export async function getGlobalSearchData(
  sessionUser: DashboardSessionUser,
  query: string
): Promise<GlobalSearchData> {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length === 0) {
    return {
      query: normalizedQuery,
      results: [],
      isUsingFallbackData: false,
      statusMessage: null,
    };
  }

  try {
    const pattern = `%${normalizedQuery}%`;

    const [projectRows, documentRows, workflowRows, transmittalRows, notificationRows] =
      await Promise.all([
        db
          .select({
            id: projects.id,
            name: projects.name,
            projectNumber: projects.projectNumber,
            location: projects.location,
          })
          .from(projects)
          .where(or(ilike(projects.name, pattern), ilike(projects.projectNumber, pattern)))
          .orderBy(desc(projects.updatedAt))
          .limit(6),
        db
          .select({
            id: documents.id,
            title: documents.title,
            documentNumber: documents.documentNumber,
            revision: documents.revision,
            projectName: projects.name,
          })
          .from(documents)
          .innerJoin(projects, eq(documents.projectId, projects.id))
          .where(or(ilike(documents.title, pattern), ilike(documents.documentNumber, pattern)))
          .orderBy(desc(documents.updatedAt))
          .limit(6),
        db
          .select({
            id: documentWorkflows.id,
            workflowName: documentWorkflows.workflowName,
            documentTitle: documents.title,
            documentNumber: documents.documentNumber,
            projectName: projects.name,
          })
          .from(documentWorkflows)
          .innerJoin(documents, eq(documentWorkflows.documentId, documents.id))
          .innerJoin(projects, eq(documents.projectId, projects.id))
          .where(
            or(
              ilike(documentWorkflows.workflowName, pattern),
              ilike(documents.title, pattern),
              ilike(documents.documentNumber, pattern)
            )
          )
          .orderBy(desc(documentWorkflows.startedAt))
          .limit(6),
        db
          .select({
            id: transmittals.id,
            transmittalNumber: transmittals.transmittalNumber,
            subject: transmittals.subject,
            projectName: projects.name,
          })
          .from(transmittals)
          .innerJoin(projects, eq(transmittals.projectId, projects.id))
          .where(
            or(ilike(transmittals.transmittalNumber, pattern), ilike(transmittals.subject, pattern))
          )
          .orderBy(desc(transmittals.createdAt))
          .limit(6),
        db
          .select({
            id: notifications.id,
            title: notifications.title,
            message: notifications.message,
            actionUrl: notifications.actionUrl,
            projectName: projects.name,
          })
          .from(notifications)
          .leftJoin(projects, eq(notifications.projectId, projects.id))
          .where(andScopedNotificationQuery(sessionUser.id, pattern))
          .orderBy(desc(notifications.createdAt))
          .limit(6),
      ]);

    return {
      query: normalizedQuery,
      results: [
        ...projectRows.map((project) => ({
          id: String(project.id),
          title: project.name,
          subtitle: project.projectNumber ?? "Project",
          category: "project" as const,
          href: `/dashboard/projects/${project.id}`,
          meta: project.location ?? "Location pending",
        })),
        ...documentRows.map((document) => ({
          id: String(document.id),
          title: document.title,
          subtitle: document.documentNumber,
          category: "document" as const,
          href: `/dashboard/documents/${document.id}`,
          meta: `${document.projectName}${document.revision ? ` • Rev ${document.revision}` : ""}`,
        })),
        ...workflowRows.map((workflow) => ({
          id: String(workflow.id),
          title: workflow.workflowName,
          subtitle: workflow.documentNumber,
          category: "workflow" as const,
          href: "/dashboard/workflows",
          meta: `${workflow.projectName} • ${workflow.documentTitle}`,
        })),
        ...transmittalRows.map((transmittal) => ({
          id: String(transmittal.id),
          title: transmittal.subject,
          subtitle: transmittal.transmittalNumber,
          category: "transmittal" as const,
          href: "/dashboard/transmittals",
          meta: transmittal.projectName,
        })),
        ...notificationRows.map((notification) => ({
          id: String(notification.id),
          title: notification.title,
          subtitle: "Notification",
          category: "notification" as const,
          href: notification.actionUrl ?? "/dashboard/notifications",
          meta: notification.projectName ?? notification.message,
        })),
      ],
      isUsingFallbackData: false,
      statusMessage: null,
    };
  } catch (error) {
    return createFallbackSearchData(sessionUser, normalizedQuery, error);
  }
}

function andScopedNotificationQuery(userId: string, pattern: string) {
  return and(
    eq(notifications.userId, userId),
    or(ilike(notifications.title, pattern), ilike(notifications.message, pattern))
  );
}

async function createFallbackSearchData(
  sessionUser: DashboardSessionUser,
  query: string,
  error: unknown
): Promise<GlobalSearchData> {
  const dashboard = await getEdmsDashboardData(sessionUser);
  const pattern = query.toLowerCase();

  const results: GlobalSearchResult[] = [
    ...dashboard.projects
      .filter(
        (project) =>
          project.name.toLowerCase().includes(pattern) ||
          project.projectNumber?.toLowerCase().includes(pattern)
      )
      .map((project) => ({
        id: project.id,
        title: project.name,
        subtitle: project.projectNumber ?? "Project",
        category: "project" as const,
        href: `/dashboard/projects/${project.id}`,
        meta: project.location ?? "Location pending",
      })),
    ...dashboard.documents
      .filter(
        (document) =>
          document.title.toLowerCase().includes(pattern) ||
          document.documentNumber.toLowerCase().includes(pattern) ||
          document.projectName.toLowerCase().includes(pattern)
      )
      .map((document) => ({
        id: document.id,
        title: document.title,
        subtitle: document.documentNumber,
        category: "document" as const,
        href: `/dashboard/documents/${document.id}`,
        meta: `${document.projectName}${document.revision ? ` • Rev ${document.revision}` : ""}`,
      })),
    ...dashboard.transmittals
      .filter(
        (transmittal) =>
          transmittal.subject.toLowerCase().includes(pattern) ||
          transmittal.transmittalNumber.toLowerCase().includes(pattern)
      )
      .map((transmittal) => ({
        id: transmittal.id,
        title: transmittal.subject,
        subtitle: transmittal.transmittalNumber,
        category: "transmittal" as const,
        href: "/dashboard/transmittals",
        meta: transmittal.projectName,
      })),
  ];

  return {
    query,
    results,
    isUsingFallbackData: true,
    statusMessage: getFallbackMessage(error),
  };
}

function getFallbackMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "Showing sample search results while the live EDMS workspace is still being connected.";
  }

  if (error.message.includes("DATABASE_URL")) {
    return "Showing sample search results because DATABASE_URL is not configured in this environment.";
  }

  if (
    error.message.includes("does not exist") ||
    error.message.includes("relation") ||
    error.message.includes("column")
  ) {
    return "Showing sample search results until the EDMS database migrations are applied.";
  }

  return "Showing sample search results while the live EDMS workspace is still being connected.";
}
