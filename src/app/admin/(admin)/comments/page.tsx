"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Inbox,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface CommentItem {
  id: string
  content: string
  status: string
  createdAt: string
  updatedAt: string
  postId: string
  authorId: string | null
  author: { id: string; name: string | null } | null
  post: { id: string; title: string }
}

interface CommentsResponse {
  comments: CommentItem[]
  total: number
  page: number
  totalPages: number
}

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
    case "rejected":
      return "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20"
    case "pending":
    default:
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20"
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "approved":
      return "অনুমোদিত"
    case "rejected":
      return "বাতিল"
    case "pending":
    default:
      return "অপেক্ষমান"
  }
}

export default function CommentsPage() {
  const [comments, setComments] = useState<CommentItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [moderatingId, setModeratingId] = useState<string | null>(null)
  const [pendingCount, setPendingCount] = useState(0)

  const fetchComments = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("limit", "10")
      if (statusFilter !== "all") params.set("status", statusFilter)

      const res = await fetch(`/api/admin/comments?${params.toString()}`)
      if (!res.ok) throw new Error()
      const data: CommentsResponse = await res.json()
      setComments(data.comments)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch {
      toast.error("মন্তব্য লোড করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

  const fetchPendingCount = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/comments?status=pending&limit=1")
      if (res.ok) {
        const data = await res.json()
        setPendingCount(data.total)
      }
    } catch {
      // silent
    }
  }, [])

  useEffect(() => {
    fetchPendingCount()
  }, [fetchPendingCount])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleModerate = async (id: string, newStatus: string) => {
    setModeratingId(id)
    try {
      const res = await fetch("/api/admin/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      })
      if (!res.ok) throw new Error()
      toast.success(
        newStatus === "approved"
          ? "মন্তব্য অনুমোদিত হয়েছে"
          : "মন্তব্য বাতিল করা হয়েছে"
      )
      fetchComments()
      fetchPendingCount()
    } catch {
      toast.error("অবস্থা পরিবর্তন করতে সমস্যা হয়েছে")
    } finally {
      setModeratingId(null)
    }
  }

  const startItem = (page - 1) * 10 + 1
  const endItem = Math.min(page * 10, total)

  const pageNumbers: (number | "...")[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
  } else {
    pageNumbers.push(1)
    if (page > 3) pageNumbers.push("...")
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pageNumbers.push(i)
    }
    if (page < totalPages - 2) pageNumbers.push("...")
    pageNumbers.push(totalPages)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight">
            মন্তব্য মডারেশন
          </h2>
          {pendingCount > 0 && (
            <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/25">
              <Clock className="h-3 w-3 mr-1" />
              {pendingCount.toLocaleString("bn-BD")}
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={statusFilter}
        onValueChange={(v) => {
          setStatusFilter(v)
          setPage(1)
        }}
      >
        <TabsList>
          <TabsTrigger value="all">সকল</TabsTrigger>
          <TabsTrigger value="pending">
            অপেক্ষমান
            {pendingCount > 0 && (
              <span className="ml-1.5 text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full px-1.5 py-0.5">
                {pendingCount.toLocaleString("bn-BD")}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">অনুমোদিত</TabsTrigger>
          <TabsTrigger value="rejected">বাতিল</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content */}
      {loading ? (
        <CommentsSkeleton />
      ) : comments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Inbox className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              কোনো মন্তব্য পাওয়া যায়নি
            </h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              নির্বাচিত ফিল্টারে কোনো মন্তব্য নেই
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Card key={comment.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 space-y-3">
                {/* Author & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {comment.author?.name || "অজানা ব্যবহারকারী"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString("bn-BD", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`shrink-0 ${getStatusBadge(comment.status)}`}
                  >
                    {getStatusLabel(comment.status)}
                  </Badge>
                </div>

                {/* Comment Text */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {comment.content}
                </p>

                {/* Post Title */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">সংবাদ:</span>
                  <Link
                    href={`/admin/posts/edit/${comment.postId}`}
                    className="text-xs font-medium text-primary hover:underline line-clamp-1"
                  >
                    {comment.post.title}
                  </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t">
                  <Link href={`/admin/posts/edit/${comment.postId}`}>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      সংবাদ দেখুন
                    </Button>
                  </Link>
                  {comment.status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-emerald-600 hover:text-emerald-700"
                        onClick={() => handleModerate(comment.id, "approved")}
                        disabled={moderatingId === comment.id}
                      >
                        {moderatingId === comment.id ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        )}
                        অনুমোদন
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-red-600 hover:text-red-700"
                        onClick={() => handleModerate(comment.id, "rejected")}
                        disabled={moderatingId === comment.id}
                      >
                        {moderatingId === comment.id ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                        )}
                        বাতিল
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {startItem.toLocaleString("bn-BD")}-{endItem.toLocaleString("bn-BD")} এর মধ্যে {total.toLocaleString("bn-BD")} টি
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">পূর্ববর্তী</span>
                </Button>
                {pageNumbers.map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="px-2 text-muted-foreground text-sm">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={p}
                      variant={page === p ? "default" : "outline"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setPage(p)}
                    >
                      {p.toLocaleString("bn-BD")}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">পরবর্তী</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CommentsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-end gap-1 pt-1 border-t">
              <Skeleton className="h-8 w-20 rounded" />
              <Skeleton className="h-8 w-16 rounded" />
              <Skeleton className="h-8 w-16 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
