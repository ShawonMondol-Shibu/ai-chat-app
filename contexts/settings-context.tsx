"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { type AppSettings, DEFAULT_SETTINGS } from "@/types";
import { type StorageService } from "@/services";

interface SettingsContextValue {
  settings: AppSettings;
  updateAppearance: (appearance: Partial<AppSettings["appearance"]>) => void;
  updateNotifications: (
    notifications: Partial<AppSettings["notifications"]>,
  ) => void;
  updatePrivacy: (privacy: Partial<AppSettings["privacy"]>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

interface SettingsProviderProps {
  children: ReactNode;
  storageService: StorageService;
}

export function SettingsProvider({
  children,
  storageService,
}: SettingsProviderProps) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    storageService.getSettings().then((stored) => {
      setSettings(stored);
    });
  }, [storageService]);

  const persistSettings = useCallback(
    (updated: AppSettings) => {
      setSettings(updated);
      storageService.saveSettings(updated);
    },
    [storageService],
  );

  const updateAppearance = useCallback(
    (appearance: Partial<AppSettings["appearance"]>) => {
      persistSettings({
        ...settings,
        appearance: { ...settings.appearance, ...appearance },
      });
    },
    [settings, persistSettings],
  );

  const updateNotifications = useCallback(
    (notifications: Partial<AppSettings["notifications"]>) => {
      persistSettings({
        ...settings,
        notifications: { ...settings.notifications, ...notifications },
      });
    },
    [settings, persistSettings],
  );

  const updatePrivacy = useCallback(
    (privacy: Partial<AppSettings["privacy"]>) => {
      persistSettings({
        ...settings,
        privacy: { ...settings.privacy, ...privacy },
      });
    },
    [settings, persistSettings],
  );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateAppearance,
        updateNotifications,
        updatePrivacy,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettingsContext must be used within SettingsProvider");
  }
  return context;
}
