import { type Descendant, ElementApi, type SlateEditor } from "platejs";

import { getListTypes } from "./getListTypes";

export const isListRoot = (editor: SlateEditor, node: Descendant): boolean =>
  ElementApi.isElement(node) && getListTypes(editor).includes(node.type);
