import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["100", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam",
});

export const metadata: Metadata = {
  title: {
    default: "CineStream - Nền tảng Giải trí Tổng hợp",
    template: "%s | CineStream"
  },
  description: "CineStream - Nền tảng giải trí đa phương tiện: Xem phim 4K, Anime, đọc Manga và Story chất lượng cao. Trải nghiệm giải trí không giới hạn.",
  keywords: ["phim", "anime", "manga", "truyện chữ", "cinestream", "xem phim online", "đọc truyện online"],
  authors: [{ name: "CineStream Team" }],
  openGraph: {
    title: "CineStream - Nền tảng Giải trí Tổng hợp",
    description: "Xem phim 4K, Anime, đọc Manga và Story đỉnh cao.",
    url: "https://cinestream.com",
    siteName: "CineStream",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CineStream - Giải Trí Đa Phương Tiện",
    description: "Nền tảng xem phim và đọc truyện hàng đầu.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#e50914",
};

import { BottomNav } from "@/components/BottomNav";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-be-vietnam min-h-full flex flex-col bg-background text-on-surface">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <BottomNav />
      </body>
    </html>
  );
}
