import { type Editor, isDefined, KEYS, type NodeEntry } from "platejs";

/** Unset listStyle, listStart if KEYS.indent is not defined. */
export const normalizeListNotIndented = (editor: Editor, [node, path]: NodeEntry) => {
  if (!isDefined(node[KEYS.indent]) && (node[KEYS.listType] || node[KEYS.listStart])) {
    editor.tf.unsetNodes([KEYS.listType, KEYS.listStart], {
      at: path,
    });

    return true;
  }
};
