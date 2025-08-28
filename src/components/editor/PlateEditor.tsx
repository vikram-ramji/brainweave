"use client";

import { Plate, PlatePlugin, TPlateEditor } from "platejs/react";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { Value } from "platejs";
import { getPlainText } from "./utils";

interface PlateEditorProps {
  editor: TPlateEditor<Value, PlatePlugin>;
  onChange: (newContent: Value, textContent: string) => void;
}

export default function PlateEditor({ editor, onChange }: PlateEditorProps) {
  // TODO: Integrate more functionality, for reference use platejs.org
  return (
    <Plate
      editor={editor}
      onChange={({ value }) => {
        const textContent = getPlainText(editor);
        onChange(value, textContent);
      }}
    >
      <EditorContainer>
        <Editor placeholder="Start typing, or type '/' to choose a different content type" />
      </EditorContainer>
    </Plate>
  );
}
