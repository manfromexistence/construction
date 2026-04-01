import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  approved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  acknowledged: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  draft: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300",
  pending: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  submitted: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  in_progress: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  under_review: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  sent: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  "on-hold": "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  rejected: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  cancelled: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  archived: "border-zinc-500/30 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
  unread: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
};

export function EdmsStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-medium tracking-[0.14em] uppercase",
        STATUS_STYLES[status] ??
          "border-border bg-muted/60 text-muted-foreground dark:text-muted-foreground"
      )}
    >
      {formatEdmsLabel(status)}
    </Badge>
  );
}

export function formatEdmsLabel(value: string | null | undefined) {
  if (!value) {
    return "Unassigned";
  }

  if (value.toLowerCase() === "pmc") {
    return "PMC";
  }

  return value
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
