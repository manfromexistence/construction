import { ArrowRight, Send } from "lucide-react";
import Link from "next/link";
import {
  EdmsNotificationList,
  EdmsTransmittalList,
  EdmsWorkflowQueue,
} from "@/components/edms/dashboard-sections";
import { EdmsDataState } from "@/components/edms/data-state";
import { EdmsMetricCard } from "@/components/edms/metric-card";
import { EdmsPageHeader } from "@/components/edms/page-header";
import { Button } from "@/components/ui/button";
import { getEdmsDashboardData } from "@/lib/edms/dashboard";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export default async function TransmittalsPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const data = await getEdmsDashboardData(sessionUser);
  const [, documentMetric, , transmittalMetric, notificationMetric] = data.metrics;

  return (
    <div className="flex flex-1 flex-col">
      <EdmsPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Transmittals" }]}
        title="Transmittal control"
        description="Track formal issue packages, map them back to live documents, and keep acknowledgement visibility in the same operating surface."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/dashboard/documents">
                Source documents
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button disabled>
              <Send className="size-4" />
              Create transmittal
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
          <EdmsMetricCard metric={transmittalMetric} />
          <EdmsMetricCard metric={documentMetric} />
          <EdmsMetricCard metric={notificationMetric} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <EdmsTransmittalList items={data.transmittals} />
          <EdmsWorkflowQueue items={data.workflowQueue} />
        </section>

        <section>
          <EdmsNotificationList items={data.notifications} />
        </section>
      </div>
    </div>
  );
}
