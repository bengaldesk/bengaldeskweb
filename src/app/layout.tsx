import type { Metadata } from "next";
import { tiroBangla, hindSiliguri } from "@/lib/fonts";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "বার্তা | সর্বশেষ খবর, বিশ্লেষণ ও আরও অনেক কিছু",
  description:
    "বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ, রাজনীতি, খেলা, প্রযুক্তি, বিনোদন ও লাইফস্টাইলের নির্ভরযোগ্য উৎস।",
  keywords: [
    "বাংলা সংবাদ",
    "খবর",
    "নিউজ",
    "রাজনীতি",
    "খেলা",
    "প্রযুক্তি",
    "বিনোদন",
    "Bengali News",
  ],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "বার্তা | সর্বশেষ খবর",
    description: "বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদের নির্ভরযোগ্য উৎস।",
    siteName: "বার্তা",
    type: "website",
    images: [{ url: "/logo.png" }],
  },
  other: {
    // Remove any tech stack fingerprints
    'X-Powered-By': 'Anonymous',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${tiroBangla.variable} ${hindSiliguri.variable}`}
    >
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
