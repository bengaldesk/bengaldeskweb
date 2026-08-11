"use client"

import { useState, useEffect, useCallback, Fragment } from "react"
import { useForm } from "react-hook-form"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface SettingsForm {
  siteName: string
  siteDescription: string
  siteLogoUrl: string
  postsPerPage: string
  facebookUrl: string
  twitterUrl: string
  youtubeUrl: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
}

const keyMap: Record<keyof SettingsForm, string> = {
  siteName: "siteName",
  siteDescription: "siteDescription",
  siteLogoUrl: "siteLogoUrl",
  postsPerPage: "postsPerPage",
  facebookUrl: "facebookUrl",
  twitterUrl: "twitterUrl",
  youtubeUrl: "youtubeUrl",
  contactEmail: "contactEmail",
  contactPhone: "contactPhone",
  contactAddress: "contactAddress",
}

const defaultValues: SettingsForm = {
  siteName: "",
  siteDescription: "",
  siteLogoUrl: "",
  postsPerPage: "10",
  facebookUrl: "",
  twitterUrl: "",
  youtubeUrl: "",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sticky, setSticky] = useState(false)

  const { register, handleSubmit, reset, watch } = useForm<SettingsForm>({
    defaultValues,
  })

  const logoUrl = watch("siteLogoUrl")

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/settings")
      if (!res.ok) throw new Error()
      const data = await res.json()
      reset({
        siteName: data.siteName || "",
        siteDescription: data.siteDescription || "",
        siteLogoUrl: data.siteLogoUrl || "",
        postsPerPage: data.postsPerPage || "10",
        facebookUrl: data.facebookUrl || "",
        twitterUrl: data.twitterUrl || "",
        youtubeUrl: data.youtubeUrl || "",
        contactEmail: data.contactEmail || "",
        contactPhone: data.contactPhone || "",
        contactAddress: data.contactAddress || "",
      })
    } catch {
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }, [reset])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const onSubmit = async (values: SettingsForm) => {
    setSaving(true)
    try {
      const settings = Object.entries(values).map(([field, value]) => ({
        key: keyMap[field as keyof SettingsForm],
        value: String(value),
      }))
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error()
      toast.success("Settings saved successfully")
    } catch {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const headerClassName = sticky
    ? "sticky top-0 z-10 py-3 border-b bg-background flex items-center justify-between gap-4"
    : "flex items-center justify-between gap-4 transition-all duration-200"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className={headerClassName}>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <Button type="submit" disabled={saving || loading}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      {loading && (
        <Fragment>
          <Card>
            <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
            <CardContent><Skeleton className="h-10 w-full" /></CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </Fragment>
      )}

      {!loading && (
        <Fragment>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" placeholder="The Bengal Desk" {...register("siteName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea id="siteDescription" placeholder="A brief description of your news portal…" rows={3} {...register("siteDescription")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteLogoUrl">Site Logo URL</Label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input id="siteLogoUrl" placeholder="/logo.svg" {...register("siteLogoUrl")} />
                  </div>
                  {logoUrl && (
                    <div className="h-10 w-10 rounded-lg border bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={logoUrl}
                        alt="Logo preview"
                        className="h-full w-full object-contain p-1"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postsPerPage">Posts Per Page</Label>
                <Input id="postsPerPage" type="number" min={1} {...register("postsPerPage")} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Social Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebookUrl">Facebook URL</Label>
                  <Input id="facebookUrl" placeholder="https://facebook.com/..." {...register("facebookUrl")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitterUrl">Twitter URL</Label>
                  <Input id="twitterUrl" placeholder="https://twitter.com/..." {...register("twitterUrl")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl">YouTube URL</Label>
                  <Input id="youtubeUrl" placeholder="https://youtube.com/..." {...register("youtubeUrl")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" type="email" placeholder="contact@bengaldesk.com" {...register("contactEmail")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input id="contactPhone" placeholder="+880 1234 567890" {...register("contactPhone")} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactAddress">Contact Address</Label>
                <Textarea id="contactAddress" placeholder="Full office address…" rows={3} {...register("contactAddress")} />
              </div>
            </CardContent>
          </Card>
        </Fragment>
      )}
    </form>
  )
}
