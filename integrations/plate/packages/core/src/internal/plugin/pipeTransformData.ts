import type { SlateEditor } from "../../lib/editor";
import { getEditorPlugin } from "../../lib/plugin";
import type { ParserOptions } from "../../lib/plugin/BasePlugin";
import type { AnyEditorPlugin } from "../../lib/plugin/SlatePlugin";

/** Pipe editor.tf.insertData.transformData */
export const pipeTransformData = (
  editor: SlateEditor,
  plugins: Partial<AnyEditorPlugin>[],
  { data, ...options }: ParserOptions
) => {
  plugins.forEach((p) => {
    const transformData = p.parser?.transformData;

    if (!transformData) return;

    data = transformData({
      ...getEditorPlugin(editor, p as any),
      data,
      ...options,
    });
  });

  return data;
};
