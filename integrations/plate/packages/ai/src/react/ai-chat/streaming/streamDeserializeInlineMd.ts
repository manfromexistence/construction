import { type DeserializeMdOptions, MarkdownPlugin } from "@platejs/markdown";
import type { PlateEditor } from "platejs/react";

export const streamDeserializeInlineMd = (
  editor: PlateEditor,
  text: string,
  options?: DeserializeMdOptions
) => editor.getApi(MarkdownPlugin).markdown.deserializeInline(text, options);
