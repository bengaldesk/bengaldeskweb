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
import {
  FileText,
  Eye,
  Users,
  MessageSquare,
  FolderOpen,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Mail,
  Image,
  Plus,
  Upload,
  UserPlus,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
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

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-12 w-12 rounded-xl" />
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
        <Skeleton className="h-[280px] w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-60" />
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

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats")
        if (!res.ok) {
          throw new Error("তথ্য লোড করতে সমস্যা হয়েছে")
        }
        const data = await res.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "অজানা ত্রুটি")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    {
      label: "মোট সংবাদ",
      value: stats?.totalPosts ?? 0,
      icon: FileText,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      sub: stats
        ? `প্রকাশিত ${stats.publishedPosts} / ড্রাফট ${stats.draftPosts}`
        : "",
      trend: "+12%",
    },
    {
      label: "প্রকাশিত",
      value: stats?.publishedPosts ?? 0,
      icon: Eye,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      sub: "সর্বজনীনভাবে প্রকাশিত",
      trend: "+8%",
    },
    {
      label: "ব্যবহারকারী",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      sub: "নিবন্ধিত ব্যবহারকারী",
      trend: "+5%",
    },
    {
      label: "মন্তব্য",
      value: stats?.totalComments ?? 0,
      icon: MessageSquare,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      sub: stats ? `অপেক্ষমান ${stats.pendingComments}` : "",
      trend: "+15%",
    },
    {
      label: "বিভাগ",
      value: stats?.totalCategories ?? 0,
      icon: FolderOpen,
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      sub: "সক্রিয় বিভাগ",
      trend: "",
    },
    {
      label: "মিডিয়া",
      value: stats?.totalMedia ?? 0,
      icon: Image,
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      sub: "আপলোড করা ফাইল",
      trend: "+3%",
    },
    {
      label: "নিউজলেটার",
      value: stats?.totalSubscribers ?? 0,
      icon: Mail,
      color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
      sub: "সাবস্ক্রাইবার",
      trend: "+20%",
    },
  ]

  // Generate last 7 days dates for chart
  const chartData = (() => {
    if (stats?.postsPerDay && stats.postsPerDay.length > 0) {
      return stats.postsPerDay.map((item) => ({
        name: new Date(item.date).toLocaleDateString("bn-BD", {
          weekday: "short",
        }),
        সংবাদ: item.count,
      }))
    }
    // Fallback empty chart data
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return {
        name: d.toLocaleDateString("bn-BD", { weekday: "short" }),
        সংবাদ: 0,
      }
    })
  })()

  const quickActions = [
    {
      label: "নতুন সংবাদ",
      href: "/admin/posts/new",
      icon: Plus,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20",
    },
    {
      label: "নতুন বিভাগ",
      href: "/admin/categories/new",
      icon: FolderOpen,
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20",
    },
    {
      label: "নতুন ব্যবহারকারী",
      href: "/admin/users/new",
      icon: UserPlus,
      color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20",
    },
    {
      label: "মিডিয়া আপলোড",
      href: "/admin/media",
      icon: Upload,
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          স্বাগতম, {session?.user?.name || "অ্যাডমিন"} 👋
        </h2>
        <p className="text-muted-foreground mt-1">
          আপনার সাইটের সামগ্রিক অবস্থা দেখুন
        </p>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4 text-destructive text-sm">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 7 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((card) => {
              const Icon = card.icon
              return (
                <Card
                  key={card.label}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {card.label}
                        </p>
                        <p className="text-2xl md:text-3xl font-bold">
                          {card.value.toLocaleString("bn-BD")}
                        </p>
                        {card.sub && (
                          <p className="text-xs text-muted-foreground hidden sm:block">
                            {card.sub}
                          </p>
                        )}
                      </div>
                      <div
                        className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    {card.trend && (
                      <div className="mt-2 flex items-center text-xs text-emerald-600 dark:text-emerald-400">
                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                        {card.trend} গত সপ্তাহে
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Posts Per Day Chart */}
        <div className="lg:col-span-2">
          {loading ? (
            <ChartSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  সংবাদ পরিসংখ্যান
                </CardTitle>
                <CardDescription>গত ৭ দিনে প্রকাশিত সংবাদ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        className="text-xs"
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
                        dataKey="সংবাদ"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPosts)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              দ্রুত কাজ
            </CardTitle>
            <CardDescription>সাধারণ কাজে দ্রুত যান</CardDescription>
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
      </div>

      {/* Recent Posts Table (Desktop) / Card List (Mobile) */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  সাম্প্রতিক সংবাদ
                </CardTitle>
                <CardDescription className="mt-1">
                  সর্বশেষ প্রকাশিত সংবাদসমূহ
                </CardDescription>
              </div>
              <Link href="/admin/posts">
                <Button variant="outline" size="sm" className="text-xs">
                  সব দেখুন
                  <ArrowUpRight className="h-3 w-3 ml-1" />
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
                        <TableHead>শিরোনাম</TableHead>
                        <TableHead>বিভাগ</TableHead>
                        <TableHead>অবস্থা</TableHead>
                        <TableHead>লেখক</TableHead>
                        <TableHead className="text-right">তারিখ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.recentPosts.map((post) => (
                        <TableRow key={post.id} className="cursor-pointer">
                          <TableCell className="font-medium max-w-[300px] truncate">
                            <Link
                              href={`/admin/posts/${post.id}`}
                              className="hover:underline"
                            >
                              {post.title}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {post.categoryRel && (
                              <Badge variant="secondary">
                                {post.categoryRel.nameBn}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                post.published ? "default" : "outline"
                              }
                            >
                              {post.published ? "প্রকাশিত" : "ড্রাফট"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {post.author.name}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground text-sm">
                            {new Date(post.createdAt).toLocaleDateString("bn-BD", {
                              day: "numeric",
                              month: "short",
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
                    <Link
                      key={post.id}
                      href={`/admin/posts/${post.id}`}
                    >
                      <div className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium line-clamp-2">
                            {post.title}
                          </h4>
                          <Badge
                            variant={post.published ? "default" : "outline"}
                            className="shrink-0 text-[10px] px-1.5 py-0"
                          >
                            {post.published ? "প্রকাশিত" : "ড্রাফট"}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          {post.categoryRel && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {post.categoryRel.nameBn}
                            </Badge>
                          )}
                          <span>{post.author.name}</span>
                          <span>·</span>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString(
                              "bn-BD",
                              {
                                day: "numeric",
                                month: "short",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">এখনো কোনো সংবাদ নেই</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
