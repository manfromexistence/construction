import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { UnauthorizedError } from "@/types/errors";

export const EDMS_ROLE_ORDER = [
  "user",
  "subcontractor",
  "vendor",
  "pmc",
  "client",
  "admin",
] as const;

export type EdmsRole = (typeof EDMS_ROLE_ORDER)[number];

const ROLE_RANK = Object.fromEntries(EDMS_ROLE_ORDER.map((role, index) => [role, index])) as Record<
  EdmsRole,
  number
>;

export interface EdmsAccessUser {
  id: string;
  role: EdmsRole;
}

export async function requireEdmsRole(
  minimumRole: EdmsRole,
  options?: { redirectTo?: string }
): Promise<EdmsAccessUser> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    if (options?.redirectTo) {
      redirect(options.redirectTo);
    }

    throw new UnauthorizedError();
  }

  const role = normalizeEdmsRole((session.user as Record<string, unknown>).role);

  if (ROLE_RANK[role] < ROLE_RANK[minimumRole]) {
    if (options?.redirectTo) {
      redirect(options.redirectTo);
    }

    throw new UnauthorizedError("Insufficient permissions");
  }

  return {
    id: session.user.id,
    role,
  };
}

export function canManageEdmsContent(role: string | null | undefined) {
  return ROLE_RANK[normalizeEdmsRole(role)] >= ROLE_RANK.vendor;
}

export function hasEdmsRoleAtLeast(role: string | null | undefined, minimumRole: EdmsRole) {
  return ROLE_RANK[normalizeEdmsRole(role)] >= ROLE_RANK[minimumRole];
}

export function normalizeEdmsRole(role: unknown): EdmsRole {
  if (typeof role !== "string") {
    return "user";
  }

  const normalized = role.toLowerCase() as EdmsRole;
  return normalized in ROLE_RANK ? normalized : "user";
}
