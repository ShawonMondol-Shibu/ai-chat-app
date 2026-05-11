"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

export function PrivacySettings() {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center gap-3">
        <User className="h-5 w-5 text-primary" />
        <div>
          <Label className="font-medium">Data & Privacy</Label>
          <p className="text-xs text-muted-foreground">
            Manage your data and privacy settings
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="w-full">
        View Privacy Policy
      </Button>
    </div>
  );
}
