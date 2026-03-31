"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  React.useEffect(() => {
    // Sync initial theme to cookie
    const theme = localStorage.getItem("theme") || "system";
    document.cookie = `theme=${theme};path=/;max-age=31536000`;
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
