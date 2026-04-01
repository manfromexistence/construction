import { asc } from "drizzle-orm";
import { EdmsPageHeader } from "@/components/edms/page-header";
import { EdmsStatusBadge, formatEdmsLabel } from "@/components/edms/status-badge";
import { Card } from "@/components/ui/card";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export default async function AdminUsersPage() {
  const sessionUser = await getRequiredDashboardSessionUser();

  if (sessionUser.role !== "admin") {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <EdmsPageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Admin", href: "/dashboard/admin" },
            { label: "Users" },
          ]}
          title="Admin access required"
          description="Only administrators can review system-wide user records."
        />
      </div>
    );
  }

  const users = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      role: userTable.role,
      organization: userTable.organization,
      isActive: userTable.isActive,
    })
    .from(userTable)
    .orderBy(asc(userTable.name));

  return (
    <div className="flex flex-1 flex-col">
      <EdmsPageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Users" },
        ]}
        title="Workspace users"
        description="Basic system-wide user listing for the admin area."
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-6 md:px-6 lg:px-8">
        <Card className="overflow-hidden">
          <div className="grid grid-cols-[1.2fr_1.2fr_0.8fr_1fr_0.8fr] gap-4 border-b px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Organization</span>
            <span>Status</span>
          </div>
          <div className="divide-y">
            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-[1.2fr_1.2fr_0.8fr_1fr_0.8fr] gap-4 px-6 py-4 text-sm"
              >
                <span className="font-medium">{user.name}</span>
                <span className="text-muted-foreground">{user.email}</span>
                <span>{formatEdmsLabel(user.role ?? "user")}</span>
                <span className="text-muted-foreground">{user.organization || "Unassigned"}</span>
                <div>
                  <EdmsStatusBadge status={user.isActive ? "active" : "archived"} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
