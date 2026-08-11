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

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

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
  slug: string
  description: string
  color: string
  order: number
  active: boolean
}

const emptyForm: CategoryFormData = {
  name: "",
  slug: "",
  description: "",
  color: "",
  order: 0,
  active: true,
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

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

  /* ---- Data fetching ---- */

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/categories")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCategories(data)
    } catch {
      toast.error("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  /* ---- Dialog helpers ---- */

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
      slug: cat.slug,
      description: cat.description || "",
      color: cat.color || "",
      order: cat.order,
      active: cat.active,
    })
    setSlugEdited(true)
    setDialogOpen(true)
  }

  /* ---- Form handlers ---- */

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      ...(slugEdited ? {} : { slug: generateSlug(value) }),
    }))
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Name and slug are required")
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
          slug: form.slug,
          description: form.description || null,
          color: form.color || null,
          order: form.order,
          active: form.active,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success(editingId ? "Category updated" : "Category created")
      setDialogOpen(false)
      fetchCategories()
    } catch {
      toast.error("Failed to save category")
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
        throw new Error(data.error || "Failed to delete")
      }
      toast.success("Category deleted")
      setDeleteId(null)
      fetchCategories()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete")
    } finally {
      setDeleting(false)
    }
  }

  /* ---- Render ---- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          {!loading && (
            <Badge variant="secondary" className="text-xs font-normal">
              {categories.length}
            </Badge>
          )}
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        /* Empty State */
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Inbox className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              No categories yet
            </h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Create your first category to organize posts.
            </p>
            <Button
              onClick={openCreate}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Category Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Card key={cat.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                {/* Top row: icon + name + status */}
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
                        {cat.name}
                      </h3>
                      <p className="text-xs font-mono text-muted-foreground truncate">
                        {cat.slug}
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
                    {cat.active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Meta row: color swatch + post count */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {cat.color && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className="inline-block h-4 w-4 rounded-full border border-border"
                        style={{ backgroundColor: cat.color }}
                      />
                    </span>
                  )}
                  <Badge variant="secondary" className="text-[11px] font-normal">
                    {cat._count.posts} {cat._count.posts === 1 ? "post" : "posts"}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1 pt-1 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => openEdit(cat)}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(cat.id)}
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

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Category" : "New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the category details below."
                : "Fill in the details to create a new category."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="cat-name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cat-name"
                placeholder="e.g. Politics"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="cat-slug">
                Slug <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cat-slug"
                placeholder="e.g. politics"
                value={form.slug}
                className="font-mono text-sm"
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                  setSlugEdited(true)
                }}
              />
              {!slugEdited && (
                <p className="text-xs text-muted-foreground">
                  Auto-generated from the name above. Click to edit manually.
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                placeholder="A brief description of this category…"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>

            {/* Color + Order */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cat-color">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="cat-color"
                    placeholder="#ef4444"
                    className="font-mono text-sm"
                    value={form.color}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, color: e.target.value }))
                    }
                  />
                  {form.color && (
                    <span
                      className="inline-block h-8 w-8 rounded-lg border border-border shrink-0"
                      style={{ backgroundColor: form.color }}
                    />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-order">Order</Label>
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
            </div>

            {/* Active Switch */}
            <div className="flex items-center gap-3">
              <Switch
                id="cat-active"
                checked={form.active}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, active: checked }))
                }
              />
              <Label htmlFor="cat-active" className="cursor-pointer">
                Active
              </Label>
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
              {editingId ? "Update" : "Create"}
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
              This category will be permanently deleted. Categories with posts
              cannot be removed. This action cannot be undone.
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
