"use client";

import { motion } from "framer-motion";

interface QuickStartCardProps {
  icon: string;
  title: string;
  description: string;
}

export function QuickStartCard({ icon, title, description }: QuickStartCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
    >
      <div className="mb-2 text-xl">{icon}</div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </motion.div>
  );
}
