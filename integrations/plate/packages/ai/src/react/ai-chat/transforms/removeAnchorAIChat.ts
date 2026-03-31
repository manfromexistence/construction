import { ElementApi, getPluginType, KEYS, type RemoveNodesOptions } from "platejs";
import type { PlateEditor } from "platejs/react";

export const removeAnchorAIChat = (editor: PlateEditor, options?: RemoveNodesOptions) => {
  editor.tf.withoutSaving(() => {
    editor.tf.removeNodes({
      at: [],
      match: (n) => ElementApi.isElement(n) && n.type === getPluginType(editor, KEYS.aiChat),
      ...options,
    });
  });
};
