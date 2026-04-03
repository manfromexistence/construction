"use client";

import {
  BellRing,
  Building2,
  FileStack,
  FolderKanban,
  LayoutDashboard,
  Send,
  Settings,
  Sparkles,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DashboardUser } from "@/lib/edms/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../ui/sidebar";
import { formatEdmsLabel } from "./status-badge";

const PRIMARY_NAVIGATION = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { title: "Documents", href: "/dashboard/documents", icon: FileStack },
  { title: "Workflows", href: "/dashboard/workflows", icon: Workflow },
  { title: "Transmittals", href: "/dashboard/transmittals", icon: Send },
  { title: "Notifications", href: "/dashboard/notifications", icon: BellRing },
] as const;

const ADMIN_NAVIGATION = [
  { title: "Admin Dashboard", href: "/dashboard/admin", icon: Settings },
  { title: "Users", href: "/dashboard/admin/users", icon: Building2 },
] as const;

const SECONDARY_NAVIGATION = [
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Theme Studio", href: "/editor/theme", icon: Sparkles },
] as const;

export function EdmsDashboardSidebar({ user }: { user: DashboardUser }) {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarHeader className="gap-3 border-b border-sidebar-border/80 px-3 py-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-2xl border border-sidebar-border/80 bg-sidebar-accent/40 p-3"
        >
          <div className="flex size-10 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <Building2 className="size-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="truncate font-semibold">QUADRA</p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              Project delivery control room
            </p>
          </div>
        </Link>
        <div className="flex flex-wrap gap-2 px-1">
          <Badge variant="secondary" className="rounded-full">
            {formatEdmsLabel(user.role)}
          </Badge>
          {user.organization ? (
            <Badge variant="outline" className="rounded-full border-sidebar-border">
              {user.organization}
            </Badge>
          ) : null}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PRIMARY_NAVIGATION.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isNavItemActive(pathname, item.href)}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user.role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ADMIN_NAVIGATION.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isNavItemActive(pathname, item.href)}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SECONDARY_NAVIGATION.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isNavItemActive(pathname, item.href)}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/80 p-3">
        <div className="rounded-2xl border border-sidebar-border/80 bg-sidebar-accent/40 p-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border border-sidebar-border/80">
              <AvatarImage src={user.image ?? ""} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-sidebar-foreground/70">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-3 w-full justify-start border-sidebar-border bg-transparent"
            asChild
          >
            <Link href="/settings">
              <Settings className="size-4" />
              Account settings
            </Link>
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function isNavItemActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
