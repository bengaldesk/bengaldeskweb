"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  FolderOpen,
  Inbox,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
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

interface CategoryItem {
  id: string
  name: string
  nameBn: string | null
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
  _count: { posts: number }
}

interface CategoryFormData {
  name: string
  nameBn: string
  slug: string
  description: string
  icon: string
  color: string
  order: number
  active: boolean
}

const emptyForm: CategoryFormData = {
  name: "",
  nameBn: "",
  slug: "",
  description: "",
  icon: "",
  color: "",
  order: 0,
  active: true,
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CategoryFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [slugEdited, setSlugEdited] = useState(false)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/categories")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCategories(data)
    } catch {
      toast.error("বিভাগ লোড করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setSlugEdited(false)
    setDialogOpen(true)
  }

  const openEdit = (cat: CategoryItem) => {
    setEditingId(cat.id)
    setForm({
      name: cat.name,
      nameBn: cat.nameBn || "",
      slug: cat.slug,
      description: cat.description || "",
      icon: cat.icon || "",
      color: cat.color || "",
      order: cat.order,
      active: cat.active,
    })
    setSlugEdited(true)
    setDialogOpen(true)
  }

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      ...(slugEdited ? {} : { slug: generateSlug(value) }),
    }))
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("ইংরেজি নাম এবং স্লাগ আবশ্যক")
      return
    }
    setSaving(true)
    try {
      const url = editingId
        ? `/api/admin/categories/${editingId}`
        : "/api/admin/categories"
      const method = editingId ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          nameBn: form.nameBn || null,
          slug: form.slug,
          description: form.description || null,
          icon: form.icon || null,
          color: form.color || null,
          order: form.order,
          active: form.active,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success(editingId ? "বিভাগ আপডেট হয়েছে" : "নতুন বিভাগ তৈরি হয়েছে")
      setDialogOpen(false)
      fetchCategories()
    } catch {
      toast.error("সংরক্ষণ করতে সমস্যা হয়েছে")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/categories/${deleteId}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "মুছে ফেলতে সমস্যা হয়েছে")
      }
      toast.success("বিভাগ মুছে ফেলা হয়েছে")
      setDeleteId(null)
      fetchCategories()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "মুছে ফেলতে সমস্যা হয়েছে"
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            বিভাগ ব্যবস্থাপনা
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            সকল বিভাগ দেখুন, তৈরি ও পরিচালনা করুন
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          নতুন বিভাগ
        </Button>
      </div>

      {/* Category Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <div className="flex justify-end gap-1">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Inbox className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              কোনো বিভাগ পাওয়া যায়নি
            </h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              নতুন বিভাগ তৈরি করুন
            </p>
            <Button onClick={openCreate} variant="outline" size="sm" className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              নতুন বিভাগ
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Card key={cat.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: cat.color
                          ? `${cat.color}20`
                          : "hsl(var(--muted))",
                        color: cat.color || "hsl(var(--muted-foreground))",
                      }}
                    >
                      <FolderOpen className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {cat.nameBn || cat.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {cat.name}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      cat.active
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 shrink-0"
                        : "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/20 shrink-0"
                    }
                  >
                    {cat.active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="bg-muted px-2 py-0.5 rounded-md font-mono">
                    {cat.slug}
                  </span>
                  <span>·</span>
                  <span>
                    সংবাদ: {cat._count.posts.toLocaleString("bn-BD")}
                  </span>
                </div>

                {cat.color && (
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full border border-border"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-xs text-muted-foreground font-mono">
                      {cat.color}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 pt-1 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => openEdit(cat)}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    সম্পাদনা
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(cat.id)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "বিভাগ সম্পাদনা" : "নতুন বিভাগ"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "বিভাগের তথ্য আপডেট করুন"
                : "নতুন বিভাগের তথ্য দিন"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cat-name">
                নাম (ইংরেজি) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cat-name"
                placeholder="e.g. Politics"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-namebn">নাম (বাংলা)</Label>
              <Input
                id="cat-namebn"
                placeholder="e.g. রাজনীতি"
                value={form.nameBn}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, nameBn: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-slug">
                স্লাগ <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cat-slug"
                placeholder="e.g. politics"
                value={form.slug}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                  setSlugEdited(true)
                }}
              />
              {!slugEdited && (
                <p className="text-xs text-muted-foreground">
                  ইংরেজি নাম থেকে স্বয়ংক্রিয়ভাবে তৈরি হবে
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-desc">বিবরণ</Label>
              <Textarea
                id="cat-desc"
                placeholder="বিভাগ সম্পর্কে সংক্ষিপ্ত বিবরণ..."
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cat-icon">আইকন (Lucide)</Label>
                <Input
                  id="cat-icon"
                  placeholder="e.g. Newspaper"
                  value={form.icon}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, icon: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-color">রং (Hex)</Label>
                <Input
                  id="cat-color"
                  placeholder="e.g. #ef4444"
                  value={form.color}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, color: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cat-order">ক্রম</Label>
                <Input
                  id="cat-order"
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      order: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="cat-active"
                  checked={form.active}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, active: checked }))
                  }
                />
                <Label htmlFor="cat-active">সক্রিয়</Label>
              </div>
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
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              {editingId ? "আপডেট" : "তৈরি করুন"}
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
              এই বিভাগটি মুছে ফেলা হবে। বিভাগে সংবাদ থাকলে মুছে ফেলা যাবে না।
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
