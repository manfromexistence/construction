import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { THEMES, type Theme } from "@/lib/themes";

type ThemesConfig = {
  activeTheme: Theme;
};
const configAtom = atomWithStorage<ThemesConfig>("themes:config4", {
  activeTheme: THEMES["default-shadcn"],
});

export function useThemesConfig() {
  const [themesConfig, setThemesConfig] = useAtom(configAtom);

  return { setThemesConfig, themesConfig };
}
