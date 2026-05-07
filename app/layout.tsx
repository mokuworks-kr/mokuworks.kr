import type { Metadata } from "next";
import { Asta_Sans } from "next/font/google";

import "./globals.css";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileBottomNav } from "@/components/MobileBottomNav";

const astaSans = Asta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-asta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mokuworks.kr"),
  title: {
    default: "mokuworks",
    template: "%s | mokuworks",
  },
  description:
    "1인 메이커 mokuworks의 그래픽 디자인 작업과 자체 웹앱 제품을 모은 사이트.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "mokuworks",
    images: ["/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${astaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-24 md:pb-0">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
