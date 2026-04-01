import type { DashboardUser } from "@/lib/edms/dashboard";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { EdmsDashboardSidebar } from "./dashboard-sidebar";

export function EdmsDashboardShell({
  user,
  children,
}: {
  user: DashboardUser;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <EdmsDashboardSidebar user={user} />
      <SidebarInset className="bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.10),transparent_24%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_28%)]">
        <div className="flex min-h-svh flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
