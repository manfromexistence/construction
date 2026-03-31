import { createSlateEditor } from "platejs";
import { AutoformatPlugin } from "../../AutoformatPlugin";
import type { AutoformatRule } from "../../types";

export const createAutoformatEditor = ({
  enableUndoOnDelete,
  plugins = [],
  rules,
  value,
}: {
  enableUndoOnDelete?: boolean;
  plugins?: any[];
  rules: AutoformatRule[];
  value: any;
}) =>
  createSlateEditor({
    plugins: [
      ...plugins,
      AutoformatPlugin.configure({
        options: {
          enableUndoOnDelete,
          rules,
        },
      }),
    ],
    value,
  } as any);
