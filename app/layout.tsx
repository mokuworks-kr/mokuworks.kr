import type { Metadata } from "next";
import { Asta_Sans } from "next/font/google";

import "./globals.css";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const astaSans = Asta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-asta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "mokuworks",
    template: "%s | mokuworks",
  },
  description:
    "1인 메이커 mokuworks의 그래픽 디자인 작업과 자체 웹앱 제품을 모은 사이트.",
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
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
