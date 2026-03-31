import { type Ancestor, match, type SlateEditor } from "platejs";

import { getListTypes } from "./getListTypes";

/** Is there a list child in the node. */
export const hasListChild = (editor: SlateEditor, node: Ancestor) =>
  node.children.some((n) => match(n, [], { type: getListTypes(editor) }));
