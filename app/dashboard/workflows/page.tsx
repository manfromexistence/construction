import { ArrowRight, CheckCheck } from "lucide-react";
import Link from "next/link";
import {
  EdmsActivityFeed,
  EdmsNotificationList,
  EdmsWorkflowQueue,
} from "@/components/edms/dashboard-sections";
import { EdmsDataState } from "@/components/edms/data-state";
import { EdmsMetricCard } from "@/components/edms/metric-card";
import { EdmsPageHeader } from "@/components/edms/page-header";
import { Button } from "@/components/ui/button";
import { getEdmsDashboardData } from "@/lib/edms/dashboard";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export default async function WorkflowsPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const data = await getEdmsDashboardData(sessionUser);
  const [, , workflowMetric, , notificationMetric] = data.metrics;

  return (
    <div className="flex flex-1 flex-col">
      <EdmsPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Workflows" }]}
        title="Review workflows"
        description="Keep multi-level approvals moving by surfacing pending steps, stakeholder responsibility, and the alerts attached to each route."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/dashboard/notifications">
                Alert inbox
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button disabled>
              <CheckCheck className="size-4" />
              Create workflow
            </Button>
          </>
        }
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <EdmsDataState
          isUsingFallbackData={data.isUsingFallbackData}
          message={data.statusMessage}
        />

        <section className="grid gap-4 md:grid-cols-2">
          <EdmsMetricCard metric={workflowMetric} />
          <EdmsMetricCard metric={notificationMetric} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <EdmsWorkflowQueue items={data.workflowQueue} />
          <EdmsNotificationList items={data.notifications} />
        </section>

        <section>
          <EdmsActivityFeed items={data.activity} />
        </section>
      </div>
    </div>
  );
}
