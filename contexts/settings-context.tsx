"use client";

import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type AppSettings, DEFAULT_SETTINGS } from "@/types";
import { type SettingsStorageService } from "@/services";

interface SettingsContextValue {
  settings: AppSettings;
  isLoading: boolean;
  updateAppearance: (appearance: Partial<AppSettings["appearance"]>) => void;
  updateNotifications: (
    notifications: Partial<AppSettings["notifications"]>,
  ) => void;
  updatePrivacy: (privacy: Partial<AppSettings["privacy"]>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

interface SettingsProviderProps {
  children: ReactNode;
  storageService: SettingsStorageService;
}

export function SettingsProvider({
  children,
  storageService,
}: SettingsProviderProps) {
  const queryClient = useQueryClient();

  const { data: settings = DEFAULT_SETTINGS, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => storageService.getSettings(),
  });

  const saveMutation = useMutation({
    mutationFn: (updated: AppSettings) => storageService.saveSettings(updated),
    onSuccess: (_, updated) => {
      queryClient.setQueryData(["settings"], updated);
    },
  });

  const updateAppearance = useCallback(
    (appearance: Partial<AppSettings["appearance"]>) => {
      const updated = { ...settings, appearance: { ...settings.appearance, ...appearance } };
      queryClient.setQueryData(["settings"], updated);
      saveMutation.mutate(updated);
    },
    [settings, queryClient, saveMutation],
  );

  const updateNotifications = useCallback(
    (notifications: Partial<AppSettings["notifications"]>) => {
      const updated = { ...settings, notifications: { ...settings.notifications, ...notifications } };
      queryClient.setQueryData(["settings"], updated);
      saveMutation.mutate(updated);
    },
    [settings, queryClient, saveMutation],
  );

  const updatePrivacy = useCallback(
    (privacy: Partial<AppSettings["privacy"]>) => {
      const updated = { ...settings, privacy: { ...settings.privacy, ...privacy } };
      queryClient.setQueryData(["settings"], updated);
      saveMutation.mutate(updated);
    },
    [settings, queryClient, saveMutation],
  );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
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
