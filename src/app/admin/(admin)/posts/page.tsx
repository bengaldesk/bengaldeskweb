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
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Inbox,
  Filter,
  Download,
  ArrowUpDown,
  CheckSquare,
  Square,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
  featured: boolean
  breaking: boolean
  viewCount: number
  createdAt: string
  author: { id: string; name: string | null; email: string | null }
  categoryRel: { id: string; name: string; nameBn: string | null; slug: string } | null
  _count: { comments: number; reactions: number }
}

interface PostsResponse {
  posts: PostItem[]
  total: number
  page: number
  totalPages: number
}

const PAGE_LIMIT = 12

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

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("limit", String(PAGE_LIMIT))
      if (search) params.set("search", search)
      if (categoryFilter) params.set("category", categoryFilter)
      if (statusFilter !== "all") params.set("published", statusFilter)

      const res = await fetch(`/api/admin/posts?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to load posts")
      const data: PostsResponse = await res.json()
      setPosts(data.posts)
      setTotal(data.total)
      setTotalPages(data.totalPages)
      // Clear selection on new fetch
      setSelectedIds(new Set())
    } catch {
      toast.error("Failed to load posts")
    } finally {
      setLoading(false)
    }
  }, [page, search, categoryFilter, statusFilter])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(Array.isArray(data) ? data : data.categories || [])
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
      toast.success("Post deleted successfully")
      setDeleteId(null)
      fetchPosts()
    } catch {
      toast.error("Failed to delete post")
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
      toast.success(currentStatus ? "Post unpublished" : "Post published")
      fetchPosts()
    } catch {
      toast.error("Failed to toggle publish status")
    } finally {
      setTogglingId(null)
    }
  }

  // Selection handlers
  const allSelected = posts.length > 0 && posts.every((p) => selectedIds.has(p.id))
  const someSelected = posts.some((p) => selectedIds.has(p.id)) && !allSelected

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(posts.map((p) => p.id)))
    }
  }

  const handleSelectOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  const handleCancelSelection = () => {
    setSelectedIds(new Set())
  }

  const handleBulkPublish = async () => {
    setBulkLoading(true)
    try {
      const draftPosts = posts.filter((p) => selectedIds.has(p.id) && !p.published)
      await Promise.all(
        draftPosts.map((p) =>
          fetch(`/api/admin/posts/${p.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ published: true }),
          })
        )
      )
      toast.success(`${draftPosts.length} post(s) published`)
      fetchPosts()
    } catch {
      toast.error("Failed to publish selected posts")
    } finally {
      setBulkLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    setBulkLoading(true)
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch(`/api/admin/posts/${id}`, { method: "DELETE" })
        )
      )
      toast.success(`${selectedIds.size} post(s) deleted`)
      fetchPosts()
    } catch {
      toast.error("Failed to delete selected posts")
    } finally {
      setBulkLoading(false)
    }
  }

  const startItem = (page - 1) * PAGE_LIMIT + 1
  const endItem = Math.min(page * PAGE_LIMIT, total)

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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Posts</h2>
            {!loading && total > 0 && (
              <Badge variant="secondary" className="font-normal">
                {total}
              </Badge>
            )}
          </div>
          <Link href="/admin/posts/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.size > 0 && (
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
            <CardContent className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>
                  {selectedIds.size} selected
                </span>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkPublish}
                  disabled={bulkLoading}
                >
                  {bulkLoading && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                  Publish Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={bulkLoading}
                  className="text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/50"
                >
                  {bulkLoading && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                  Delete Selected
                </Button>
                <button
                  onClick={handleCancelSelection}
                  className="text-sm text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter Row */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </form>
              <div className="flex items-center gap-3">
                <Select
                  value={categoryFilter}
                  onValueChange={(v) => {
                    setCategoryFilter(v === "all" ? "" : v)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={statusFilter}
                  onValueChange={(v) => {
                    setStatusFilter(v)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Published</SelectItem>
                    <SelectItem value="false">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" type="button">
                      <Filter className="h-4 w-4" />
                      <span className="sr-only">Filter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Active filters applied</TooltipContent>
                </Tooltip>
              </div>
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
              <h3 className="text-lg font-medium text-muted-foreground">No posts found</h3>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Create your first post or adjust your filters
              </p>
              <Link href="/admin/posts/new" className="mt-4">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first post
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop Table */}
            <Card className="hidden md:block">
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox
                            checked={allSelected ? true : someSelected ? "indeterminate" : false}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all posts"
                          />
                        </TableHead>
                        <TableHead className="min-w-[350px]">
                          <div className="flex items-center gap-1">
                            Title
                            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        </TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Featured</TableHead>
                        <TableHead className="text-center">Breaking</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-center">Views</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((post) => (
                        <TableRow
                          key={post.id}
                          className={selectedIds.has(post.id) ? "bg-muted/50" : ""}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedIds.has(post.id)}
                              onCheckedChange={() => handleSelectOne(post.id)}
                              aria-label={`Select ${post.title}`}
                            />
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/admin/posts/edit/${post.id}`}
                              className="font-semibold hover:underline truncate block max-w-[350px]"
                              title={post.title}
                            >
                              {post.title}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {post.categoryRel ? (
                              <Badge variant="secondary">{post.categoryRel.name}</Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">&mdash;</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                post.published
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200/60 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                                  : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200/60 hover:bg-amber-100 dark:hover:bg-amber-900"
                              }
                              variant="outline"
                            >
                              {post.published ? "Published" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {post.featured && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 border-yellow-200/60">
                                    <span className="mr-1">&#9733;</span>Featured
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>Featured post</TooltipContent>
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {post.breaking && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200/60">
                                    Breaking
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>Breaking news</TooltipContent>
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {post.author?.name || "\u2014"}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                            {formatDate(post.createdAt)}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                              <Eye className="h-3.5 w-3.5" />
                              {post.viewCount.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/admin/posts/edit/${post.id}`}>
                                      <Pencil className="h-4 w-4 mr-2" />
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleTogglePublish(post.id, post.published)}
                                    disabled={togglingId === post.id}
                                  >
                                    {togglingId === post.id ? (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : post.published ? (
                                      <ToggleLeft className="h-4 w-4 mr-2" />
                                    ) : (
                                      <ToggleRight className="h-4 w-4 mr-2" />
                                    )}
                                    {post.published ? "Unpublish" : "Publish"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setDeleteId(post.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {posts.map((post) => (
                <Card key={post.id} className={selectedIds.has(post.id) ? "border-blue-300 dark:border-blue-700" : ""}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        checked={selectedIds.has(post.id)}
                        onCheckedChange={() => handleSelectOne(post.id)}
                        className="mt-0.5"
                        aria-label={`Select ${post.title}`}
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/admin/posts/edit/${post.id}`}
                          className="font-semibold text-sm line-clamp-2 hover:underline block"
                        >
                          {post.title}
                        </Link>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pl-6">
                      <Badge
                        className={
                          post.published
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200/60 text-[10px]"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200/60 text-[10px]"
                        }
                        variant="outline"
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                      {post.categoryRel && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {post.categoryRel.name}
                        </Badge>
                      )}
                      {post.featured && (
                        <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 border-yellow-200/60 text-[10px]">
                          &#9733; Featured
                        </Badge>
                      )}
                      {post.breaking && (
                        <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200/60 text-[10px]">
                          Breaking
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pl-6 text-xs text-muted-foreground">
                      <span>{post.author?.name || "\u2014"}</span>
                      <span>&middot;</span>
                      <span>{formatDate(post.createdAt)}</span>
                      <span>&middot;</span>
                      <span className="inline-flex items-center gap-0.5">
                        <Eye className="h-3 w-3" />
                        {post.viewCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1 pt-1 border-t pl-6">
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
                          <ToggleLeft className="h-3.5 w-3.5 mr-1" />
                        ) : (
                          <ToggleRight className="h-3.5 w-3.5 mr-1" />
                        )}
                        {post.published ? "Unpublish" : "Publish"}
                      </Button>
                      <Link href={`/admin/posts/edit/${post.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(post.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Delete
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
                  Showing {startItem}&ndash;{endItem} of {total} results
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
                    <span className="sr-only">Previous</span>
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
                        {p}
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
                    <span className="sr-only">Next</span>
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
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This post will be permanently deleted. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
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
                <TableHead className="w-10" />
                <TableHead className="min-w-[350px]">
                  <div className="flex items-center gap-1">
                    Title
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Featured</TableHead>
                <TableHead className="text-center">Breaking</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-4 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[250px] max-w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
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
              <div className="flex items-start gap-2">
                <Skeleton className="h-4 w-4 rounded mt-0.5" />
                <Skeleton className="h-4 flex-1" />
              </div>
              <div className="flex gap-2 pl-6">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <div className="flex gap-2 pl-6">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-end gap-1 pl-6 pt-1 border-t">
                <Skeleton className="h-8 w-20 rounded" />
                <Skeleton className="h-8 w-14 rounded" />
                <Skeleton className="h-8 w-16 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
