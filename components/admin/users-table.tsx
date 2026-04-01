"use client";

import { useState } from "react";
import { MoreHorizontal, Mail, Shield, Ban, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatEdmsLabel } from "@/components/edms/status-badge";

interface User {
  id: string;
  name: string;
  email: string;
  role: string | null;
  organization: string | null;
  jobTitle: string | null;
  department: string | null;
  phone: string | null;
  isActive: boolean | null;
  createdAt: Date;
}

export function AdminUsersTable({ users }: { users: User[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.organization?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        <CardDescription>
          Manage user accounts and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:max-w-xs"
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="pmc">PMC</SelectItem>
              <SelectItem value="vendor">Vendor</SelectItem>
              <SelectItem value="subcontractor">Subcontractor</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[70px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {formatEdmsLabel(user.role ?? "user")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{user.organization ?? "—"}</span>
                        {user.jobTitle && (
                          <span className="text-xs text-muted-foreground">{user.jobTitle}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="size-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <Ban className="size-3" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Mail className="size-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="size-4" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Ban className="size-4" />
                            {user.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
