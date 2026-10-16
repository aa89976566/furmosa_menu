import type { Metadata } from "next";
import { Bodoni_Moda, Noto_Serif_TC } from "next/font/google";

import "./store.css";

/**
 * 這張紙只上兩支墨、也只用兩套字：
 * 拉丁字是 Didone（報頭、價格、小型大寫的標語），中文全是明體。
 * CJK 字檔龐大，關掉 preload，讓瀏覽器依 unicode-range 按需取用。
 */
const serifTC = Noto_Serif_TC({
  weight: ["400", "500", "700", "900"],
  display: "swap",
  preload: false,
  variable: "--st-font-serif",
});

/** 報頭的 FURMOSA 要很重，拉丁子集很小，值得 preload。 */
const didone = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--st-font-didone",
});

export const metadata: Metadata = {
  title: "匠寵 FURMOSA｜真食材・不調味・陪牠看更大的世界",
  description:
    "匠寵是台灣的毛孩選物店。從手工食品開始，食材當天到市場採購，小量製作。本期六大 DROP、嚴選商品與浪浪支持計畫都在這一頁。",
  openGraph: {
    title: "匠寵 FURMOSA｜真食材・不調味・陪牠看更大的世界",
    description:
      "匠寵是台灣的毛孩選物店。從手工食品開始，食材當天到市場採購，小量製作。",
    locale: "zh_TW",
    type: "website",
  },
};

export default function StoreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${serifTC.variable} ${didone.variable}`}>{children}</div>
  );
}
