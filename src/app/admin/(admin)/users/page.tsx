"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  UserPlus,
  Inbox,
  Shield,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

interface UserItem {
  id: string
  email: string
  name: string | null
  role: string
  avatar: string | null
  active: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  _count: { posts: number; comments: number }
}

interface UserFormData {
  name: string
  email: string
  role: string
  password: string
  active: boolean
}

const emptyForm: UserFormData = {
  name: "",
  email: "",
  role: "editor",
  password: "",
  active: true,
}

function getRoleBadge(role: string) {
  switch (role) {
    case "admin":
      return "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20"
    case "editor":
      return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20"
    case "viewer":
      return "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/20"
    default:
      return ""
  }
}

function getRoleLabel(role: string) {
  switch (role) {
    case "admin":
      return "অ্যাডমিন"
    case "editor":
      return "সম্পাদক"
    case "viewer":
      return "দর্শক"
    default:
      return role
  }
}

export default function UsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<UserFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/users")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setUsers(data)
    } catch {
      toast.error("ব্যবহারকারী লোড করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (user: UserItem) => {
    setEditingId(user.id)
    setForm({
      name: user.name || "",
      email: user.email,
      role: user.role,
      password: "",
      active: user.active,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.email.trim()) {
      toast.error("ইমেইল আবশ্যক")
      return
    }
    if (!editingId && !form.password.trim()) {
      toast.error("পাসওয়ার্ড আবশ্যক")
      return
    }
    setSaving(true)
    try {
      const url = editingId
        ? `/api/admin/users/${editingId}`
        : "/api/admin/users"
      const method = editingId ? "PUT" : "POST"

      const body: Record<string, unknown> = {
        name: form.name || null,
        email: form.email,
        role: form.role,
        active: form.active,
      }
      if (form.password) {
        body.password = form.password
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      toast.success(editingId ? "ব্যবহারকারী আপডেট হয়েছে" : "নতুন ব্যবহারকারী তৈরি হয়েছে")
      setDialogOpen(false)
      fetchUsers()
    } catch {
      toast.error("সংরক্ষণ করতে সমস্যা হয়েছে")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    if (deleteId === session?.user?.id) {
      toast.error("আপনি নিজের অ্যাকাউন্ট মুছে ফেলতে পারবেন না")
      setDeleteId(null)
      return
    }
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/users/${deleteId}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "মুছে ফেলতে সমস্যা হয়েছে")
      }
      toast.success("ব্যবহারকারী মুছে ফেলা হয়েছে")
      setDeleteId(null)
      fetchUsers()
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
            ব্যবহারকারী ব্যবস্থাপনা
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            সকল ব্যবহারকারী দেখুন, তৈরি ও পরিচালনা করুন
          </p>
        </div>
        <Button onClick={openCreate}>
          <UserPlus className="h-4 w-4 mr-2" />
          নতুন ব্যবহারকারী
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <UsersSkeleton />
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Inbox className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              কোনো ব্যবহারকারী পাওয়া যায়নি
            </h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              নতুন ব্যবহারকারী তৈরি করুন
            </p>
            <Button onClick={openCreate} variant="outline" size="sm" className="mt-4">
              <UserPlus className="h-4 w-4 mr-2" />
              নতুন ব্যবহারকারী
            </Button>
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
                    <TableHead>নাম</TableHead>
                    <TableHead>ইমেইল</TableHead>
                    <TableHead>ভূমিকা</TableHead>
                    <TableHead>অবস্থা</TableHead>
                    <TableHead>সর্বশেষ লগইন</TableHead>
                    <TableHead className="text-center">সংবাদ</TableHead>
                    <TableHead className="text-right">কাজ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getRoleBadge(user.role)}
                        >
                          {getRoleLabel(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            user.active
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/20"
                          }
                        >
                          {user.active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString(
                              "bn-BD",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {user._count.posts.toLocaleString("bn-BD")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="সম্পাদনা"
                            onClick={() => openEdit(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            title="মুছুন"
                            onClick={() => setDeleteId(user.id)}
                            disabled={user.id === session?.user?.id}
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
            {users.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {user.name || "—"}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 ${getRoleBadge(user.role)}`}
                      >
                        {getRoleLabel(user.role)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          user.active
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px] px-1.5 py-0 shrink-0"
                            : "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/20 text-[10px] px-1.5 py-0 shrink-0"
                        }
                      >
                        {user.active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      সংবাদ: {user._count.posts.toLocaleString("bn-BD")}
                    </span>
                    <span>·</span>
                    <span>
                      মন্তব্য: {user._count.comments.toLocaleString("bn-BD")}
                    </span>
                    {user.lastLoginAt && (
                      <>
                        <span>·</span>
                        <span>
                          লগইন:{" "}
                          {new Date(user.lastLoginAt).toLocaleDateString(
                            "bn-BD",
                            { day: "numeric", month: "short" }
                          )}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-end gap-1 pt-1 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => openEdit(user)}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      সম্পাদনা
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(user.id)}
                      disabled={user.id === session?.user?.id}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      মুছুন
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              {editingId
                ? "ব্যবহারকারী সম্পাদনা"
                : "নতুন ব্যবহারকারী"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "ব্যবহারকারীর তথ্য আপডেট করুন"
                : "নতুন ব্যবহারকারীর তথ্য দিন"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="user-name">নাম</Label>
              <Input
                id="user-name"
                placeholder="ব্যবহারকারীর নাম"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">
                ইমেইল <span className="text-destructive">*</span>
              </Label>
              <Input
                id="user-email"
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">ভূমিকা</Label>
              <Select
                value={form.role}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, role: v }))
                }
              >
                <SelectTrigger id="user-role">
                  <SelectValue placeholder="ভূমিকা নির্বাচন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">অ্যাডমিন</SelectItem>
                  <SelectItem value="editor">সম্পাদক</SelectItem>
                  <SelectItem value="viewer">দর্শক</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-password">
                পাসওয়ার্ড{" "}
                {!editingId && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="user-password"
                type="password"
                placeholder={
                  editingId ? "ফাঁকা রাখলে পাসওয়ার্ড অপরিবর্তিত থাকবে" : "পাসওয়ার্ড দিন"
                }
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
              />
              {editingId && (
                <p className="text-xs text-muted-foreground">
                  পাসওয়ার্ড পরিবর্তন করতে নতুন পাসওয়ার্ড দিন, না হলে ফাঁকা রাখুন
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="user-active"
                checked={form.active}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, active: checked }))
                }
              />
              <Label htmlFor="user-active">সক্রিয়</Label>
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
              {deleteId === session?.user?.id
                ? "আপনি নিজের অ্যাকাউন্ট মুছে ফেলতে পারবেন না।"
                : "এই ব্যবহারকারীকে মুছে ফেলা হবে। এই কাজ পূর্বাবস্থায় ফেরানো যাবে না।"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting || deleteId === session?.user?.id}
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

function UsersSkeleton() {
  return (
    <>
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>নাম</TableHead>
                <TableHead>ইমেইল</TableHead>
                <TableHead>ভূমিকা</TableHead>
                <TableHead>অবস্থা</TableHead>
                <TableHead>সর্বশেষ লগইন</TableHead>
                <TableHead className="text-center">সংবাদ</TableHead>
                <TableHead className="text-right">কাজ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
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
      <div className="md:hidden space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex justify-end gap-1">
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
