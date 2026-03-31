import {
  type Editor,
  type EditorAboveOptions,
  type ElementOf,
  isDefined,
  KEYS,
  type NodeEntry,
} from "platejs";

export const getListAbove = <N extends ElementOf<E>, E extends Editor = Editor>(
  editor: E,
  options?: Omit<EditorAboveOptions, "match">
): NodeEntry<N> | undefined =>
  editor.api.above({
    ...options,
    match: (node) => isDefined(node[KEYS.listType]),
  });
