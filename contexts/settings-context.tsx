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

  const updateAppearance = useCallback(
    (appearance: Partial<AppSettings["appearance"]>) => {
      setSettings((prev) => {
        const updated = {
          ...prev,
          appearance: { ...prev.appearance, ...appearance },
        };
        storageService.saveSettings(updated);
        return updated;
      });
    },
    [storageService],
  );

  const updateNotifications = useCallback(
    (notifications: Partial<AppSettings["notifications"]>) => {
      setSettings((prev) => {
        const updated = {
          ...prev,
          notifications: { ...prev.notifications, ...notifications },
        };
        storageService.saveSettings(updated);
        return updated;
      });
    },
    [storageService],
  );

  const updatePrivacy = useCallback(
    (privacy: Partial<AppSettings["privacy"]>) => {
      setSettings((prev) => {
        const updated = {
          ...prev,
          privacy: { ...prev.privacy, ...privacy },
        };
        storageService.saveSettings(updated);
        return updated;
      });
    },
    [storageService],
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
