'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, X, Loader2 } from 'lucide-react';
import { ALL_NEWS, categoryColor } from '@/lib/posts';
import { relativeTimeBn } from '@/lib/bn';
import { cn } from '@/lib/utils';
import { NewsImage } from './news-image';

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_RESULTS = 6;
const DEBOUNCE_MS = 300;

/**
 * Hook: manages debounced search query via timeout callback.
 * State is only set inside the timeout callback (not synchronously in the effect body).
 */
function useDebouncedSearch(rawQuery: string, delay: number) {
  const [result, setResult] = useState({ debounced: '', searching: false });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!rawQuery.trim()) {
      timerRef.current = setTimeout(() => {
        setResult({ debounced: '', searching: false });
      }, 0);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    // Set searching flag via a 0ms timeout to avoid synchronous setState in effect body
    timerRef.current = setTimeout(() => {
      setResult({ debounced: '', searching: true });
      timerRef.current = setTimeout(() => {
        setResult({ debounced: rawQuery.trim(), searching: false });
      }, delay);
    }, 0);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [rawQuery, delay]);

  return result;
}

/* ═══════════════════════════════════════════════════════════════════
 * Mobile: full-screen search overlay
 * ═══════════════════════════════════════════════════════════════════ */
function SearchDropdownInner({ isOpen, onClose }: SearchDropdownProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { debounced: debouncedQuery, searching: isSearching } = useDebouncedSearch(query, DEBOUNCE_MS);

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Filter news
  const results = debouncedQuery
    ? ALL_NEWS.filter((item) => {
        const q = debouncedQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q)
        );
      }).slice(0, MAX_RESULTS)
    : [];

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleResultClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md sm:hidden'>
      <div className='flex h-full flex-col'>
        <div className='flex items-center gap-2 border-b border-border px-4 py-3'>
          <div className='relative flex-1'>
            <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <input
              ref={inputRef}
              type='search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='শিরোনাম দিয়ে খুঁজুন...'
              className='h-10 w-full rounded-full border border-border/60 bg-muted/50 pl-9 pr-9 text-sm outline-none focus-visible:border-brand/40 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-brand/20'
              aria-label='খবর খুঁজুন'
            />
            {query && (
              <button
                type='button'
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                aria-label='মুছুন'
              >
                <X className='h-4 w-4' />
              </button>
            )}
          </div>
          <button
            type='button'
            onClick={onClose}
            className='rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground'
          >
            বাতিল
          </button>
        </div>
        <div className='flex-1 overflow-y-auto'>
          <SearchResults
            query={debouncedQuery}
            results={results}
            isSearching={isSearching}
            hasQuery={!!query.trim()}
            onResultClick={handleResultClick}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Mobile wrapper: uses `key={isOpen ? 'open' : 'closed'}` to remount
 * and reset internal state when the panel reopens.
 */
export function SearchDropdown(props: SearchDropdownProps) {
  return <SearchDropdownInner key={props.isOpen ? 'open' : 'closed'} {...props} />;
}

/* ═══════════════════════════════════════════════════════════════════
 * Desktop: floating dropdown panel
 * ═══════════════════════════════════════════════════════════════════ */
function SearchDropdownDesktopInner({ isOpen, onClose }: SearchDropdownProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { debounced: debouncedQuery, searching: isSearching } = useDebouncedSearch(query, DEBOUNCE_MS);

  // Auto-focus
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Filter
  const results = debouncedQuery
    ? ALL_NEWS.filter((item) => {
        const q = debouncedQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q)
        );
      }).slice(0, MAX_RESULTS)
    : [];

  // Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleResultClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className='fixed inset-0 z-40 hidden sm:block' onClick={onClose} aria-hidden />
      <div className='hidden sm:block absolute right-0 top-full z-50 mt-2 w-[420px] overflow-hidden rounded-xl border border-border/80 bg-background shadow-xl animate-in fade-in-0 slide-in-from-top-2'>
        <div className='flex items-center gap-2 border-b border-border/60 px-3 py-2.5'>
          <Search className='h-4 w-4 shrink-0 text-muted-foreground' />
          <input
            ref={inputRef}
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='শিরোনাম দিয়ে খুঁজুন...'
            className='flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground'
            aria-label='খবর খুঁজুন'
          />
          {isSearching && (
            <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
          )}
          {query && !isSearching && (
            <button
              type='button'
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className='text-muted-foreground hover:text-foreground'
              aria-label='মুছুন'
            >
              <X className='h-4 w-4' />
            </button>
          )}
          <kbd className='hidden rounded border border-border/60 bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline-block'>
            Esc
          </kbd>
        </div>
        <div className='max-h-[360px] overflow-y-auto'>
          <SearchResults
            query={debouncedQuery}
            results={results}
            isSearching={isSearching}
            hasQuery={!!query.trim()}
            onResultClick={handleResultClick}
          />
        </div>
      </div>
    </>
  );
}

/**
 * Desktop wrapper: uses `key` to remount and reset state on open/close.
 */
export function SearchDropdownDesktop(props: SearchDropdownProps) {
  return <SearchDropdownDesktopInner key={props.isOpen ? 'open' : 'closed'} {...props} />;
}

/* ═══════════════════════════════════════════════════════════════════
 * Shared results list
 * ═══════════════════════════════════════════════════════════════════ */
function SearchResults({
  query,
  results,
  isSearching,
  hasQuery,
  onResultClick,
}: {
  query: string;
  results: typeof ALL_NEWS;
  isSearching: boolean;
  hasQuery: boolean;
  onResultClick: () => void;
}) {
  if (isSearching) {
    return (
      <div className='flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground'>
        <Loader2 className='h-5 w-5 animate-spin' />
        <span className='text-sm'>খুঁছি...</span>
      </div>
    );
  }

  if (!hasQuery) {
    return (
      <div className='flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground'>
        <Search className='h-8 w-8 opacity-30' />
        <p className='text-sm'>শিরোনাম বা সারসংক্ষেপ দিয়ে খুঁজুন</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground'>
        <Search className='h-8 w-8 opacity-30' />
        <p className='text-sm'>
          &quot;{query}&quot; দিয়ে কোনো খবর পাওয়া যায়নি
        </p>
      </div>
    );
  }

  return (
    <ul className='divide-y divide-border/50'>
      {results.map((item) => {
        const catColor = categoryColor(item.category);
        return (
          <li key={item.id}>
            <Link
              href={`/news/${item.id}`}
              onClick={onResultClick}
              className='flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/60'
            >
              <div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-md'>
                <NewsImage src={item.image} alt={item.title} sizes='40px' className='rounded-md' />
              </div>
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-1.5'>
                  <span className={cn('h-1.5 w-1.5 rounded-full', catColor)} />
                  <span className='text-[11px] font-medium text-muted-foreground'>{item.category}</span>
                  <span className='text-[11px] text-muted-foreground/60'>
                    · {relativeTimeBn(new Date(item.publishedAt))}
                  </span>
                </div>
                <p className='mt-0.5 line-clamp-1 text-sm font-medium leading-snug text-foreground'>
                  {item.title}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
