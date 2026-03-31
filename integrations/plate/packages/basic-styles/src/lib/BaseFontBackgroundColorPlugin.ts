import { createSlatePlugin, KEYS, type SlateEditor } from "platejs";

export const BaseFontBackgroundColorPlugin = createSlatePlugin({
  key: KEYS.backgroundColor,
  inject: {
    nodeProps: {
      nodeKey: "backgroundColor",
    },
  },
  parsers: {
    html: {
      deserializer: {
        isLeaf: true,
        rules: [
          {
            validStyle: {
              backgroundColor: "*",
            },
          },
        ],
        parse: ({ element, type }: { element: HTMLElement; type: string }) => ({
          [type]: element.style.backgroundColor,
        }),
      },
    },
  },
}).extendTransforms(({ editor }: { editor: SlateEditor }) => ({
  addMark: (value: string) => {
    editor.tf.addMarks({
      [KEYS.backgroundColor]: value,
    });
  },
}));
