import type { Descendant } from "platejs";

import type { MdRootContent } from "../mdast";
import type { MdDecoration } from "../types";
import { convertNodesDeserialize } from "./convertNodesDeserialize";
import type { DeserializeMdOptions } from "./deserializeMd";

export const convertChildrenDeserialize = (
  children: MdRootContent[],
  deco: MdDecoration,
  options: DeserializeMdOptions
): Descendant[] => {
  if (children.length === 0) {
    return [{ text: "" }];
  }

  return convertNodesDeserialize(children, deco, options);
};
