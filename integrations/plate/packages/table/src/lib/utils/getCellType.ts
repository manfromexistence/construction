import { getPluginTypes, KEYS, type SlateEditor } from "platejs";

/** Get td and th types */
export const getCellTypes = (editor: SlateEditor) => getPluginTypes(editor, [KEYS.td, KEYS.th]);
