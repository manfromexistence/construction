"use client";

import { KEYS } from "platejs";
import { getEditorPlugin, type RenderNodeWrapperProps } from "platejs/react";
import React from "react";

import type { CopilotPluginConfig } from "./CopilotPlugin";

export const renderCopilotBelowNodes = ({
  editor,
}: RenderNodeWrapperProps<CopilotPluginConfig>) => {
  const copilot = getEditorPlugin<CopilotPluginConfig>(editor, {
    key: KEYS.copilot,
  });

  const { renderGhostText: GhostText } = copilot.getOptions();

  if (!GhostText) return;

  return ({ children }: { children: React.ReactNode }) => (
    <>
      {children}

      <GhostText />
    </>
  );
};
