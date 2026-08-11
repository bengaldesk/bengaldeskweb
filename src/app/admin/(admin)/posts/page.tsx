"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  FileText,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Inbox,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface Category {
  id: string
  name: string
  nameBn: string | null
  slug: string
}

interface PostItem {
  id: string
  title: string
  published: boolean
  viewCount: number
  createdAt: string
  author: { id: string; name: string | null }
  categoryRel: { id: string; name: string; nameBn: string | null; slug: string } | null
  _count: { comments: number; reactions: number }
}

interface PostsResponse {
  posts: PostItem[]
  total: number
  page: number
  totalPages: number
}

export default function PostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<PostItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("limit", "10")
      if (search) params.set("search", search)
      if (categoryFilter) params.set("category", categoryFilter)
      if (statusFilter !== "all") params.set("published", statusFilter)

      const res = await fetch(`/api/admin/posts?${params.toString()}`)
      if (!res.ok) throw new Error("তথ্য লোড করতে সমস্যা হয়েছে")
      const data: PostsResponse = await res.json()
      setPosts(data.posts)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch {
      toast.error("সংবাদ লোড করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }, [page, search, categoryFilter, statusFilter])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch {
      // silent fail
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/posts/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("সংবাদ সফলভাবে মুছে ফেলা হয়েছে")
      setDeleteId(null)
      fetchPosts()
    } catch {
      toast.error("সংবাদ মুছে ফেলতে সমস্যা হয়েছে")
    } finally {
      setDeleting(false)
    }
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setTogglingId(id)
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentStatus }),
      })
      if (!res.ok) throw new Error()
      toast.success(currentStatus ? "সংবাদ ড্রাফট করা হয়েছে" : "সংবাদ প্রকাশিত হয়েছে")
      fetchPosts()
    } catch {
      toast.error("অবস্থা পরিবর্তন করতে সমস্যা হয়েছে")
    } finally {
      setTogglingId(null)
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
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pageNumbers.push(i)
    }
    if (page < totalPages - 2) pageNumbers.push("...")
    pageNumbers.push(totalPages)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">সংবাদ ব্যবস্থাপনা</h2>
          <p className="text-muted-foreground text-sm mt-1">
            সকল সংবাদ দেখুন, সম্পাদনা ও পরিচালনা করুন
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            নতুন সংবাদ
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="সংবাদ খুঁজুন..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9"
                />
              </div>
            </form>
            <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v === "all" ? "" : v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="বিভাগ নির্বাচন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সকল বিভাগ</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nameBn || cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="অবস্থা" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সকল</SelectItem>
                <SelectItem value="true">প্রকাশিত</SelectItem>
                <SelectItem value="false">ড্রাফট</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {loading ? (
        <PostListSkeleton />
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Inbox className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">কোনো সংবাদ পাওয়া যায়নি</h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              নতুন সংবাদ তৈরি করুন অথবা ফিল্টার পরিবর্তন করুন
            </p>
            <Link href="/admin/posts/new" className="mt-4">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                নতুন সংবাদ
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <Card className="hidden md:block">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[250px]">শিরোনাম</TableHead>
                    <TableHead>বিভাগ</TableHead>
                    <TableHead>অবস্থা</TableHead>
                    <TableHead>লেখক</TableHead>
                    <TableHead>তারিখ</TableHead>
                    <TableHead className="text-center">দেখা</TableHead>
                    <TableHead className="text-right">কাজ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-[280px]">
                        <Link
                          href={`/admin/posts/edit/${post.id}`}
                          className="hover:underline line-clamp-1 block"
                        >
                          {post.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {post.categoryRel ? (
                          <Badge variant="secondary">
                            {post.categoryRel.nameBn || post.categoryRel.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            post.published
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25"
                              : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/25"
                          }
                          variant="outline"
                        >
                          {post.published ? "প্রকাশিত" : "ড্রাফট"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {post.author?.name || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                        {new Date(post.createdAt).toLocaleDateString("bn-BD", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                          <Eye className="h-3.5 w-3.5" />
                          {post.viewCount.toLocaleString("bn-BD")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title={post.published ? "ড্রাফট করুন" : "প্রকাশ করুন"}
                            onClick={() => handleTogglePublish(post.id, post.published)}
                            disabled={togglingId === post.id}
                          >
                            {togglingId === post.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : post.published ? (
                              <ToggleRight className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Link href={`/admin/posts/edit/${post.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="সম্পাদনা">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            title="মুছুন"
                            onClick={() => setDeleteId(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/admin/posts/edit/${post.id}`}
                      className="font-medium text-sm line-clamp-2 hover:underline"
                    >
                      {post.title}
                    </Link>
                    <Badge
                      className={
                        post.published
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 shrink-0"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20 shrink-0"
                      }
                      variant="outline"
                    >
                      {post.published ? "প্রকাশিত" : "ড্রাফট"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {post.categoryRel && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {post.categoryRel.nameBn || post.categoryRel.name}
                      </Badge>
                    )}
                    <span>{post.author?.name || "—"}</span>
                    <span>·</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("bn-BD", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-0.5">
                      <Eye className="h-3 w-3" />
                      {post.viewCount.toLocaleString("bn-BD")}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-1 pt-1 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => handleTogglePublish(post.id, post.published)}
                      disabled={togglingId === post.id}
                    >
                      {togglingId === post.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                      ) : post.published ? (
                        <ToggleRight className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="h-3.5 w-3.5 mr-1" />
                      )}
                      {post.published ? "ড্রাফট" : "প্রকাশ"}
                    </Button>
                    <Link href={`/admin/posts/edit/${post.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        সম্পাদনা
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(post.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      মুছুন
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>
              এই সংবাদটি মুছে ফেলা হবে। এই কাজ পূর্বাবস্থায় ফেরানো যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function PostListSkeleton() {
  return (
    <>
      {/* Desktop Skeleton */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>শিরোনাম</TableHead>
                <TableHead>বিভাগ</TableHead>
                <TableHead>অবস্থা</TableHead>
                <TableHead>লেখক</TableHead>
                <TableHead>তারিখ</TableHead>
                <TableHead className="text-center">দেখা</TableHead>
                <TableHead className="text-right">কাজ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Mobile Skeleton */}
      <div className="md:hidden space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-end gap-1">
                <Skeleton className="h-8 w-16 rounded" />
                <Skeleton className="h-8 w-16 rounded" />
                <Skeleton className="h-8 w-16 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
