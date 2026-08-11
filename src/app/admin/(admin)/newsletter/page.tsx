"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Trash2,
  Loader2,
  Mail,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Users,
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

interface Subscriber {
  id: string
  email: string
  active: boolean
  createdAt: string
}

interface NewsletterData {
  subscribers: Subscriber[]
  total: number
  page: number
  totalPages: number
}

export default function NewsletterPage() {
  const [data, setData] = useState<NewsletterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteEmail, setDeleteEmail] = useState("")

  const fetchSubscribers = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/newsletter?page=${p}&limit=20`)
      if (!res.ok) throw new Error()
      const json = await res.json()
      setData(json)
    } catch {
      toast.error("সাবস্ক্রাইবার লোড করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubscribers(page)
  }, [page, fetchSubscribers])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/newsletter?id=${deleteId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error()
      toast.success("সাবস্ক্রাইবার মুছে ফেলা হয়েছে")
      setDeleteId(null)
      setDeleteEmail("")
      fetchSubscribers(page)
    } catch {
      toast.error("মুছে ফেলতে সমস্যা হয়েছে")
    } finally {
      setDeleting(false)
    }
  }

  const openDelete = (sub: Subscriber) => {
    setDeleteId(sub.id)
    setDeleteEmail(sub.email)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const goToPage = (p: number) => {
    if (p < 1 || (data && p > data.totalPages)) return
    setPage(p)
  }

  const getPageNumbers = () => {
    if (!data) return []
    const total = data.totalPages
    const current = data.page
    const pages: (number | "ellipsis")[] = []

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      if (current > 3) pages.push("ellipsis")
      const start = Math.max(2, current - 1)
      const end = Math.min(total - 1, current + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (current < total - 2) pages.push("ellipsis")
      pages.push(total)
    }

    return pages
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            নিউজলেটার সাবস্ক্রাইবার
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            নিউজলেটার সাবস্ক্রিপশন পরিচালনা করুন
          </p>
        </div>
        {data && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {"মোট সাবস্ক্রাইবার: " +
                data.total.toLocaleString("bn-BD")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <>
          {/* Desktop Skeleton Table */}
          <div className="hidden md:block rounded-lg border">
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              ))}
            </div>
          </div>
          {/* Mobile Skeleton Cards */}
          <div className="md:hidden space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : !data || data.subscribers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Inbox className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              কোনো সাবস্ক্রাইবার পাওয়া যায়নি
            </h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              নিউজলেটার সাবস্ক্রিপশন এখনো শুরু হয়নি
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ইমেইল</TableHead>
                  <TableHead className="w-24">অবস্থা</TableHead>
                  <TableHead className="w-36">সাবস্ক্রাইবের তারিখ</TableHead>
                  <TableHead className="w-16">কাজ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.subscribers.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[300px]">
                          {sub.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          sub.active
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/20"
                        }
                      >
                        {sub.active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(sub.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => openDelete(sub)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">মুছুন</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {data.subscribers.map((sub) => (
              <Card key={sub.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {sub.email}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        sub.active
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 shrink-0"
                          : "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/20 shrink-0"
                      }
                    >
                      {sub.active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(sub.createdAt)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-destructive hover:text-destructive"
                      onClick={() => openDelete(sub)}
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
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">পূর্ববর্তী</span>
              </Button>

              {getPageNumbers().map((p, i) =>
                p === "ellipsis" ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="px-2 text-muted-foreground"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => goToPage(p)}
                  >
                    {p.toLocaleString("bn-BD")}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => goToPage(page + 1)}
                disabled={page >= data.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">পরবর্তী</span>
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null)
            setDeleteEmail("")
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteEmail && (
                <span>
                  <strong>{deleteEmail}</strong> ইমেইলটি নিউজলেটার থেকে মুছে ফেলা হবে।
                </span>
              )}
              {" "}
              এই কাজ পূর্বাবস্থায় ফেরানো যাবে না।
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
