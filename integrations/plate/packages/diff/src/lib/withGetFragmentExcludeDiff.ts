import cloneDeep from "lodash/cloneDeep.js";
import type { Descendant, OverrideEditor } from "platejs";

export const withGetFragmentExcludeDiff: OverrideEditor = ({ api: { getFragment } }) => ({
  api: {
    getFragment() {
      const fragment = cloneDeep(getFragment());

      const removeDiff = (node: Descendant) => {
        if ("diff" in node) node.diff = undefined;
        if ("diffOperation" in node) node.diffOperation = undefined;
        if ("children" in node) (node.children as Descendant[]).forEach(removeDiff);
      };

      fragment.forEach(removeDiff);

      return fragment;
    },
  },
});
