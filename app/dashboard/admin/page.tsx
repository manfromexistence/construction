import { redirect } from "next/navigation";
import { Users, Building2, FileStack, Activity, Shield, Database } from "lucide-react";
import Link from "next/link";
import { EdmsPageHeader } from "@/components/edms/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";
import { db } from "@/lib/db";
import { user, projects, documents, activityLog } from "@/db/schema";
import { count, sql } from "drizzle-orm";

export default async function AdminDashboardPage() {
  const sessionUser = await getRequiredDashboardSessionUser();

  if (sessionUser.role !== "admin") {
    redirect("/dashboard");
  }

  const stats = await getAdminStats();

  return (
    <div className="flex flex-1 flex-col">
      <EdmsPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Admin" }]}
        title="System Administration"
        description="Manage users, monitor system activity, and configure EDMS settings."
        actions={
          <Button asChild>
            <Link href="/dashboard/admin/users">
              <Users className="size-4" />
              Manage Users
            </Link>
          </Button>
        }
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeUsers} active users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Building2 className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeProjects} active projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileStack className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDocuments}</div>
              <p className="text-xs text-muted-foreground">
                Across all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Activity</CardTitle>
              <Activity className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentActivity}</div>
              <p className="text-xs text-muted-foreground">
                Actions in last 24h
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/dashboard/admin/users">
                  <Users className="size-4" />
                  View All Users
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/dashboard/admin/roles">
                  <Shield className="size-4" />
                  Manage Roles & Permissions
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Configure system settings and integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/dashboard/admin/settings">
                  <Database className="size-4" />
                  System Settings
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/dashboard/admin/activity">
                  <Activity className="size-4" />
                  Activity Logs
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
            <CardDescription>
              Overview of user roles across the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.roleDistribution.map((role) => (
                <div key={role.role} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary" />
                    <span className="text-sm font-medium capitalize">{role.role}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{role.count} users</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

async function getAdminStats() {
  try {
    const [
      totalUsersResult,
      activeUsersResult,
      totalProjectsResult,
      activeProjectsResult,
      totalDocumentsResult,
      recentActivityResult,
      roleDistributionResult,
    ] = await Promise.all([
      db.select({ count: count() }).from(user),
      db
        .select({ count: count() })
        .from(user)
        .where(sql`${user.isActive} = true`),
      db.select({ count: count() }).from(projects),
      db
        .select({ count: count() })
        .from(projects)
        .where(sql`${projects.status} = 'active'`),
      db.select({ count: count() }).from(documents),
      db
        .select({ count: count() })
        .from(activityLog)
        .where(sql`${activityLog.createdAt} > NOW() - INTERVAL '24 hours'`),
      db
        .select({
          role: user.role,
          count: count(),
        })
        .from(user)
        .groupBy(user.role),
    ]);

    return {
      totalUsers: totalUsersResult[0]?.count ?? 0,
      activeUsers: activeUsersResult[0]?.count ?? 0,
      totalProjects: totalProjectsResult[0]?.count ?? 0,
      activeProjects: activeProjectsResult[0]?.count ?? 0,
      totalDocuments: totalDocumentsResult[0]?.count ?? 0,
      recentActivity: recentActivityResult[0]?.count ?? 0,
      roleDistribution: roleDistributionResult.map((r) => ({
        role: r.role ?? "user",
        count: r.count,
      })),
    };
  } catch {
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalProjects: 0,
      activeProjects: 0,
      totalDocuments: 0,
      recentActivity: 0,
      roleDistribution: [],
    };
  }
}
