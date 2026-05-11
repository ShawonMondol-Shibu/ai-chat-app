"use client";

import { memo } from "react";
import { useSettingsContext } from "@/contexts";
import { SettingRow } from "./setting-row";
import { Moon } from "lucide-react";
import { useTheme } from "next-themes";

export const AppearanceSettings = memo(function AppearanceSettings() {
  const { settings, updateAppearance } = useSettingsContext();
  const { setTheme } = useTheme();

  const handleDarkModeToggle = (checked: boolean) => {
    updateAppearance({ darkMode: checked });
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="space-y-4">
      <SettingRow
        icon={Moon}
        id="dark-mode"
        label="Dark Mode"
        description="Toggle dark theme"
        checked={settings.appearance.darkMode}
        onCheckedChange={handleDarkModeToggle}
      />
    </div>
  );
});
