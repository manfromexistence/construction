import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export interface DashboardSessionUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  organization: string | null;
}

export async function getRequiredDashboardSessionUser(): Promise<DashboardSessionUser> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/");
  }

  const user = session.user as Record<string, unknown>;

  return {
    id: String(user.id),
    name: typeof user.name === "string" && user.name.length > 0 ? user.name : "Construction User",
    email: typeof user.email === "string" ? user.email : "",
    image: typeof user.image === "string" ? user.image : null,
    role: typeof user.role === "string" && user.role.length > 0 ? user.role : "user",
    organization:
      typeof user.organization === "string" && user.organization.length > 0
        ? user.organization
        : null,
  };
}
