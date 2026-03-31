import type { Editor, NodeEntry } from "platejs";

import { KEYS } from "platejs";

import { ListStyleType } from "../types";
import { indentList, indentTodo, type ListOptions } from "./indentList";

/** Set indent list if not set. */
export const toggleListSet = (
  editor: Editor,
  [node, _path]: NodeEntry,
  { listStyleType = ListStyleType.Disc, ...options }: ListOptions
) => {
  if (Object.hasOwn(node, KEYS.listChecked) || node[KEYS.listType]) return;
  if (listStyleType === "todo") {
    indentTodo(editor as any, {
      listStyleType,
      ...options,
    });
  } else {
    indentList(editor as any, {
      listStyleType,
      ...options,
    });
  }

  return true;
};
