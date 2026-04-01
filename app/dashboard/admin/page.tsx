import { count } from "drizzle-orm";
import { BellRing, FileStack, FolderKanban, Users2 } from "lucide-react";
import Link from "next/link";
import { EdmsMetricCard } from "@/components/edms/metric-card";
import { EdmsPageHeader } from "@/components/edms/page-header";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { documents } from "@/db/schema/documents";
import { notifications } from "@/db/schema/notifications";
import { projects } from "@/db/schema/projects";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export default async function AdminDashboardPage() {
  const sessionUser = await getRequiredDashboardSessionUser();

  if (sessionUser.role !== "admin") {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <EdmsPageHeader
          breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Admin" }]}
          title="Admin access required"
          description="This route is available to administrators only."
          actions={
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const [projectCount, documentCount, userCount, notificationCount] = await Promise.all([
    db.select({ value: count() }).from(projects),
    db.select({ value: count() }).from(documents),
    db.select({ value: count() }).from(userTable),
    db.select({ value: count() }).from(notifications),
  ]);

  const metrics = [
    {
      label: "Projects",
      value: String(projectCount[0]?.value ?? 0),
      description: "Registered construction workspaces",
      icon: FolderKanban,
    },
    {
      label: "Documents",
      value: String(documentCount[0]?.value ?? 0),
      description: "Controlled document records",
      icon: FileStack,
    },
    {
      label: "Users",
      value: String(userCount[0]?.value ?? 0),
      description: "Workspace users in the system",
      icon: Users2,
    },
    {
      label: "Notifications",
      value: String(notificationCount[0]?.value ?? 0),
      description: "Generated in-app notifications",
      icon: BellRing,
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <EdmsPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Admin" }]}
        title="Admin dashboard"
        description="System-level oversight for the live Construction EDMS workspace."
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <EdmsMetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border bg-card p-6">
            <h2 className="text-lg font-semibold">Why this page exists</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The dashboard sidebar already exposed an admin route, but the route itself was
              missing. This page provides a real landing screen so navigation no longer fails with
              404 responses.
            </p>
          </div>
          <div className="rounded-3xl border bg-card p-6">
            <h2 className="text-lg font-semibold">Next admin slice</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The next step after stabilizing the current client handoff is a fuller user and role
              management surface under the admin area.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
