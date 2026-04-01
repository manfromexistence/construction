import { ArrowRight, FileStack, Workflow } from "lucide-react";
import Link from "next/link";
import {
  EdmsActivityFeed,
  EdmsDocumentTable,
  EdmsNotificationList,
  EdmsProjectList,
  EdmsTransmittalList,
  EdmsWorkflowQueue,
} from "@/components/edms/dashboard-sections";
import { EdmsDataState } from "@/components/edms/data-state";
import { EdmsMetricCard } from "@/components/edms/metric-card";
import { EdmsPageHeader } from "@/components/edms/page-header";
import { Button } from "@/components/ui/button";
import { getEdmsDashboardData } from "@/lib/edms/dashboard";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export default async function DashboardPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const data = await getEdmsDashboardData(sessionUser);

  return (
    <div className="flex flex-1 flex-col">
      <EdmsPageHeader
        breadcrumbs={[{ label: "Dashboard" }]}
        title="Project control center"
        description="Track document health, workflow pressure, and formal issue activity from a single construction dashboard."
        actions={
          <>
            <Button asChild>
              <Link href="/dashboard/documents">
                <FileStack className="size-4" />
                Document control
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/workflows">
                <Workflow className="size-4" />
                Review queue
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </>
        }
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <EdmsDataState
          isUsingFallbackData={data.isUsingFallbackData}
          message={data.statusMessage}
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {data.metrics.map((metric) => (
            <EdmsMetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <EdmsProjectList projects={data.projects} />
          <EdmsWorkflowQueue items={data.workflowQueue} />
        </section>

        <section>
          <EdmsDocumentTable documents={data.documents} />
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <EdmsTransmittalList items={data.transmittals} />
          <EdmsNotificationList items={data.notifications} />
          <EdmsActivityFeed items={data.activity} />
        </section>
      </div>
    </div>
  );
}
