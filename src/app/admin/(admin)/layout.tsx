"use client"

import { useState, useCallback, useSyncExternalStore, useRef, useEffect, type ReactNode } from "react"
import { SessionProvider, useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Image,
  Settings,
  MessageSquare,
  Vote,
  Mail,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Home,
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"

interface NavItem {
  href: string
  icon: React.ElementType
  label: string
}

const navItems: NavItem[] = [
  { href: "/admin", icon: LayoutDashboard, label: "ড্যাশবোর্ড" },
  { href: "/admin/posts", icon: FileText, label: "সংবাদ" },
  { href: "/admin/categories", icon: FolderOpen, label: "বিভাগ" },
  { href: "/admin/users", icon: Users, label: "ব্যবহারকারী" },
  { href: "/admin/media", icon: Image, label: "মিডিয়া" },
  { href: "/admin/comments", icon: MessageSquare, label: "মন্তব্য" },
  { href: "/admin/polls", icon: Vote, label: "পোল" },
  { href: "/admin/newsletter", icon: Mail, label: "নিউজলেটার" },
  { href: "/admin/settings", icon: Settings, label: "সেটিংস" },
]

function SidebarNav({
  items,
  pathname,
  collapsed,
  onItemClick,
}: {
  items: NavItem[]
  pathname: string
  collapsed: boolean
  onItemClick?: () => void
}) {
  const content = (
    <nav className="flex flex-col gap-1 px-2">
      {items.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href)
        const Icon = item.icon

        if (collapsed && !onItemClick) {
          return (
            <TooltipProvider key={item.href} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-center h-10 w-10 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={`flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {(!collapsed || onItemClick) && <span>{item.label}</span>}
          </Link>
        )
      })}
    </nav>
  )

  return content
}

function AdminSidebar({
  collapsed,
  setCollapsed,
  onMobileNavClick,
  isMobile = false,
}: {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  onMobileNavClick?: () => void
  isMobile?: boolean
}) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || "A"

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-16 shrink-0">
        <div className="flex items-center justify-center w-9 h-9 bg-primary rounded-lg shrink-0">
          <Newspaper className="h-5 w-5 text-primary-foreground" />
        </div>
        {(!collapsed || isMobile) && (
          <span className="font-bold text-lg whitespace-nowrap">
            বার্তা অ্যাডমিন
          </span>
        )}
        {!isMobile && collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute top-1/2 -right-3 z-10 w-6 h-6 bg-border rounded-full flex items-center justify-center hover:bg-accent transition-colors"
            style={{ transform: "translateY(-50%)" }}
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        <SidebarNav
          items={navItems}
          pathname={pathname}
          collapsed={collapsed}
          onItemClick={onMobileNavClick}
        />
      </ScrollArea>

      <Separator />

      {/* Footer */}
      <div className="p-3 space-y-2">
        {(!collapsed || isMobile) && (
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session?.user?.name || "লোড হচ্ছে..."}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session?.user?.email || ""}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1 px-1">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={collapsed && !isMobile ? "icon" : "sm"}
                  className={collapsed && !isMobile ? "w-10 h-10" : "flex-1"}
                  onClick={toggleTheme}
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  {(!collapsed || isMobile) && (
                    <span className="ml-2">
                      {theme === "dark" ? "লাইট মোড" : "ডার্ক মোড"}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              {collapsed && !isMobile && (
                <TooltipContent side="right">
                  {theme === "dark" ? "লাইট মোড" : "ডার্ক মোড"}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          {(collapsed && !isMobile) ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10">
                  <LogOut className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/admin/login" })}>
                  <LogOut className="h-4 w-4 mr-2" />
                  প্রস্থান
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-destructive hover:text-destructive"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
            >
              <LogOut className="h-4 w-4" />
              {(!collapsed || isMobile) && <span className="ml-2">প্রস্থান</span>}
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  return sidebarContent
}

// Custom hook for sidebar collapsed state persisted in localStorage
function useSidebarCollapsed() {
  const STORAGE_KEY = "admin-sidebar-collapsed"
  const listeners = useRef(new Set<() => void>())

  const subscribe = useCallback((callback: () => void) => {
    listeners.current.add(callback)
    return () => { listeners.current.delete(callback) }
  }, [])

  const getSnapshot = useCallback(() => {
    return localStorage.getItem(STORAGE_KEY) === "true"
  }, [])

  const getServerSnapshot = useCallback(() => false, [])

  const collapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setCollapsed = useCallback((value: boolean) => {
    localStorage.setItem(STORAGE_KEY, String(value))
    listeners.current.forEach((fn) => fn())
  }, [])

  return [collapsed, setCollapsed] as const
}

function AdminLayoutInner({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useSidebarCollapsed()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/admin/login?callbackUrl=${encodeURIComponent(pathname)}`)
    }
  }, [status, router, pathname])

  const currentPage =
    navItems.find(
      (item) =>
        item.href === "/admin"
          ? pathname === "/admin"
          : pathname.startsWith(item.href)
    )?.label || "ড্যাশবোর্ড"

  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || "A"

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="space-y-4 w-64">
          <Skeleton className="h-8 w-8 rounded-lg mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r bg-background transition-all duration-300 shrink-0 fixed inset-y-0 left-0 z-40 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="relative">
          <AdminSidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        </div>
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <AdminSidebar
            collapsed={false}
            setCollapsed={setCollapsed}
            onMobileNavClick={() => setMobileOpen(false)}
            isMobile
          />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        {/* Mobile Top Bar */}
        <header className="md:hidden sticky top-0 z-30 flex items-center h-14 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">মেনু</span>
              </Button>
            </SheetTrigger>
          </Sheet>

          <h1 className="text-base font-semibold flex-1 truncate">
            {currentPage}
          </h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                প্রস্থান
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Desktop minimal top bar */}
        <header className="hidden md:flex items-center h-14 px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <span className="sr-only">
              {collapsed ? "সাইডবার খুলুন" : "সাইডবার বন্ধ করুন"}
            </span>
          </Button>
          <h1 className="text-base font-semibold ml-3">{currentPage}</h1>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Home className="h-4 w-4" />
                <span className="sr-only">সাইটে যান</span>
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    সাইটে যান
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  প্রস্থান
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 bg-muted/20 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  )
}
