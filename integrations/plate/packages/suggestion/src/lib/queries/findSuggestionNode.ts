import {
  combineMatchOptions,
  type EditorNodesOptions,
  KEYS,
  type SlateEditor,
  TextApi,
  type TSuggestionText,
  type ValueOf,
} from "platejs";

export const findInlineSuggestionNode = <E extends SlateEditor>(
  editor: E,
  options: EditorNodesOptions<ValueOf<E>> = {}
) =>
  editor.api.node<TSuggestionText>({
    ...options,
    match: combineMatchOptions(
      editor,
      (n) => TextApi.isText(n) && (n as any)[KEYS.suggestion],
      options
    ),
  });
