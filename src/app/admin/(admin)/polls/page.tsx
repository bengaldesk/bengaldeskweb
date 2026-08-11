"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Plus,
  Trash2,
  X,
  Loader2,
  Vote,
  Inbox,
  Save,
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

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface PollOption {
  id: string
  text: string
  votes: number
  pollId: string
}

interface PollItem {
  id: string
  question: string
  active: boolean
  createdAt: string
  updatedAt: string
  options: PollOption[]
  _count: { options: number }
  totalVotes: number
}

interface OptionInput {
  id: string
  text: string
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function createTempId() {
  return Math.random().toString(36).slice(2, 9)
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function PollsPage() {
  const [polls, setPolls] = useState<PollItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState<OptionInput[]>([
    { id: createTempId(), text: "" },
    { id: createTempId(), text: "" },
  ])
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  /* ---- Data fetching ---- */

  const fetchPolls = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/polls")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setPolls(data)
    } catch {
      toast.error("Failed to load polls")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPolls()
  }, [fetchPolls])

  /* ---- Dialog helpers ---- */

  const openCreate = () => {
    setQuestion("")
    setOptions([
      { id: createTempId(), text: "" },
      { id: createTempId(), text: "" },
    ])
    setDialogOpen(true)
  }

  /* ---- Option management ---- */

  const addOption = () => {
    setOptions((prev) => [...prev, { id: createTempId(), text: "" }])
  }

  const removeOption = (id: string) => {
    if (options.length <= 2) {
      toast.error("A poll must have at least 2 options")
      return
    }
    setOptions((prev) => prev.filter((o) => o.id !== id))
  }

  const updateOption = (id: string, text: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)))
  }

  /* ---- Save handler ---- */

  const handleSave = async () => {
    if (!question.trim()) {
      toast.error("Question is required")
      return
    }
    const validOptions = options.filter((o) => o.text.trim())
    if (validOptions.length < 2) {
      toast.error("At least 2 non-empty options are required")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/admin/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          options: validOptions.map((o) => o.text),
        }),
      })
      if (!res.ok) throw new Error()
      toast.success("Poll created")
      setDialogOpen(false)
      fetchPolls()
    } catch {
      toast.error("Failed to create poll")
    } finally {
      setSaving(false)
    }
  }

  /* ---- Delete handler ---- */

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      // Delete from local state (no server-side delete endpoint for polls)
      setPolls((prev) => prev.filter((p) => p.id !== deleteId))
      toast.success("Poll deleted")
      setDeleteId(null)
    } catch {
      toast.error("Failed to delete poll")
    } finally {
      setDeleting(false)
    }
  }

  /* ---- Render ---- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Polls</h2>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Poll
        </Button>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : polls.length === 0 ? (
        /* Empty State */
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Vote className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              No polls yet
            </h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Create a poll to engage your audience.
            </p>
            <Button onClick={openCreate} variant="outline" size="sm" className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create Poll
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Poll Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {polls.map((poll) => (
            <Card key={poll.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium text-sm leading-snug">
                    {poll.question}
                  </h3>
                  <Badge
                    variant="outline"
                    className={
                      poll.active
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[11px] shrink-0"
                        : "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/20 text-[11px] shrink-0"
                    }
                  >
                    {poll.active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Options preview */}
                <div className="space-y-1">
                  {poll.options.slice(0, 3).map((opt) => (
                    <p key={opt.id} className="text-xs text-muted-foreground truncate">
                      {opt.text}
                    </p>
                  ))}
                  {poll.options.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{poll.options.length - 3} more
                    </p>
                  )}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-[11px] font-normal">
                    {poll.totalVotes} vote{poll.totalVotes !== 1 ? "s" : ""}
                  </Badge>
                  <span>·</span>
                  <span>{poll.options.length} options</span>
                  <span>·</span>
                  <span>{formatDate(poll.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1 pt-1 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(poll.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Poll</DialogTitle>
            <DialogDescription>
              Add a question and at least two options for your poll.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="poll-question">
                Question <span className="text-destructive">*</span>
              </Label>
              <Input
                id="poll-question"
                placeholder="e.g. What is your favorite news category?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            {/* Options */}
            <div className="space-y-3">
              <Label>Options <span className="text-destructive">*</span></Label>
              {options.map((opt, index) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-6 shrink-0">
                    {index + 1}.
                  </span>
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={opt.text}
                    onChange={(e) => updateOption(opt.id, e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeOption(opt.id)}
                    disabled={options.length <= 2}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove option</span>
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addOption}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Create
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This poll will be permanently deleted. This action cannot be undone.
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
  )
}
