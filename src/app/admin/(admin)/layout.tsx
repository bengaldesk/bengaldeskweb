"use client"

import {
  useState,
  useCallback,
  useSyncExternalStore,
  useRef,
  useEffect,
  type ReactNode,
} from "react"
import { SessionProvider, useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
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
  Home,
  Moon,
  Sun,
  Search,
  Bell,
  Command,
  Activity,
  ExternalLink,
  Newspaper,
} from "lucide-react"
import { useTheme } from "next-themes"

/* -------------------------------------------------------------------------- */
/*  Types & Data                                                              */
/* -------------------------------------------------------------------------- */

interface NavItem {
  href: string
  icon: React.ElementType
  label: string
  group: string
}

const navGroups = ["Main", "Manage", "System"] as const

type NavGroup = (typeof navGroups)[number]

const navItems: NavItem[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", group: "Main" },
  { href: "/admin/posts", icon: FileText, label: "Posts", group: "Main" },
  { href: "/admin/categories", icon: FolderOpen, label: "Categories", group: "Main" },
  { href: "/admin/media", icon: Image, label: "Media Library", group: "Main" },
  { href: "/admin/users", icon: Users, label: "Users", group: "Manage" },
  { href: "/admin/comments", icon: MessageSquare, label: "Comments", group: "Manage" },
  { href: "/admin/polls", icon: Vote, label: "Polls", group: "Manage" },
  { href: "/admin/newsletter", icon: Mail, label: "Newsletter", group: "Manage" },
  { href: "/admin/settings", icon: Settings, label: "Settings", group: "System" },
]

/* -------------------------------------------------------------------------- */
/*  Sidebar collapsed state hook (persisted in localStorage)                  */
/* -------------------------------------------------------------------------- */

function useSidebarCollapsed() {
  const STORAGE_KEY = "admin-sidebar-collapsed"
  const listeners = useRef(new Set<() => void>())

  const subscribe = useCallback((callback: () => void) => {
    listeners.current.add(callback)
    return () => {
      listeners.current.delete(callback)
    }
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

/* -------------------------------------------------------------------------- */
/*  Helper: is nav item active                                                */
/* -------------------------------------------------------------------------- */

function isItemActive(item: NavItem, pathname: string) {
  if (item.href === "/admin") return pathname === "/admin"
  return pathname.startsWith(item.href)
}

/* -------------------------------------------------------------------------- */
/*  Sidebar Navigation Group                                                  */
/* -------------------------------------------------------------------------- */

function NavGroupSection({
  group,
  items,
  pathname,
  collapsed,
  onItemClick,
}: {
  group: NavGroup
  items: NavItem[]
  pathname: string
  collapsed: boolean
  onItemClick?: () => void
}) {
  return (
    <div className="space-y-1 px-2">
      {/* Group label */}
      {!collapsed && (
        <p className="px-3 pt-4 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          {group}
        </p>
      )}
      {collapsed && (
        <div className="pt-3 pb-1">
          <Separator />
        </div>
      )}

      {items.map((item) => {
        const active = isItemActive(item, pathname)
        const Icon = item.icon

        if (collapsed && !onItemClick) {
          return (
            <TooltipProvider key={item.href} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`relative flex items-center justify-center h-10 w-10 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground ${
                      active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {/* Active left border indicator */}
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                    )}
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
            className={`relative flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            }`}
          >
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
            )}
            <Icon className="h-4.5 w-4.5 shrink-0" />
            {(!collapsed || onItemClick) && <span>{item.label}</span>}
          </Link>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Sidebar Component                                                         */
/* -------------------------------------------------------------------------- */

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
  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || "A"

  const grouped = navGroups.reduce<Record<NavGroup, NavItem[]>>((acc, g) => {
    acc[g] = navItems.filter((i) => i.group === g)
    return acc
  }, {} as Record<NavGroup, NavItem[]>)

  return (
    <div className="flex flex-col h-full">
      {/* Brand header */}
      <div className="flex items-center gap-3 px-4 h-14 shrink-0">
        <div className="flex items-center justify-center w-9 h-9 bg-primary rounded-lg shrink-0">
          <Newspaper className="h-5 w-5 text-primary-foreground" />
        </div>
        {(!collapsed || isMobile) && (
          <span className="font-bold text-base tracking-tight whitespace-nowrap">
            The Bengal Desk
          </span>
        )}
      </div>

      <Separator />

      {/* Navigation groups */}
      <ScrollArea className="flex-1 py-2">
        {navGroups.map((group) => (
          <NavGroupSection
            key={group}
            group={group}
            items={grouped[group]}
            pathname={pathname}
            collapsed={collapsed}
            onItemClick={onMobileNavClick}
          />
        ))}
      </ScrollArea>

      <Separator />

      {/* User info footer */}
      <div className="p-3">
        {(!collapsed || isMobile) && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session?.user?.name || "Loading..."}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session?.user?.email || ""}
              </p>
            </div>
          </div>
        )}

        {collapsed && !isMobile && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 mx-auto"
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                >
                  <LogOut className="h-4 w-4 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Sign Out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {(!collapsed || isMobile) && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-destructive hover:text-destructive justify-start"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            <LogOut className="h-4 w-4" />
            <span className="ml-2">Sign Out</span>
          </Button>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Desktop Top Bar                                                           */
/* -------------------------------------------------------------------------- */

function DesktopTopBar({
  collapsed,
  setCollapsed,
  pathname,
}: {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  pathname: string
}) {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || "A"

  // Build breadcrumb from pathname
  const currentPage = navItems.find((item) => isItemActive(item, pathname))
  const pageTitle = currentPage?.label || "Dashboard"

  return (
    <header className="hidden md:flex items-center h-14 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
          <span className="sr-only">
            {collapsed ? "Expand sidebar" : "Collapse sidebar"}
          </span>
        </Button>

        <Breadcrumb className="ml-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin" className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        {/* Search button with Cmd+K hint */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-muted-foreground font-normal"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden lg:inline text-xs">Search…</span>
                <kbd className="pointer-events-none ml-1 hidden h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground lg:inline-flex">
                  <Command className="h-2.5 w-2.5" />K
                </kbd>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search (⌘K)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Notification bell */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  3
                </span>
                <span className="sr-only">Notifications</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Theme toggle */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* User avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user?.name || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground leading-none mt-1">
                  {session?.user?.email || "admin@bengaldesk.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <div className="px-2 pt-1">
              <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider">
                <Activity className="h-2.5 w-2.5 mr-1" />
                Administrator
              </Badge>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" target="_blank" className="flex items-center cursor-pointer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Site
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*  Mobile Top Bar                                                            */
/* -------------------------------------------------------------------------- */

function MobileTopBar({
  mobileOpen,
  setMobileOpen,
  pathname,
}: {
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
  pathname: string
}) {
  const { data: session } = useSession()
  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || "A"

  const currentPage = navItems.find((item) => isItemActive(item, pathname))
  const pageTitle = currentPage?.label || "Dashboard"

  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center h-14 px-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 mr-1.5">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
      </Sheet>

      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <Newspaper className="h-4 w-4 text-primary shrink-0" />
        <h1 className="text-sm font-semibold truncate">{pageTitle}</h1>
      </div>

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
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-xs text-muted-foreground leading-none mt-1">
                {session?.user?.email || ""}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main Layout Inner (requires SessionProvider wrapper)                      */
/* -------------------------------------------------------------------------- */

function AdminLayoutInner({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useSidebarCollapsed()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/admin/login?callbackUrl=${encodeURIComponent(pathname)}`)
    }
  }, [status, router, pathname])

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="space-y-4 w-64">
          <Skeleton className="h-10 w-10 rounded-lg mx-auto" />
          <Skeleton className="h-5 w-36 mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto" />
          <Skeleton className="h-3 w-48 mx-auto mt-4" />
          <Skeleton className="h-3 w-32 mx-auto" />
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
        className={`hidden md:flex flex-col border-r bg-background transition-all duration-300 ease-in-out shrink-0 fixed inset-y-0 left-0 z-40 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <AdminSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
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
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          collapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        {/* Mobile top bar */}
        <MobileTopBar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          pathname={pathname}
        />

        {/* Desktop top bar */}
        <DesktopTopBar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          pathname={pathname}
        />

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/30 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Root Layout Export                                                        */
/* -------------------------------------------------------------------------- */

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  )
}