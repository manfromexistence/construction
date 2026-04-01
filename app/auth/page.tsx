"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";

export default function AuthPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { openAuthDialog } = useAuthStore();

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      // User is already authenticated, redirect to dashboard
      router.push("/dashboard");
    } else {
      // User is not authenticated, open auth dialog
      openAuthDialog("signup");
    }
  }, [session, isPending, router, openAuthDialog]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
