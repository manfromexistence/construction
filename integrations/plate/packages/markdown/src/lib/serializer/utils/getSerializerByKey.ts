import { buildRules } from "../../rules/defaultRules";
import type { SerializeMdOptions } from "../serializeMd";

export const getSerializerByKey = (key: string, options: SerializeMdOptions) => {
  const nodes = options.rules;

  const rules = buildRules(options.editor!);

  return nodes?.[key]?.serialize === undefined ? rules[key]?.serialize : nodes?.[key]?.serialize;
};
