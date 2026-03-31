import { type WithYHistoryOptions, withYHistory, type YjsEditor } from "@slate-yjs/core";
import type { SlateEditor } from "platejs";
import type * as Y from "yjs";

import type { YjsEditorProps } from "./withTYjs";

export type YHistoryEditor = {
  undoManager: Y.UndoManager;
  withoutSavingOrigin: unknown;
  redo: () => void;
  undo: () => void;
} & YjsEditor;

export type YHistoryEditorProps = Pick<
  YHistoryEditor,
  "redo" | "undo" | "undoManager" | "withoutSavingOrigin"
> &
  YjsEditorProps;

export const withTYHistory = (editor: SlateEditor, options?: WithYHistoryOptions) =>
  withYHistory(editor as any, options) as SlateEditor & YHistoryEditorProps & YjsEditorProps;
