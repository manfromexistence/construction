"use client";

import { Provider as JotaiProvider } from "jotai";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
        enableColorScheme
        enableSystem
      >
        <DndProvider backend={HTML5Backend}>{children}</DndProvider>
      </ThemeProvider>
    </JotaiProvider>
  );
}
