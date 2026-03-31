#! /usr/bin/env node

import { program } from "commander";
import { add } from "@/commands/add";
import { init } from "@/commands/init";
import { description, name, version } from "../package.json";

function main() {
  program.version(version).name(name).description(description).addCommand(init).addCommand(add);

  program.parse();
}

main();
