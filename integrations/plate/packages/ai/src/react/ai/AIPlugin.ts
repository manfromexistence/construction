import type { ExtendConfig } from "platejs";

import { toPlatePlugin } from "platejs/react";

import { BaseAIPlugin, type BaseAIPluginConfig } from "../../lib";

export type AIPluginConfig = ExtendConfig<BaseAIPluginConfig>;

export const AIPlugin = toPlatePlugin(BaseAIPlugin);
