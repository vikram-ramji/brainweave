import { PlateEditor } from "platejs/react";

export function getPlainText(editor: PlateEditor) {
  return editor.children.map((_, n) => editor.api.string([n])).join("\n");
}
