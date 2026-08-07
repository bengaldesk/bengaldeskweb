import type { Metadata } from "next";
import { Geist, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Primary Bengali body/UI font — highly legible, widely used in Bengali news sites.
const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const BRAND_ICON_URL =
  "https://res.cloudinary.com/dtdmwcs4r/image/upload/v1768092478/LOGO-white_backgraound_tbasop.png";

export const metadata: Metadata = {
  title: "বার্তা | সর্বশেষ খবর, বিশ্লেষণ ও আরও অনেক কিছু",
  description:
    "বার্তা — বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ, রাজনীতি, খেলা, প্রযুক্তি, বিনোদন ও লাইফস্টাইলের নির্ভরযোগ্য উৎস।",
  keywords: [
    "বার্তা",
    "বাংলা সংবাদ",
    "খবর",
    "নিউজ",
    "রাজনীতি",
    "খেলা",
    "প্রযুক্তি",
    "Barta",
    "Bengali News",
  ],
  authors: [{ name: "বার্তা ডেস্ক" }],
  icons: {
    icon: BRAND_ICON_URL,
    shortcut: BRAND_ICON_URL,
    apple: BRAND_ICON_URL,
  },
  openGraph: {
    title: "বার্তা | সর্বশেষ খবর",
    description: "বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদের নির্ভরযোগ্য উৎস।",
    siteName: "বার্তা",
    type: "website",
    images: [{ url: BRAND_ICON_URL }],
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
      className={`${hindSiliguri.variable} ${geistSans.variable}`}
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
