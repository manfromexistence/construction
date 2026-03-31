import type { Value } from "@platejs/slate";
import { buildTestHarness } from "slate-test-utils";
import type { RenderEditorReturnTuple } from "slate-test-utils/dist/esm/buildTestHarness";

import type { AnyPluginConfig, InferPlugins } from "../../lib";

import { PlateTest } from "../components/PlateTest";
import {
  type CreatePlateEditorOptions,
  createPlateEditor,
  type PlateCorePlugin,
  type TPlateEditor,
} from "../editor";

/**
 * `buildTestHarness` where:
 *
 * - `Component`: `PlateTest`
 * - `editor`: `createPlateEditor`
 */
export const createPlateTestEditor = async <
  V extends Value = Value,
  P extends AnyPluginConfig = PlateCorePlugin,
>(
  options: CreatePlateEditorOptions<V, P>,
  buildTestHarnessOptions?: Omit<Parameters<ReturnType<typeof buildTestHarness>>[0], "editor">
): Promise<
  [TPlateEditor<V, InferPlugins<P[]>>, RenderEditorReturnTuple[1], RenderEditorReturnTuple[2]]
> =>
  buildTestHarness(PlateTest)({
    componentProps: {
      suppressInstanceWarning: true,
    },
    editor: createPlateEditor(options),
    ...buildTestHarnessOptions,
  } as any) as any;
