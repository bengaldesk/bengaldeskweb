"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const postSchema = z.object({
  title: z.string().min(1, "শিরোনাম আবশ্যক"),
  categoryId: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  sourceUrl: z.string().optional(),
  sourceName: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  published: z.boolean(),
  featured: z.boolean(),
  breaking: z.boolean(),
})

type PostFormValues = z.infer<typeof postSchema>

interface Category {
  id: string
  name: string
  nameBn: string | null
  slug: string
}

interface PostFormProps {
  postId?: string
}

export default function PostForm({ postId }: PostFormProps) {
  const router = useRouter()
  const isEditing = !!postId
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingPost, setLoadingPost] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [seoOpen, setSeoOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState("")

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      summary: "",
      content: "",
      image: "",
      sourceUrl: "",
      sourceName: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      published: false,
      featured: false,
      breaking: false,
    },
  })

  const { register, control, handleSubmit, setValue, watch, reset } = form
  const imageUrl = watch("image")

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch {
      // silent
    }
  }, [])

  // Fetch post for editing
  const fetchPost = useCallback(async () => {
    if (!postId) return
    setLoadingPost(true)
    try {
      const res = await fetch(`/api/admin/posts/${postId}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      reset({
        title: data.title || "",
        categoryId: data.categoryId || "",
        summary: data.summary || "",
        content: data.content || "",
        image: data.image || "",
        sourceUrl: data.sourceUrl || "",
        sourceName: data.sourceName || "",
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
        metaKeywords: data.metaKeywords || "",
        published: data.published || false,
        featured: data.featured || false,
        breaking: data.breaking || false,
      })
      if (data.image) setImagePreview(data.image)
    } catch {
      toast.error("সংবাদ লোড করতে সমস্যা হয়েছে")
      router.push("/admin/posts")
    } finally {
      setLoadingPost(false)
    }
  }, [postId, reset, router])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  // Image preview
  useEffect(() => {
    if (imageUrl) {
      setImagePreview(imageUrl)
    } else {
      setImagePreview("")
    }
  }, [imageUrl])

  const onSubmit = async (data: PostFormValues, publishNow: boolean) => {
    setSubmitting(true)
    try {
      const payload = {
        ...data,
        published: publishNow,
      }

      const url = isEditing
        ? `/api/admin/posts/${postId}`
        : "/api/admin/posts"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error || "সমস্যা হয়েছে")
      }

      toast.success(
        isEditing
          ? "সংবাদ সফলভাবে আপডেট হয়েছে"
          : publishNow
            ? "সংবাদ সফলভাবে প্রকাশিত হয়েছে"
            : "সংবাদ ড্রাফট সংরক্ষিত হয়েছে"
      )
      router.push("/admin/posts")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "সংবাদ সংরক্ষণ করতে সমস্যা হয়েছে")
    } finally {
      setSubmitting(false)
    }
  }

  const handleFormSubmit = (data: PostFormValues) => {
    onSubmit(data, data.published)
  }

  const handleDraft = () => {
    handleSubmit((data) => onSubmit(data, false))()
  }

  const handlePublish = () => {
    handleSubmit((data) => onSubmit(data, true))()
  }

  if (loadingPost) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6 space-y-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Main Fields Card */}
      <Card>
        <CardContent className="p-6 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              শিরোনাম <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="সংবাদের শিরোনাম লিখুন"
              {...register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">বিভাগ</Label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(v) => field.onChange(v === "none" ? "" : v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="বিভাগ নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">বিভাগ নেই</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nameBn || cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">সারসংক্ষেপ</Label>
            <Textarea
              id="summary"
              rows={3}
              placeholder="সংবাদের সারসংক্ষেপ লিখুন"
              {...register("summary")}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">বিষয়বস্তু</Label>
            <Textarea
              id="content"
              rows={12}
              placeholder="সংবাদের বিস্তারিত বিষয়বস্তু লিখুন"
              {...register("content")}
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image">ছবির লিংক</Label>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                {...register("image")}
              />
            </div>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="প্রিভিউ"
                  className="h-40 w-auto max-w-full rounded-lg border object-cover bg-muted"
                  onError={() => setImagePreview("")}
                />
              </div>
            )}
          </div>

          {/* Source URL + Source Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sourceUrl">উৎসের লিংক</Label>
              <Input
                id="sourceUrl"
                placeholder="https://source.com/..."
                {...register("sourceUrl")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceName">উৎসের নাম</Label>
              <Input
                id="sourceName"
                placeholder="উৎসের নাম লিখুন"
                {...register("sourceName")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toggles Card */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <CardTitle className="text-base">বিকল্প</CardTitle>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="published" className="cursor-pointer">প্রকাশিত</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  এই সংবাদটি সর্বজনীনভাবে দেখানো হবে
                </p>
              </div>
              <Controller
                control={control}
                name="published"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="featured" className="cursor-pointer">বৈশিষ্ট্যযুক্ত</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  হোমপেজে বিশেষভাবে প্রদর্শিত হবে
                </p>
              </div>
              <Controller
                control={control}
                name="featured"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="breaking" className="cursor-pointer">ব্রেকিং নিউজ</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  জরুরি ব্রেকিং নিউজ হিসেবে চিহ্নিত হবে
                </p>
              </div>
              <Controller
                control={control}
                name="breaking"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Collapsible */}
      <Card>
        <CardContent className="p-0">
          <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
            <CollapsibleTrigger className="w-full flex items-center justify-between p-6 hover:bg-accent/50 transition-colors rounded-t-lg">
              <CardTitle className="text-base">SEO সেটিংস</CardTitle>
              {seoOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-6 space-y-4 pt-2 border-t">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">মেটা শিরোনাম</Label>
                  <Input
                    id="metaTitle"
                    placeholder="সার্চ ইঞ্জিনের জন্য শিরোনাম"
                    {...register("metaTitle")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">মেটা বিবরণ</Label>
                  <Textarea
                    id="metaDescription"
                    rows={3}
                    placeholder="সার্চ ইঞ্জিনের জন্য বিবরণ"
                    {...register("metaDescription")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">মেটা কীওয়ার্ড</Label>
                  <Input
                    id="metaKeywords"
                    placeholder="কীওয়ার্ড1, কীওয়ার্ড2, কীওয়ার্ড3"
                    {...register("metaKeywords")}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pb-8">
        <Link href="/admin/posts">
          <Button type="button" variant="outline">
            বাতিল
          </Button>
        </Link>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            className="flex-1 sm:flex-none"
            disabled={submitting}
            onClick={handleDraft}
          >
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            ড্রাফট সংরক্ষণ
          </Button>
          <Button
            type="button"
            className="flex-1 sm:flex-none"
            disabled={submitting}
            onClick={handlePublish}
          >
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            প্রকাশ করুন
          </Button>
        </div>
      </div>
    </form>
  )
}
