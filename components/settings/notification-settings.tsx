"use client";

import { memo } from "react";
import { useSettingsContext } from "@/contexts";
import { SettingRow } from "./setting-row";
import { Bell, Volume2 } from "lucide-react";

export const NotificationSettings = memo(function NotificationSettings() {
  const { settings, updateNotifications } = useSettingsContext();

  return (
    <div className="space-y-4">
      <SettingRow
        icon={Bell}
        id="notifications"
        label="Enable Notifications"
        description="Receive updates and alerts"
        checked={settings.notifications.enabled}
        onCheckedChange={(checked) => updateNotifications({ enabled: checked })}
      />
      <SettingRow
        icon={Volume2}
        id="sound"
        label="Sound Effects"
        description="Play sounds for messages"
        checked={settings.notifications.soundEnabled}
        onCheckedChange={(checked) =>
          updateNotifications({ soundEnabled: checked })
        }
      />
    </div>
  );
});
