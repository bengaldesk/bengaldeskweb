import Link from "next/link";
import { cn } from "@/lib/utils";
import { Clock, Eye } from "lucide-react";
import type { NewsItem } from "@/lib/news-data";
import { relativeTimeBn, toBn } from "@/lib/bn";
import { CategoryBadge } from "./category-badge";
import { NewsImage } from "./news-image";

type Variant = "hero" | "feature" | "horizontal" | "overlay" | "text";

function Meta({
  item,
  className,
  showAuthor,
}: {
  item: NewsItem;
  className?: string;
  showAuthor?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground",
        className
      )}
    >
      {showAuthor && (
        <span className="font-medium text-foreground/80">{item.author}</span>
      )}
      <span className="inline-flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {relativeTimeBn(new Date(item.publishedAt))}
      </span>
      <span className="inline-flex items-center gap-1">
        <Eye className="h-3 w-3" />
        {toBn(item.views.toLocaleString("en-US"))}
      </span>
      <span className="hidden sm:inline">{toBn(item.readTime)} মিনিট পড়ুন</span>
    </div>
  );
}

export function NewsCard({
  item,
  variant = "feature",
  className,
  priority,
}: {
  item: NewsItem;
  variant?: Variant;
  className?: string;
  priority?: boolean;
}) {
  const href = `/#${item.id}`;

  if (variant === "hero") {
    return (
      <Link
        href={href}
        className={cn(
          "group relative block overflow-hidden rounded-xl bg-muted news-shadow",
          className
        )}
      >
        <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
          <NewsImage
            src={item.image}
            alt={item.title}
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="img-zoom"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
          <CategoryBadge category={item.category} />
          <h2 className="font-display mt-2.5 text-balance text-2xl leading-tight text-white sm:text-3xl md:text-4xl">
            {item.title}
          </h2>
          <p className="mt-2 hidden max-w-3xl text-sm text-white/80 sm:line-clamp-2 sm:text-base">
            {item.excerpt}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/80">
            <span className="font-medium">{item.author}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {relativeTimeBn(new Date(item.publishedAt))}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {toBn(item.views.toLocaleString("en-US"))}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "feature") {
    return (
      <Link
        href={href}
        className={cn(
          "group flex flex-col overflow-hidden rounded-lg border border-border/70 bg-card transition-colors hover:border-brand/40",
          className
        )}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <NewsImage
            src={item.image}
            alt={item.title}
            sizes="(max-width: 640px) 50vw, 33vw"
            className="img-zoom"
          />
          <div className="absolute left-2 top-2">
            <CategoryBadge category={item.category} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <h3 className="text-balance text-base font-bold leading-snug tracking-tight transition-colors group-hover:text-brand sm:text-lg">
            <span className="line-clamp-2">{item.title}</span>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {item.excerpt}
          </p>
          <div className="mt-auto pt-3">
            <Meta item={item} />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link
        href={href}
        className={cn(
          "group flex gap-3 rounded-lg p-2 transition-colors hover:bg-muted/60",
          className
        )}
      >
        <div className="relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted sm:h-24 sm:w-24">
          <NewsImage
            src={item.image}
            alt={item.title}
            sizes="96px"
            className="img-zoom"
          />
        </div>
        <div className="flex min-w-0 flex-col justify-center">
          <CategoryBadge category={item.category} size="xs" />
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-brand sm:text-[15px]">
            {item.title}
          </h3>
          <div className="mt-1">
            <Meta item={item} className="text-[11px]" />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "overlay") {
    return (
      <Link
        href={href}
        className={cn(
          "group relative block overflow-hidden rounded-lg bg-muted",
          className
        )}
      >
        <div className="relative aspect-[16/10] w-full sm:aspect-[4/3]">
          <NewsImage
            src={item.image}
            alt={item.title}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="img-zoom"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
          <CategoryBadge category={item.category} size="xs" />
          <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-white sm:text-base">
            {item.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-white/80">
            <Clock className="h-3 w-3" />
            {relativeTimeBn(new Date(item.publishedAt))}
          </div>
        </div>
      </Link>
    );
  }

  // variant === "text"
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-1.5 border-b border-border/70 py-3 last:border-0",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <CategoryBadge category={item.category} size="xs" />
        <span className="text-[11px] text-muted-foreground">
          {relativeTimeBn(new Date(item.publishedAt))}
        </span>
      </div>
      <h3 className="text-balance text-[15px] font-semibold leading-snug transition-colors group-hover:text-brand">
        <span className="line-clamp-2">{item.title}</span>
      </h3>
    </Link>
  );
}
