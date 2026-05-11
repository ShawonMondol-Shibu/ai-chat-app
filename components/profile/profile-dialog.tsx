"use client";

import { memo } from "react";
import { type User } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Mail, User as UserIcon, Calendar } from "lucide-react";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSignOut: () => void;
}

export const ProfileDialog = memo(function ProfileDialog({
  open,
  onOpenChange,
  user,
  onSignOut,
}: ProfileDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>Your account information</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-20 w-20 rounded-full">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="text-sm font-medium">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Member since</p>
              <p className="text-sm font-medium">January 2025</p>
            </div>
          </div>
        </div>

        <div className="mt-2 flex justify-between gap-2">
          <Button
            variant="destructive"
            onClick={() => {
              onSignOut();
              onOpenChange(false);
            }}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
