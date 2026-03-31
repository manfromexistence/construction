import { createAtomStore } from "platejs/react";
import type React from "react";

export const {
  ResizableProvider,
  resizableStore,
  useResizableSet,
  useResizableStore,
  useResizableValue,
} = createAtomStore(
  {
    width: 0 as React.CSSProperties["width"],
  },
  { name: "resizable" }
) as any;
