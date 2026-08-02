import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export function SectionHeader({
  title,
  accentText,
  className,
  actionLabel = "সব খবর",
  onAction,
}: {
  title: string;
  accentText?: string;
  className?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-3", className)}>
      <div className="flex items-center gap-2.5">
        <span className="h-6 w-1.5 rounded-sm bg-brand" aria-hidden />
        <h2 className="font-display text-xl tracking-tight sm:text-2xl">
          {title}
        </h2>
        {accentText && (
          <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
            {accentText}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onAction}
        className="group inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-brand hover:underline"
      >
        {actionLabel}
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
