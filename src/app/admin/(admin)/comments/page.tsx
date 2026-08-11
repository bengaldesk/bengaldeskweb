"use client"

import { useState, useEffect, useCallback } from "react"
import {
  CheckCircle2,
  XCircle,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type CommentStatus = "pending" | "approved" | "rejected"

interface CommentItem {
  id: string
  content: string
  status: string
  createdAt: string
  updatedAt: string
  authorId: string | null
  post: { id: string; title: string } | null
  author: { id: string; name: string } | null
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const statusBadgeClasses: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20",
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function CommentsPage() {
  const [activeTab, setActiveTab] = useState<CommentStatus | "all">("all")
  const [comments, setComments] = useState<CommentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)

  /* ---- Data fetching ---- */

  const fetchComments = useCallback(async (status?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (status && status !== "all") params.set("status", status)
      params.set("limit", "50")
      const res = await fetch(`/api/admin/comments?${params.toString()}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setComments(data.comments)
      setTotal(data.total)
    } catch {
      toast.error("Failed to load comments")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPendingCount = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/comments?status=pending&limit=1")
      if (!res.ok) return
      const data = await res.json()
      setPendingCount(data.total)
    } catch {
      // silently fail
    }
  }, [])

  useEffect(() => {
    fetchComments(activeTab === "all" ? undefined : activeTab)
  }, [activeTab, fetchComments])

  useEffect(() => {
    fetchPendingCount()
  }, [fetchPendingCount])

  /* ---- Moderation handlers ---- */

  const handleModerate = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error()
      toast.success(`Comment ${status}`)
      fetchComments(activeTab === "all" ? undefined : activeTab)
      fetchPendingCount()
    } catch {
      toast.error(`Failed to ${status} comment`)
    }
  }

  /* ---- Tab change handler ---- */

  const handleTabChange = (value: string) => {
    setActiveTab(value as CommentStatus | "all")
  }

  /* ---- Render ---- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight">Comments</h2>
          {pendingCount > 0 && (
            <Badge className="bg-red-500 text-white hover:bg-red-500 text-xs">
              {pendingCount} pending
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending" className="gap-1.5">
            Pending
            {pendingCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            /* Loading Skeletons */
            <>
              <Card className="hidden md:block">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[160px]">Author</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead className="w-[180px]">Post</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="w-[120px]">Date</TableHead>
                        <TableHead className="w-[160px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-full max-w-xs" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <div className="md:hidden space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : comments.length === 0 ? (
            /* Empty State */
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MessageSquare className="h-16 w-16 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">
                  No comments found
                </h3>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  {activeTab === "all"
                    ? "There are no comments yet."
                    : `No ${activeTab} comments at the moment.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Summary */}
              <p className="text-sm text-muted-foreground mb-3">
                Showing {comments.length} of {total} comments
              </p>

              {/* Desktop Table */}
              <Card className="hidden md:block">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[160px]">Author</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead className="w-[180px]">Post</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="w-[120px]">Date</TableHead>
                        <TableHead className="w-[160px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comments.map((comment) => (
                        <TableRow key={comment.id}>
                          <TableCell className="font-medium text-sm">
                            {comment.author?.name || "Guest"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs">
                            <p className="line-clamp-2">{comment.content}</p>
                          </TableCell>
                          <TableCell>
                            <a
                              href={`/news/${comment.post?.id}`}
                              className="text-sm text-primary hover:underline line-clamp-1"
                            >
                              {comment.post?.title || "Unknown Post"}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`capitalize text-[11px] ${statusBadgeClasses[comment.status] || ""}`}
                            >
                              {comment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              {comment.status === "pending" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs text-emerald-700 hover:text-emerald-700 hover:bg-emerald-500/10"
                                    onClick={() => handleModerate(comment.id, "approved")}
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs text-red-700 hover:text-red-700 hover:bg-red-500/10"
                                    onClick={() => handleModerate(comment.id, "rejected")}
                                  >
                                    <XCircle className="h-3.5 w-3.5 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              {comment.status === "approved" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-xs text-muted-foreground"
                                  onClick={() => handleModerate(comment.id, "rejected")}
                                >
                                  <XCircle className="h-3.5 w-3.5 mr-1" />
                                  Reject
                                </Button>
                              )}
                              {comment.status === "rejected" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-xs text-muted-foreground"
                                  onClick={() => handleModerate(comment.id, "approved")}
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                  Approve
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-sm">
                          {comment.author?.name || "Guest"}
                        </span>
                        <Badge
                          variant="outline"
                          className={`capitalize text-[11px] shrink-0 ${statusBadgeClasses[comment.status] || ""}`}
                        >
                          {comment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {comment.content}
                      </p>
                      <a
                        href={`/news/${comment.post?.id}`}
                        className="text-xs text-primary hover:underline line-clamp-1 block"
                      >
                        {comment.post?.title || "Unknown Post"}
                      </a>
                      <div className="flex items-center justify-between gap-2 pt-1 border-t">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                        <div className="flex items-center gap-1">
                          {comment.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-[11px] text-emerald-700 hover:text-emerald-700 hover:bg-emerald-500/10"
                                onClick={() => handleModerate(comment.id, "approved")}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-[11px] text-red-700 hover:text-red-700 hover:bg-red-500/10"
                                onClick={() => handleModerate(comment.id, "rejected")}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {comment.status === "approved" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[11px] text-muted-foreground"
                              onClick={() => handleModerate(comment.id, "rejected")}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          )}
                          {comment.status === "rejected" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[11px] text-muted-foreground"
                              onClick={() => handleModerate(comment.id, "approved")}
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
