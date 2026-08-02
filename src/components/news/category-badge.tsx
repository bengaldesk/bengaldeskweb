import { cn } from "@/lib/utils";
import { categoryColor, type NewsCategory } from "@/lib/news-data";

export function CategoryBadge({
  category,
  className,
  size = "sm",
}: {
  category: NewsCategory;
  className?: string;
  size?: "sm" | "xs";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm font-semibold uppercase tracking-wide text-white",
        categoryColor(category),
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-1.5 py-0.5 text-[10px]",
        className
      )}
    >
      {category}
    </span>
  );
}
