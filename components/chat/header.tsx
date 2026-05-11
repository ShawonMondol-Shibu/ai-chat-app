"use client";

import { type User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { LogOut, Settings, User as UserIcon, Sparkles } from "lucide-react";
import { fadeInDown, transitionSlow } from "@/constants";

interface HeaderProps {
  user?: User | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onSettings?: () => void;
}

export function Header({ user, onSignIn, onSignOut, onSettings }: HeaderProps) {
  return (
    <motion.header
      initial={fadeInDown.initial}
      animate={fadeInDown.animate}
      transition={transitionSlow}
      className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-lg"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
          AI Chat
        </span>
      </div>

      <nav className="hidden items-center gap-6 md:flex">
        <a
          href="#"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </a>
      </nav>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-10 w-10 cursor-pointer rounded-full">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSettings}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={onSignIn} className="bg-primary hover:bg-primary/90">
          Sign In
        </Button>
      )}
    </motion.header>
  );
}
