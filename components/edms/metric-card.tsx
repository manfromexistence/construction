import {
  BellRing,
  Building2,
  FileStack,
  GitPullRequestArrow,
  type LucideIcon,
  Send,
} from "lucide-react";
import type { DashboardMetric } from "@/lib/edms/dashboard";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const ICONS: Record<DashboardMetric["icon"], LucideIcon> = {
  projects: Building2,
  documents: FileStack,
  reviews: GitPullRequestArrow,
  transmittals: Send,
  notifications: BellRing,
};

const SURFACE_STYLES: Record<DashboardMetric["tone"], string> = {
  amber: "border-amber-500/15 bg-gradient-to-br from-amber-500/12 via-transparent to-transparent",
  blue: "border-blue-500/15 bg-gradient-to-br from-blue-500/12 via-transparent to-transparent",
  emerald:
    "border-emerald-500/15 bg-gradient-to-br from-emerald-500/12 via-transparent to-transparent",
  rose: "border-rose-500/15 bg-gradient-to-br from-rose-500/12 via-transparent to-transparent",
  slate: "border-slate-500/15 bg-gradient-to-br from-slate-500/12 via-transparent to-transparent",
};

const ICON_SURFACES: Record<DashboardMetric["tone"], string> = {
  amber: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  blue: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  rose: "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  slate: "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
};

const TOP_BARS: Record<DashboardMetric["tone"], string> = {
  amber: "from-transparent via-amber-500/60 to-transparent",
  blue: "from-transparent via-blue-500/60 to-transparent",
  emerald: "from-transparent via-emerald-500/60 to-transparent",
  rose: "from-transparent via-rose-500/60 to-transparent",
  slate: "from-transparent via-slate-500/60 to-transparent",
};

export function EdmsMetricCard({ metric }: { metric: DashboardMetric }) {
  const Icon = ICONS[metric.icon];

  return (
    <Card
      className={cn(
        "relative overflow-hidden bg-card/95 backdrop-blur",
        SURFACE_STYLES[metric.tone]
      )}
    >
      <div
        className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r", TOP_BARS[metric.tone])}
      />
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <CardDescription className="text-[11px] font-semibold tracking-[0.22em] uppercase">
              {metric.label}
            </CardDescription>
            <CardTitle className="text-3xl tracking-tight">{metric.value}</CardTitle>
          </div>
          <div
            className={cn(
              "flex size-11 items-center justify-center rounded-2xl border shadow-sm",
              ICON_SURFACES[metric.tone]
            )}
          >
            <Icon className="size-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm leading-6 text-muted-foreground">{metric.description}</p>
      </CardContent>
    </Card>
  );
}
