import type { Metadata } from "next";
import { notoSerifBengali, notoSansBengali } from "@/lib/fonts";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_NAME, ICON_FAVICON, ICON_APPLE, OG_IMAGE, SITE_URL } from "@/lib/brand";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | সর্বশেষ খবর, বিশ্লেষণ ও আরও অনেক কিছু`,
    template: `%s | ${SITE_NAME}`,
  },
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
    "The Bengal Desk",
  ],
  icons: {
    icon: ICON_FAVICON,
    shortcut: ICON_FAVICON,
    apple: ICON_APPLE,
  },
  openGraph: {
    title: `${SITE_NAME} | সর্বশেষ খবর`,
    description: "বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদের নির্ভরযোগ্য উৎস।",
    siteName: SITE_NAME,
    type: "website",
    url: SITE_URL,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | সর্বশেষ খবর`,
    description: "বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদের নির্ভরযোগ্য উৎস।",
    images: [OG_IMAGE],
  },
  manifest: "/manifest.json",
  other: {
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
      className={`${notoSansBengali.variable} ${notoSerifBengali.variable}`}
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
