import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export default function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-black/20 p-4 shadow-2xl shadow-black/20 backdrop-blur-lg transition-all duration-300 hover:border-white/20 hover:bg-black/30",
        className
      )}
    >
      {children}
    </div>
  );
}
