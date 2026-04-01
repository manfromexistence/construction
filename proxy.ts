import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import { API_AUTH_PREFIX, DEFAULT_LOGIN_REDIRECT } from "./routes";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const pathname = request.nextUrl.pathname;

  const isApiAuth = pathname.startsWith(API_AUTH_PREFIX);

  if (isApiAuth) {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
  }

  if (pathname === "/settings") {
    return NextResponse.redirect(new URL("/settings/themes", request.url));
  }

  if (pathname.startsWith("/dashboard") && isEdmsProfileIncomplete(session.user)) {
    return NextResponse.redirect(new URL("/settings/account?onboarding=1", request.url));
  }

  return NextResponse.next();
}

function isEdmsProfileIncomplete(user: Record<string, unknown>) {
  const role = typeof user.role === "string" ? user.role : "user";
  const organization = typeof user.organization === "string" ? user.organization : "";
  const jobTitle = typeof user.jobTitle === "string" ? user.jobTitle : "";
  const department = typeof user.department === "string" ? user.department : "";

  return (
    role === "user" ||
    organization.trim().length === 0 ||
    jobTitle.trim().length === 0 ||
    department.trim().length === 0
  );
}

export const config = {
  matcher: ["/editor/theme/:path*", "/dashboard/:path*", "/settings/:path*", "/success"],
};
