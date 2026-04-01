import { redirect } from "next/navigation";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { EdmsPageHeader } from "@/components/edms/page-header";
import { Button } from "@/components/ui/button";
import { AdminUsersTable } from "@/components/admin/users-table";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { desc } from "drizzle-orm";

export default async function AdminUsersPage() {
  const sessionUser = await getRequiredDashboardSessionUser();

  if (sessionUser.role !== "admin") {
    redirect("/dashboard");
  }

  const users = await getAllUsers();

  return (
    <div className="flex flex-1 flex-col">
      <EdmsPageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Users" },
        ]}
        title="User Management"
        description="Manage user accounts, roles, and permissions across the system."
        actions={
          <Button asChild>
            <Link href="/dashboard/admin/users/invite">
              <UserPlus className="size-4" />
              Invite User
            </Link>
          </Button>
        }
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <AdminUsersTable users={users} />
      </div>
    </div>
  );
}

async function getAllUsers() {
  try {
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        jobTitle: user.jobTitle,
        department: user.department,
        phone: user.phone,
        isActive: user.isActive,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt));

    return users;
  } catch {
    return [];
  }
}
