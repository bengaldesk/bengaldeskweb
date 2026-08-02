import type { Metadata } from "next";
import { Geist, Geist_Mono, Hind_Siliguri, Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Primary Bengali body/UI font — highly legible, widely used in Bengali news sites.
const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Editorial serif for headlines — adds authority & "newspaper" reliability.
const notoSerifBn = Noto_Serif_Bengali({
  variable: "--font-serif-bn",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
  openGraph: {
    title: "বার্তা | সর্বশেষ খবর",
    description: "বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদের নির্ভরযোগ্য উৎস।",
    siteName: "বার্তা",
    type: "website",
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
      className={`${hindSiliguri.variable} ${notoSerifBn.variable} ${geistSans.variable} ${geistMono.variable}`}
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
