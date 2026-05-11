"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Bell, Shield, Palette } from "lucide-react";
import { AppearanceSettings } from "./appearance-settings";
import { NotificationSettings } from "./notification-settings";
import { PrivacySettings } from "./privacy-settings";
import { type SettingsTab } from "@/types";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: SettingsTab;
}

const TABS: { value: SettingsTab; label: string; icon: typeof Moon }[] = [
  { value: "appearance", label: "Appearance", icon: Palette },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "privacy", label: "Privacy", icon: Shield },
];

const TAB_COMPONENTS: Record<SettingsTab, React.ComponentType> = {
  appearance: AppearanceSettings,
  notifications: NotificationSettings,
  privacy: PrivacySettings,
};

export function SettingsDialog({
  open,
  onOpenChange,
  defaultTab = "appearance",
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your AI Chat experience
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value}>
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map(({ value }) => {
            const Component = TAB_COMPONENTS[value];
            return (
              <TabsContent key={value} value={value}>
                <Component />
              </TabsContent>
            );
          })}
        </Tabs>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
