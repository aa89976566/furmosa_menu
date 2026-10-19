import type { Metadata } from "next";
import { Archivo_Black, Noto_Sans_TC } from "next/font/google";

import "./store.css";

/**
 * 這一頁是一張食物海報，不是一份報紙，所以兩套字都是無襯線的重黑體：
 * 中文走 Noto Sans TC（標題吃 900，內文吃 500/700），
 * 拉丁字走 Archivo Black——網版印刷的海報上那種一筆到底的粗黑字。
 *
 * CJK 字檔龐大，關掉 preload，讓瀏覽器依 unicode-range 按需取用。
 */
const sansTC = Noto_Sans_TC({
  weight: ["500", "700", "900"],
  display: "swap",
  preload: false,
  variable: "--po-font-sans",
});

/** 字標與價格用的粗黑拉丁字。拉丁子集很小，值得 preload。 */
const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--po-font-display",
});

export const metadata: Metadata = {
  title: "匠寵 FURMOSA｜今日菜單・真食材不調味",
  description:
    "匠寵是台灣的毛孩選物店。一鍋端上來的今日菜單：嚎大大雞霸、簡記牛肉地瓜、唐老鴨喉與本期活動，食材當天到市場採購，小量製作。",
  openGraph: {
    title: "匠寵 FURMOSA｜今日菜單・真食材不調味",
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
    <div className={`${sansTC.variable} ${display.variable}`}>{children}</div>
  );
}
