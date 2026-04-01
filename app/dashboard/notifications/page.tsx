import { ArrowRight, BellRing } from "lucide-react";
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

export default async function NotificationsPage() {
  const sessionUser = await getRequiredDashboardSessionUser();
  const data = await getEdmsDashboardData(sessionUser);
  const [, , workflowMetric, , notificationMetric] = data.metrics;

  return (
    <div className="flex flex-1 flex-col">
      <EdmsPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Notifications" }]}
        title="Notification inbox"
        description="Centralize unread approvals, review requests, and formal package updates so the project team can respond without context switching."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/dashboard/workflows">
                Pending workflows
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button disabled>
              <BellRing className="size-4" />
              Notification preferences
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
          <EdmsMetricCard metric={notificationMetric} />
          <EdmsMetricCard metric={workflowMetric} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <EdmsNotificationList items={data.notifications} />
          <EdmsWorkflowQueue items={data.workflowQueue} />
        </section>

        <section>
          <EdmsActivityFeed items={data.activity} />
        </section>
      </div>
    </div>
  );
}
