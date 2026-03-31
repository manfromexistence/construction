import { KEYS, type SlateEditor } from "platejs";

export const someToggle = (editor: SlateEditor) =>
  !!editor.selection &&
  editor.api.some({
    match: (n: any) => n.type === KEYS.toggle,
  });
