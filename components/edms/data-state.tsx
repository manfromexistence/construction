import { DatabaseZap } from "lucide-react";

export function EdmsDataState({
  isUsingFallbackData,
  message,
}: {
  isUsingFallbackData: boolean;
  message: string | null;
}) {
  if (!isUsingFallbackData || !message) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
        <DatabaseZap className="size-4" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">Live EDMS data is not ready yet</p>
        <p className="leading-6 text-amber-900/80 dark:text-amber-100/80">{message}</p>
      </div>
    </div>
  );
}
