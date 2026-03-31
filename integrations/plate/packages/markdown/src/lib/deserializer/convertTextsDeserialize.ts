import { getPluginType } from "platejs";

import type { MdDelete, MdEmphasis, MdStrong } from "../mdast";
import type { MdDecoration } from "../types";
import { mdastToPlate } from "../types";
import { buildSlateNode } from "./convertNodesDeserialize";
import type { DeserializeMdOptions } from "./deserializeMd";

export const convertTextsDeserialize = (
  mdastNode: MdDelete | MdEmphasis | MdStrong,
  deco: MdDecoration,
  options: DeserializeMdOptions
) =>
  mdastNode.children.reduce((acc: any, n: any) => {
    const key = mdastToPlate(options.editor!, mdastNode.type);
    const type = getPluginType(options.editor!, key);

    acc.push(...buildSlateNode(n, { ...deco, [type]: true }, options));
    return acc;
  }, []);
