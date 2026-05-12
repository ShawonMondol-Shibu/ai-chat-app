"use client";

import { memo } from "react";
import { type ContentType } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib";
import { CONTENT_TYPE_OPTIONS } from "@/constants";

interface ContentTypeSelectorProps {
  value: ContentType;
  onChange: (value: ContentType) => void;
  className?: string;
}

export const ContentTypeSelector = memo(function ContentTypeSelector({
  value,
  onChange,
  className,
}: ContentTypeSelectorProps) {
  const selectedOption = CONTENT_TYPE_OPTIONS.find(
    (opt) => opt.value === value,
  );
  const SelectedIcon = selectedOption?.icon;

  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as ContentType)}
    >
      <SelectTrigger
        className={cn(
          "w-fit sm:w-36 text-sm",
          className,
        )}
      >
        <div className="flex items-center gap-1 sm:gap-2">
          {SelectedIcon && (
            <SelectedIcon className="h-4 w-4 shrink-0 text-primary" />
          )}
          <span className="hidden sm:inline">
            <SelectValue placeholder="Select type" />
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {CONTENT_TYPE_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <SelectItem key={option.value} value={option.value} className="py-2">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  <span className="hidden sm:block text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
});
