"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { Loader2, Save, Globe, Share2, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import Image from "next/image"

interface SettingsForm {
  site_name: string
  site_description: string
  site_logo: string
  posts_per_page: string
  facebook_url: string
  twitter_url: string
  youtube_url: string
  contact_email: string
  contact_phone: string
  contact_address: string
}

const defaultValues: SettingsForm = {
  site_name: "",
  site_description: "",
  site_logo: "",
  posts_per_page: "10",
  facebook_url: "",
  twitter_url: "",
  youtube_url: "",
  contact_email: "",
  contact_phone: "",
  contact_address: "",
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const {
    register,
    reset,
    handleSubmit,
    watch,
  } = useForm<SettingsForm>({ defaultValues })

  const siteLogo = watch("site_logo")

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/settings")
      if (!res.ok) throw new Error()
      const data = await res.json()
      const formValues: SettingsForm = { ...defaultValues }
      for (const [key, value] of Object.entries(data)) {
        if (key in formValues) {
          ;(formValues as Record<string, string>)[key] = value as string
        }
      }
      reset(formValues)
    } catch {
      toast.error("সেটিংস লোড করতে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }, [reset])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const onSubmit = async (data: SettingsForm) => {
    setSaving(true)
    try {
      const settings = Object.entries(data).map(([key, value]) => ({
        key,
        value: value || "",
      }))
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error()
      toast.success("সেটিংস সংরক্ষণ হয়েছে")
    } catch {
      toast.error("সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">সাইট সেটিংস</h2>
        <p className="text-muted-foreground text-sm mt-1">
          আপনার সাইটের সাধারণ, সোশ্যাল মিডিয়া এবং যোগাযোগ সেটিংস পরিবর্তন করুন
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-5 w-5 text-primary" />
            সাধারণ তথ্য
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site_name">সাইটের নাম</Label>
            <Input
              id="site_name"
              placeholder="বার্তা"
              {...register("site_name")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site_description">সাইটের বিবরণ</Label>
            <Textarea
              id="site_description"
              placeholder="সাইট সম্পর্কে সংক্ষিপ্ত বিবরণ..."
              rows={3}
              {...register("site_description")}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site_logo">সাইট লোগো (URL)</Label>
              <Input
                id="site_logo"
                placeholder="https://example.com/logo.png"
                {...register("site_logo")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="posts_per_page">প্রতি পৃষ্ঠায় সংবাদ সংখ্যা</Label>
              <Input
                id="posts_per_page"
                type="number"
                min={1}
                max={50}
                {...register("posts_per_page")}
              />
            </div>
          </div>
          {siteLogo && (
            <div className="space-y-2">
              <Label>লোগো প্রিভিউ</Label>
              <div className="relative h-16 w-48 rounded-lg border border-border overflow-hidden bg-muted/30">
                <Image
                  src={siteLogo}
                  alt="লোগো প্রিভিউ"
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Media Settings */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Share2 className="h-5 w-5 text-primary" />
            সোশ্যাল মিডিয়া
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook_url">ফেসবুক URL</Label>
              <Input
                id="facebook_url"
                placeholder="https://facebook.com/..."
                {...register("facebook_url")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter_url">টুইটার / এক্স URL</Label>
              <Input
                id="twitter_url"
                placeholder="https://twitter.com/..."
                {...register("twitter_url")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube_url">ইউটিউব URL</Label>
              <Input
                id="youtube_url"
                placeholder="https://youtube.com/..."
                {...register("youtube_url")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Settings */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Phone className="h-5 w-5 text-primary" />
            যোগাযোগ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">ইমেইল</Label>
              <Input
                id="contact_email"
                type="email"
                placeholder="info@example.com"
                {...register("contact_email")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">ফোন নম্বর</Label>
              <Input
                id="contact_phone"
                placeholder="+৮৮০ ১৭০০-০০০০০০"
                {...register("contact_phone")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_address">ঠিকানা</Label>
            <Input
              id="contact_address"
              placeholder="ঢাকা, বাংলাদেশ"
              {...register("contact_address")}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={saving} size="lg">
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <Save className="h-4 w-4 mr-2" />
          সংরক্ষণ করুন
        </Button>
      </div>
    </form>
  )
}
