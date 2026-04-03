import type { DashboardUser } from "@/lib/edms/dashboard";
import { DashboardHeader } from "../dashboard/dashboard-header";
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
      <SidebarInset className="bg-background">
        <DashboardHeader userName={user.name} userEmail={user.email} userRole={user.role} />
        <div className="flex min-h-[calc(100vh-4rem)] flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
