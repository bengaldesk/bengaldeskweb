"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Eye,
  EyeOff,
  LogIn,
  Shield,
  Newspaper,
  Zap,
  BarChart3,
  Check,
} from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password. Please try again.")
      } else {
        router.push("/admin")
        router.refresh()
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: Newspaper,
      title: "Content Management",
      desc: "Create, edit, and publish news articles with a powerful editor.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      desc: "Track views, engagement, and performance metrics in real time.",
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      desc: "Built for speed with optimized delivery and 99.9% uptime.",
    },
  ]

  return (
    <div className="min-h-screen flex bg-muted/40">
      {/* Left branded panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] flex-col justify-between bg-primary text-primary-foreground p-10 xl:p-14 relative overflow-hidden">
        {/* Decorative gradient orb */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary-foreground/5 pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full bg-primary-foreground/5 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-11 h-11 bg-primary-foreground/15 rounded-xl backdrop-blur-sm">
              <Newspaper className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Bengal Desk</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-3xl xl:text-4xl font-bold leading-tight">
              Professional News
              <br />
              Management System
            </h1>
            <p className="mt-4 text-primary-foreground/70 text-base leading-relaxed max-w-sm">
              A modern editorial platform designed for Bengali news teams. Publish faster, reach wider.
            </p>
          </div>

          <div className="space-y-5">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="mt-0.5 flex items-center justify-center w-9 h-9 rounded-lg bg-primary-foreground/10 shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{feature.title}</p>
                    <p className="text-primary-foreground/60 text-sm mt-0.5">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-primary-foreground/40 text-xs">
            &copy; {new Date().getFullYear()} Bengal Desk. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right form area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile-only logo */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
              <Newspaper className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Bengal Desk</span>
          </div>

          <Card className="shadow-lg border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-xl">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Welcome back</CardTitle>
                  <CardDescription className="text-sm">
                    Sign in to Bengal Desk Admin
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@bengaldesk.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={loading}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      disabled={loading}
                      className="h-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Signing in…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo credentials info box */}
          <div className="rounded-lg border bg-muted/50 px-4 py-3.5">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold">Demo Credentials</p>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Email:</span>{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                  admin@bengaldesk.com
                </code>
              </p>
              <p>
                <span className="font-medium text-foreground">Password:</span>{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                  admin123
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}