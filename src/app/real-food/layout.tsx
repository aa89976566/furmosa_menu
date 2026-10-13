import type { Metadata } from "next";
import { Baloo_2, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";

import "./real-food.css";

/**
 * 海報分工明確：本文是明體，招牌字（報頭、黃標籤、書脊、標語條）是黑體。
 * CJK 字檔龐大，兩套都關掉 preload，讓瀏覽器依 unicode-range 按需取用。
 */
const serifTC = Noto_Serif_TC({
  display: "swap",
  preload: false,
  variable: "--rf-font-serif",
});

const sansTC = Noto_Sans_TC({
  weight: ["700", "900"],
  display: "swap",
  preload: false,
  variable: "--rf-font-sans",
});

/** 只替 FURMOSA 字標服務，拉丁子集很小，值得 preload。 */
const latinDisplay = Baloo_2({
  subsets: ["latin"],
  display: "swap",
  variable: "--rf-font-latin",
});

export const metadata: Metadata = {
  title: "毛孩的真食堂｜匠寵 FURMOSA",
  description:
    "台灣鮮肉手作，給毛孩最真的幸福。台灣在地雞肉、職人手工修整、低溫乾燥，全程台灣製造。",
  openGraph: {
    title: "毛孩的真食堂｜匠寵 FURMOSA",
    description:
      "台灣鮮肉手作，給毛孩最真的幸福。台灣在地雞肉、職人手工修整、低溫乾燥，全程台灣製造。",
    locale: "zh_TW",
    type: "article",
  },
};

export default function RealFoodLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${serifTC.variable} ${sansTC.variable} ${latinDisplay.variable}`}
    >
      {children}
    </div>
  );
}
