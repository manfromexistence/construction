import "server-only";

import { and, count, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { db } from "@/db";
import { documents } from "@/db/schema/documents";
import { projects } from "@/db/schema/projects";
import { type DashboardDocument, type DashboardMetric, getEdmsDashboardData } from "./dashboard";
import type { DashboardSessionUser } from "./session";

export interface DocumentFilters {
  query?: string;
  status?: string;
  discipline?: string;
  revision?: string;
}

export interface DocumentControlData {
  metrics: DashboardMetric[];
  projects: {
    id: string;
    name: string;
    projectNumber: string | null;
  }[];
  documents: DashboardDocument[];
  availableDisciplines: string[];
  availableRevisions: string[];
  isUsingFallbackData: boolean;
  statusMessage: string | null;
}

export async function getDocumentControlData(
  sessionUser: DashboardSessionUser,
  filters: DocumentFilters
): Promise<DocumentControlData> {
  try {
    const conditions = [
      filters.query
        ? or(
            ilike(documents.documentNumber, `%${filters.query}%`),
            ilike(documents.title, `%${filters.query}%`),
            ilike(projects.name, `%${filters.query}%`)
          )
        : undefined,
      filters.status ? eq(documents.status, filters.status) : undefined,
      filters.discipline ? eq(documents.discipline, filters.discipline) : undefined,
      filters.revision ? eq(documents.revision, filters.revision) : undefined,
    ].filter(Boolean);

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [
      totalRows,
      submittedRows,
      reviewRows,
      approvedRows,
      projectRows,
      documentRows,
      disciplineRows,
      revisionRows,
    ] = await Promise.all([
      db.select({ value: count() }).from(documents),
      db
        .select({ value: count() })
        .from(documents)
        .where(inArray(documents.status, ["submitted", "under_review"])),
      db.select({ value: count() }).from(documents).where(eq(documents.status, "under_review")),
      db.select({ value: count() }).from(documents).where(eq(documents.status, "approved")),
      db
        .select({
          id: projects.id,
          name: projects.name,
          projectNumber: projects.projectNumber,
        })
        .from(projects)
        .orderBy(projects.name),
      db
        .select({
          id: documents.id,
          documentNumber: documents.documentNumber,
          title: documents.title,
          projectName: projects.name,
          discipline: documents.discipline,
          revision: documents.revision,
          status: documents.status,
          uploadedAt: documents.uploadedAt,
        })
        .from(documents)
        .innerJoin(projects, eq(documents.projectId, projects.id))
        .where(whereClause)
        .orderBy(desc(documents.uploadedAt))
        .limit(24),
      db
        .select({ discipline: documents.discipline })
        .from(documents)
        .where(ilike(documents.discipline, `%`))
        .orderBy(documents.discipline),
      db.select({ revision: documents.revision }).from(documents).orderBy(documents.revision),
    ]);

    const [total] = totalRows;
    const [submitted] = submittedRows;
    const [review] = reviewRows;
    const [approved] = approvedRows;

    return {
      metrics: [
        {
          label: "Total documents",
          value: formatCount(total?.value),
          description: "Controlled records currently in the EDMS.",
          tone: "blue",
          icon: "documents",
        },
        {
          label: "Submitted",
          value: formatCount(submitted?.value),
          description: "Packages awaiting or entering review.",
          tone: "amber",
          icon: "reviews",
        },
        {
          label: "Under review",
          value: formatCount(review?.value),
          description: "Documents actively moving through review steps.",
          tone: "rose",
          icon: "reviews",
        },
        {
          label: "Approved",
          value: formatCount(approved?.value),
          description: "Accepted revisions available for downstream use.",
          tone: "emerald",
          icon: "documents",
        },
      ],
      projects: projectRows.map((project) => ({
        id: String(project.id),
        name: project.name,
        projectNumber: project.projectNumber,
      })),
      documents: documentRows.map((document) => ({
        id: String(document.id),
        documentNumber: document.documentNumber,
        title: document.title,
        projectName: document.projectName,
        discipline: document.discipline,
        revision: document.revision,
        status: document.status,
        uploadedLabel: formatDateLabel(document.uploadedAt),
      })),
      availableDisciplines: Array.from(
        new Set(
          disciplineRows
            .map((row) => row.discipline)
            .filter((discipline): discipline is string => Boolean(discipline))
        )
      ),
      availableRevisions: Array.from(
        new Set(
          revisionRows
            .map((row) => row.revision)
            .filter((revision): revision is string => Boolean(revision))
        )
      ),
      isUsingFallbackData: false,
      statusMessage: null,
    };
  } catch (error) {
    return createFallbackDocumentControlData(sessionUser, error);
  }
}

function createFallbackDocumentControlData(
  sessionUser: DashboardSessionUser,
  error: unknown
): Promise<DocumentControlData> {
  return getEdmsDashboardData(sessionUser).then((dashboard) => ({
    metrics: [
      {
        label: "Total documents",
        value: String(dashboard.documents.length),
        description: "Sample document volume while the database is still being prepared.",
        tone: "blue",
        icon: "documents",
      },
      {
        label: "Submitted",
        value: String(
          dashboard.documents.filter((document) =>
            ["submitted", "under_review"].includes(document.status)
          ).length
        ),
        description: "Sample review-ready revisions.",
        tone: "amber",
        icon: "reviews",
      },
      {
        label: "Under review",
        value: String(
          dashboard.documents.filter((document) => document.status === "under_review").length
        ),
        description: "Sample workflow load for the current package.",
        tone: "rose",
        icon: "reviews",
      },
      {
        label: "Approved",
        value: String(
          dashboard.documents.filter((document) => document.status === "approved").length
        ),
        description: "Sample approved records in the fallback workspace.",
        tone: "emerald",
        icon: "documents",
      },
    ],
    projects: dashboard.projects.map((project) => ({
      id: project.id,
      name: project.name,
      projectNumber: project.projectNumber,
    })),
    documents: dashboard.documents,
    availableDisciplines: Array.from(
      new Set(
        dashboard.documents
          .map((document) => document.discipline)
          .filter((discipline): discipline is string => Boolean(discipline))
      )
    ),
    availableRevisions: Array.from(
      new Set(
        dashboard.documents
          .map((document) => document.revision)
          .filter((revision): revision is string => Boolean(revision))
      )
    ),
    isUsingFallbackData: true,
    statusMessage: getFallbackMessage(error),
  }));
}

function formatCount(value: number | string | null | undefined) {
  return new Intl.NumberFormat("en-US").format(Number(value ?? 0));
}

function formatDateLabel(date: Date | null) {
  if (!date) {
    return "Uploaded date pending";
  }

  return `Uploaded ${new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)}`;
}

function getFallbackMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "Showing sample document data while the live EDMS workspace is still being connected.";
  }

  if (error.message.includes("DATABASE_URL")) {
    return "Showing sample document data because DATABASE_URL is not configured in this environment.";
  }

  if (
    error.message.includes("does not exist") ||
    error.message.includes("relation") ||
    error.message.includes("column")
  ) {
    return "Showing sample document data until the EDMS database migrations are applied.";
  }

  return "Showing sample document data while the live EDMS workspace is still being connected.";
}
