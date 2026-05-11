export interface AppearanceSettings {
  darkMode: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
}

export interface PrivacySettings {
  dataCollection: boolean;
}

export interface AppSettings {
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export type SettingsTab = "appearance" | "notifications" | "privacy";

export const DEFAULT_SETTINGS: AppSettings = {
  appearance: { darkMode: false },
  notifications: { enabled: true, soundEnabled: true },
  privacy: { dataCollection: true },
};
