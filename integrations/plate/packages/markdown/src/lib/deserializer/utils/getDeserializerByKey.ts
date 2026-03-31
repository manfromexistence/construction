import { buildRules } from "../../rules/defaultRules";
import type { DeserializeMdOptions } from "../deserializeMd";

export const getDeserializerByKey = (key: string, options: DeserializeMdOptions) => {
  const rules = options.rules;

  return rules?.[key]?.deserialize === undefined
    ? buildRules(options.editor!)[key]?.deserialize
    : rules?.[key]?.deserialize;
};
