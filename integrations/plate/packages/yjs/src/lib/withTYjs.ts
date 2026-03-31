import { withYjs, type YjsEditor } from "@slate-yjs/core";
import type { Operation, SlateEditor } from "platejs";
import type * as Y from "yjs";

export type WithYjsOptions = {
  /**
   * Whether to automatically connect to providers.
   *
   * @default false
   */
  autoConnect?: boolean;
  /** Origin used when applying local slate operations to yjs. */
  localOrigin?: unknown;
  /** Origin used when storing positions. */
  positionStorageOrigin?: unknown;
};

export type YjsEditorProps = {
  storeLocalChange: (op: Operation) => void;
} & Pick<
  YjsEditor,
  | "applyRemoteEvents"
  | "connect"
  | "disconnect"
  | "flushLocalChanges"
  | "isLocalOrigin"
  | "localOrigin"
  | "positionStorageOrigin"
  | "sharedRoot"
>;

export const withTYjs = (editor: SlateEditor, sharedRoot: Y.XmlText, options?: WithYjsOptions) =>
  withYjs(editor as any, sharedRoot, options) as SlateEditor & YjsEditorProps;
