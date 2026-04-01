import { ArrowRight, Upload } from "lucide-react";
import Link from "next/link";
import {
  EdmsDocumentTable,
  EdmsTransmittalList,
  EdmsWorkflowQueue,
} from "@/components/edms/dashboard-sections";
import { EdmsDataState } from "@/components/edms/data-state";
import { EdmsMetricCard } from "@/components/edms/metric-card";
import { EdmsPageHeader } from "@/components/edms/page-header";
import { Button } from "@/components/ui/button";
import { getEdmsDashboardData } from "@/lib/edms/dashboard";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export default async function DocumentsPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const data = await getEdmsDashboardData(sessionUser);
  const [, documentMetric, workflowMetric, transmittalMetric] = data.metrics;

  return (
    <div className="flex flex-1 flex-col">
      <EdmsPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Documents" }]}
        title="Document control"
        description="Monitor the latest revisions, identify review bottlenecks, and keep transmittal packaging tied to the same source documents."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/dashboard/workflows">
                Review queue
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button disabled>
              <Upload className="size-4" />
              Upload document
            </Button>
          </>
        }
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <EdmsDataState
          isUsingFallbackData={data.isUsingFallbackData}
          message={data.statusMessage}
        />

        <section className="grid gap-4 md:grid-cols-3">
          <EdmsMetricCard metric={documentMetric} />
          <EdmsMetricCard metric={workflowMetric} />
          <EdmsMetricCard metric={transmittalMetric} />
        </section>

        <section>
          <EdmsDocumentTable documents={data.documents} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <EdmsWorkflowQueue items={data.workflowQueue} />
          <EdmsTransmittalList items={data.transmittals} />
        </section>
      </div>
    </div>
  );
}
