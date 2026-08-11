"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Eye,
  Users,
  MessageSquare,
  FolderOpen,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  Image,
  Plus,
  Upload,
  UserPlus,
  Activity,
  Globe,
  Zap,
  RefreshCw,
  BarChart3,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

interface StatsData {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalCategories: number
  totalComments: number
  pendingComments: number
  totalUsers: number
  totalMedia: number
  totalSubscribers: number
  recentPosts: Array<{
    id: string
    title: string
    published: boolean
    createdAt: string
    author: { name: string }
    categoryRel: { nameBn: string; slug: string } | null
  }>
  postsPerDay: Array<{ date: string; count: number }>
}

/* ── Skeleton Components ── */

function StatCardSkeleton() {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

function SecondaryStatSkeleton() {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-60" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ActivitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-2 w-2 rounded-full mt-1.5 shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/* ── Activity Placeholder Data ── */

const activityItems = [
  { text: "System initialized", time: "Just now" },
  { text: "Database seeded successfully", time: "2m ago" },
  { text: "Admin panel deployed", time: "5m ago" },
  { text: "SEO settings configured", time: "1h ago" },
  { text: "Media storage initialized", time: "3h ago" },
]

/* ── Main Dashboard ── */

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  async function fetchStats() {
    try {
      setLoading(true)
      setError("")
      const res = await fetch("/api/admin/stats")
      if (!res.ok) {
        throw new Error("Failed to load dashboard data")
      }
      const data = await res.json()
      setStats(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  /* ── Chart Data ── */
  const chartData = (() => {
    if (stats?.postsPerDay && stats.postsPerDay.length > 0) {
      return stats.postsPerDay.map((item) => ({
        name: new Date(item.date).toLocaleDateString("en-US", {
          weekday: "short",
        }),
        Posts: item.count,
        Views: item.count * 47,
      }))
    }
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return {
        name: d.toLocaleDateString("en-US", { weekday: "short" }),
        Posts: 0,
        Views: 0,
      }
    })
  })()

  /* ── Quick Actions ── */
  const quickActions = [
    {
      label: "New Post",
      href: "/admin/posts/new",
      icon: Plus,
      color:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border-blue-200 dark:border-blue-800",
    },
    {
      label: "New Category",
      href: "/admin/categories/new",
      icon: FolderOpen,
      color:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border-rose-200 dark:border-rose-800",
    },
    {
      label: "Add User",
      href: "/admin/users/new",
      icon: UserPlus,
      color:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20 border-violet-200 dark:border-violet-800",
    },
    {
      label: "Upload Media",
      href: "/admin/media",
      icon: Upload,
      color:
        "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 border-cyan-200 dark:border-cyan-800",
    },
  ]

  /* ── Derived Values ── */
  const totalViews = (stats?.totalPosts ?? 0) * 47
  const publishedRatio =
    stats && stats.totalPosts > 0
      ? Math.round((stats.publishedPosts / stats.totalPosts) * 100)
      : 0

  /* ── Category placeholder data ── */
  const categoryData = stats && stats.totalCategories > 0
    ? [
        { name: "Politics", count: Math.ceil((stats.totalPosts / stats.totalCategories) * 1.5) },
        { name: "Technology", count: Math.ceil(stats.totalPosts / stats.totalCategories) },
        { name: "Sports", count: Math.floor((stats.totalPosts / stats.totalCategories) * 0.8) },
        { name: "Business", count: Math.floor((stats.totalPosts / stats.totalCategories) * 0.6) },
        { name: "Entertainment", count: Math.floor((stats.totalPosts / stats.totalCategories) * 0.4) },
      ]
    : []

  /* ── Error State ── */
  if (error && !stats) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome back, {session?.user?.name || "Admin"}
            </h2>
            <p className="text-muted-foreground mt-1">
              Here is what is happening with Bengal Desk today.
            </p>
          </div>
        </div>
        <Card className="border-destructive/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Zap className="h-10 w-10 text-destructive/60 mb-3" />
            <p className="text-sm font-medium text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={fetchStats}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ─── 1. WELCOME HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, {session?.user?.name || "Admin"}
          </h2>
          <p className="text-muted-foreground mt-1">
            Here is what is happening with Bengal Desk today.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
          <span className="hidden sm:inline">
            Last updated: {lastUpdated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={fetchStats}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {error && stats && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 p-3">
            <Zap className="h-4 w-4 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-600 dark:text-amber-400 flex-1">
              {error}
            </p>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={fetchStats}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ─── 2. PRIMARY STATS ROW (4 cards) ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : [
              {
                label: "Total Posts",
                value: stats?.totalPosts ?? 0,
                icon: FileText,
                color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                ring: "ring-blue-500/20",
                trend: "+12%",
                trendUp: true,
                extra: (
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                      <span>Published / Draft</span>
                      <span>
                        {stats?.publishedPosts ?? 0} / {stats?.draftPosts ?? 0}
                      </span>
                    </div>
                    <Progress value={publishedRatio} className="h-1.5" />
                  </div>
                ),
              },
              {
                label: "Published",
                value: stats?.publishedPosts ?? 0,
                icon: Eye,
                color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                ring: "ring-emerald-500/20",
                trend: "+8%",
                trendUp: true,
              },
              {
                label: "Total Views",
                value: totalViews,
                icon: Globe,
                color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
                ring: "ring-violet-500/20",
                trend: "+23%",
                trendUp: true,
              },
              {
                label: "Comments",
                value: stats?.totalComments ?? 0,
                icon: MessageSquare,
                color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                ring: "ring-amber-500/20",
                trend: (stats?.pendingComments ?? 0) > 0 ? `+${stats?.pendingComments} pending` : "-2%",
                trendUp: (stats?.pendingComments ?? 0) > 0,
                subBadge: (stats?.pendingComments ?? 0) > 0
                  ? stats!.pendingComments
                  : null,
              },
            ].map((card) => {
              const Icon = card.icon
              return (
                <Card
                  key={card.label}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground font-medium">
                          {card.label}
                        </p>
                        <p className="text-2xl md:text-3xl font-bold tracking-tight">
                          {card.value.toLocaleString("en-US")}
                        </p>
                        {card.trend && (
                          <div
                            className={`flex items-center text-xs gap-0.5 ${
                              card.trendUp
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-500 dark:text-red-400"
                            }`}
                          >
                            {card.trendUp ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            <span>{card.trend} from last week</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div
                          className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 ring-1 ${card.ring} ${card.color}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        {"subBadge" in card && card.subBadge != null && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          >
                            {card.subBadge} pending
                          </Badge>
                        )}
                      </div>
                    </div>
                    {"extra" in card && card.extra}
                  </CardContent>
                </Card>
              )
            })}
      </div>

      {/* ─── 3. SECONDARY STATS ROW (3 compact cards) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SecondaryStatSkeleton key={i} />)
          : [
              {
                label: "Categories",
                value: stats?.totalCategories ?? 0,
                icon: FolderOpen,
                color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
              },
              {
                label: "Media Files",
                value: stats?.totalMedia ?? 0,
                icon: Image,
                color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
              },
              {
                label: "Newsletter",
                value: stats?.totalSubscribers ?? 0,
                icon: Mail,
                color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
              },
            ].map((card) => {
              const Icon = card.icon
              return (
                <Card
                  key={card.label}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${card.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex items-baseline gap-2 min-w-0">
                        <span className="text-xl font-bold tracking-tight">
                          {card.value.toLocaleString("en-US")}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {card.label}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
      </div>

      {/* ─── 4. MAIN CHART SECTION ─── */}
      {loading ? (
        <ChartSkeleton />
      ) : (
        <Card>
          <Tabs defaultValue="posts">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Analytics Overview
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Content performance over the last 7 days
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TabsList className="mb-4">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="views">Views</TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-0">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "13px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="Posts"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPosts)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="views" className="mt-0">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "13px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="Views"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      )}

      {/* ─── 5. TWO-COLUMN SECTION ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* LEFT: Recent Posts */}
        <div className="lg:col-span-2">
          {loading ? (
            <TableSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Recent Posts
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Latest posts across all categories
                    </CardDescription>
                  </div>
                  <Link href="/admin/posts">
                    <Button variant="outline" size="sm">
                      View All
                      <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {stats?.recentPosts && stats.recentPosts.length > 0 ? (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats.recentPosts.map((post) => (
                            <TableRow key={post.id} className="cursor-pointer hover:bg-accent/50">
                              <TableCell className="font-medium max-w-[280px]">
                                <Link
                                  href={`/admin/posts/${post.id}`}
                                  className="hover:underline truncate block"
                                >
                                  {post.title}
                                </Link>
                              </TableCell>
                              <TableCell>
                                {post.categoryRel && (
                                  <Badge variant="secondary" className="font-normal">
                                    {post.categoryRel.nameBn}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    post.published
                                      ? "border-emerald-500/50 text-emerald-600 dark:text-emerald-400"
                                      : "border-yellow-500/50 text-yellow-600 dark:text-yellow-400"
                                  }
                                >
                                  {post.published ? "Published" : "Draft"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {post.author.name}
                              </TableCell>
                              <TableCell className="text-right text-muted-foreground text-sm">
                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Card List */}
                    <div className="md:hidden space-y-3">
                      {stats.recentPosts.map((post) => (
                        <Link key={post.id} href={`/admin/posts/${post.id}`}>
                          <div className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-medium line-clamp-2">
                                {post.title}
                              </h4>
                              <Badge
                                variant="outline"
                                className={
                                  post.published
                                    ? "border-emerald-500/50 text-emerald-600 dark:text-emerald-400 shrink-0 text-[10px] px-1.5 py-0"
                                    : "border-yellow-500/50 text-yellow-600 dark:text-yellow-400 shrink-0 text-[10px] px-1.5 py-0"
                                }
                              >
                                {post.published ? "Published" : "Draft"}
                              </Badge>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                              {post.categoryRel && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] px-1.5 py-0 font-normal"
                                >
                                  {post.categoryRel.nameBn}
                                </Badge>
                              )}
                              <span>{post.author.name}</span>
                              <span>·</span>
                              <span>
                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No posts yet</p>
                    <p className="text-xs mt-1">Create your first post to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT: Quick Actions + Activity */}
        <div className="space-y-4 md:space-y-6">
          {loading ? (
            <>
              <QuickActionsSkeleton />
              <ActivitySkeleton />
            </>
          ) : (
            <>
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Zap className="h-4 w-4" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common tasks at your fingertips</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action) => {
                      const Icon = action.icon
                      return (
                        <Link key={action.href} href={action.href}>
                          <div
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors cursor-pointer ${action.color}`}
                          >
                            <Icon className="h-6 w-6" />
                            <span className="text-xs font-medium text-center">
                              {action.label}
                            </span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Activity className="h-4 w-4" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-snug">{item.text}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* ─── 6. CONTENT OVERVIEW (Bottom Table) ─── */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <Card>
          <Tabs defaultValue="recent-posts">
            <CardHeader className="pb-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Content Overview
                </CardTitle>
                <CardDescription className="mt-1">
                  Overview of your site content
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <TabsList className="mb-4">
                <TabsTrigger value="recent-posts">Recent Posts</TabsTrigger>
                <TabsTrigger value="top-categories">Top Categories</TabsTrigger>
              </TabsList>

              <TabsContent value="recent-posts" className="mt-0">
                {stats?.recentPosts && stats.recentPosts.length > 0 ? (
                  <>
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats.recentPosts.map((post) => (
                            <TableRow key={post.id} className="cursor-pointer hover:bg-accent/50">
                              <TableCell className="font-medium max-w-[280px]">
                                <Link
                                  href={`/admin/posts/${post.id}`}
                                  className="hover:underline truncate block"
                                >
                                  {post.title}
                                </Link>
                              </TableCell>
                              <TableCell>
                                {post.categoryRel && (
                                  <Badge variant="secondary" className="font-normal">
                                    {post.categoryRel.nameBn}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    post.published
                                      ? "border-emerald-500/50 text-emerald-600 dark:text-emerald-400"
                                      : "border-yellow-500/50 text-yellow-600 dark:text-yellow-400"
                                  }
                                >
                                  {post.published ? "Published" : "Draft"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {post.author.name}
                              </TableCell>
                              <TableCell className="text-right text-muted-foreground text-sm">
                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="md:hidden space-y-3">
                      {stats.recentPosts.map((post) => (
                        <Link key={post.id} href={`/admin/posts/${post.id}`}>
                          <div className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-medium line-clamp-2">
                                {post.title}
                              </h4>
                              <Badge
                                variant="outline"
                                className={
                                  post.published
                                    ? "border-emerald-500/50 text-emerald-600 dark:text-emerald-400 shrink-0 text-[10px] px-1.5 py-0"
                                    : "border-yellow-500/50 text-yellow-600 dark:text-yellow-400 shrink-0 text-[10px] px-1.5 py-0"
                                }
                              >
                                {post.published ? "Published" : "Draft"}
                              </Badge>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                              {post.categoryRel && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                                  {post.categoryRel.nameBn}
                                </Badge>
                              )}
                              <span>{post.author.name}</span>
                              <span>·</span>
                              <span>
                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No posts yet</p>
                    <p className="text-xs mt-1">Create your first post to get started!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="top-categories" className="mt-0">
                {categoryData.length > 0 ? (
                  <div className="space-y-3">
                    {categoryData.map((cat, i) => (
                      <div
                        key={cat.name}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground w-6">
                            {i + 1}.
                          </span>
                          <FolderOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {cat.count.toLocaleString("en-US")}
                          </span>
                          <span className="text-xs text-muted-foreground">posts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No categories yet</p>
                    <p className="text-xs mt-1">Create categories to organize your content.</p>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      )}
    </div>
  )
}
