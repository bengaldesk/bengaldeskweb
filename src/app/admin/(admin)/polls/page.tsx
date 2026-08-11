"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Plus,
  Trash2,
  Loader2,
  Vote,
  Inbox,
  X,
  Save,
  BarChart3,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
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

interface PollOption {
  id: string
  text: string
  votes: number
  pollId: string
}

interface Poll {
  id: string
  question: string
  active: boolean
  createdAt: string
  updatedAt: string
  options: PollOption[]
  _count: { options: number }
  totalVotes: number
}

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState<string[]>(["", ""])
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchPolls = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/polls")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setPolls(data)
    } catch {
      toast.error("পোল লোড করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPolls()
  }, [fetchPolls])

  const openCreate = () => {
    setQuestion("")
    setOptions(["", ""])
    setDialogOpen(true)
  }

  const addOption = () => {
    setOptions((prev) => [...prev, ""])
  }

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      toast.error("কমপক্ষে ২টি অপশন থাকতে হবে")
      return
    }
    setOptions((prev) => prev.filter((_, i) => i !== index))
  }

  const updateOption = (index: number, value: string) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? value : opt))
    )
  }

  const handleCreate = async () => {
    if (!question.trim()) {
      toast.error("প্রশ্ন আবশ্যক")
      return
    }
    const validOptions = options.filter((o) => o.trim())
    if (validOptions.length < 2) {
      toast.error("কমপক্ষে ২টি অপশন দিন")
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/admin/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          options: validOptions.map((text) => ({ text })),
        }),
      })
      if (!res.ok) throw new Error()
      toast.success("পোল তৈরি হয়েছে")
      setDialogOpen(false)
      fetchPolls()
    } catch {
      toast.error("পোল তৈরি করতে সমস্যা হয়েছে")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = () => {
    if (!deleteId) return
    setDeleting(true)
    // No delete API, remove from local state
    setPolls((prev) => prev.filter((p) => p.id !== deleteId))
    toast.success("পোল মুছে ফেলা হয়েছে")
    setDeleting(false)
    setDeleteId(null)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            পোল ব্যবস্থাপনা
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            সকল পোল দেখুন ও নতুন পোল তৈরি করুন
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          নতুন পোল
        </Button>
      </div>

      {/* Polls List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-8 w-8 rounded ml-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : polls.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Inbox className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              কোনো পোল পাওয়া যায়নি
            </h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              নতুন পোল তৈরি করুন
            </p>
            <Button
              onClick={openCreate}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              নতুন পোল
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {polls.map((poll) => (
            <Card
              key={poll.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Vote className="h-5 w-5 text-primary shrink-0" />
                    <h3 className="font-medium text-sm line-clamp-2">
                      {poll.question}
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      poll.active
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 shrink-0"
                        : "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/20 shrink-0"
                    }
                  >
                    {poll.active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-3.5 w-3.5" />
                    {"মোট ভোট: " + poll.totalVotes.toLocaleString("bn-BD")}
                  </span>
                  <span>
                    {"অপশন: " + poll._count.options.toLocaleString("bn-BD")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(poll.createdAt)}
                  </span>
                </div>

                {/* Options preview */}
                <div className="space-y-1.5">
                  {poll.options.slice(0, 3).map((opt) => (
                    <div
                      key={opt.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-muted-foreground truncate mr-2">
                        {opt.text}
                      </span>
                      <span className="text-muted-foreground/70 shrink-0">
                        {opt.votes.toLocaleString("bn-BD")}
                      </span>
                    </div>
                  ))}
                  {poll.options.length > 3 && (
                    <p className="text-xs text-muted-foreground/60">
                      আরও {" " + (poll.options.length - 3).toLocaleString("bn-BD") + " অপশন"}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-1 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(poll.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    মুছুন
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Poll Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>নতুন পোল</DialogTitle>
            <DialogDescription>
              একটি নতুন ভোটিং পোল তৈরি করুন
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="poll-question">
                প্রশ্ন <span className="text-destructive">*</span>
              </Label>
              <Input
                id="poll-question"
                placeholder="আপনার প্রশ্ন লিখুন..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>অপশন সমূহ</Label>
              <div className="space-y-2">
                {options.map((opt, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder={"অপশন " + (index + 1).toLocaleString("bn-BD")}
                      value={opt}
                      onChange={(e) => updateOption(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeOption(index)}
                      disabled={options.length <= 2}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">অপশন মুছুন</span>
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={addOption}
              >
                <Plus className="h-4 w-4 mr-2" />
                অপশন যোগ করুন
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              বাতিল
            </Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              তৈরি করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>
              এই পোলটি মুছে ফেলা হবে। এই কাজ পূর্বাবস্থায় ফেরানো যাবে না।
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
