import { Command } from "commander";
import { add } from "@/src/commands/registry/add";

export const registry = new Command()
  .name("registry")
  .description("manage registries")
  .addCommand(add);
