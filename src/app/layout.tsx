import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
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

const notoBn = Noto_Sans_Bengali({
  variable: "--font-noto-bn",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="bn" suppressHydrationWarning>
      <body
        className={`${notoBn.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
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
