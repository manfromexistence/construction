"use client";

import { CodeDrawingPlugin } from "@platejs/code-drawing/react";
import { Plate, usePlateEditor } from "platejs/react";
import * as React from "react";

import { EditorKit } from "@/registry/components/editor/editor-kit";
import { codeDrawingValue } from "@/registry/examples/values/code-drawing-value";
import { CodeDrawingElement } from "@/registry/ui/code-drawing-node";
import { Editor, EditorContainer } from "@/registry/ui/editor";

export default function CodeDrawingDemo() {
  const editor = usePlateEditor({
    plugins: [...EditorKit, CodeDrawingPlugin.withComponent(CodeDrawingElement)],
    value: codeDrawingValue,
  });

  return (
    <Plate editor={editor}>
      <EditorContainer variant="demo">
        <Editor />
      </EditorContainer>
    </Plate>
  );
}
