import type { Metadata } from "next";
import "./globals.css";
import "./works-ui.css";

export const metadata: Metadata = {
  title: "匠寵凍乾目錄｜Furmosa",
  description: "匠寵 Furmosa — 以編號清單記錄每一次凍乾上架。把選擇還給牠。",
  openGraph: {
    title: "匠寵凍乾目錄｜Furmosa",
    description: "匠寵 Furmosa — 以編號清單記錄每一次凍乾上架。把選擇還給牠。",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "嗷嗚計畫｜Furmosa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "匠寵凍乾目錄｜Furmosa",
    description: "匠寵 Furmosa — 以編號清單記錄每一次凍乾上架。把選擇還給牠。",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant-TW">
      <body className="antialiased">{children}</body>
    </html>
  );
}
