import type { Metadata } from "next";
import { Baloo_2, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";

/* 版式與 /real-food 是同一張紙，所以直接沿用那支樣式表，不另外寫一份。 */
import "../real-food/real-food.css";

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

const latinDisplay = Baloo_2({
  subsets: ["latin"],
  display: "swap",
  variable: "--rf-font-latin",
});

export const metadata: Metadata = {
  title: "牠的月餅｜中秋月餅公益｜匠寵 FURMOSA",
  description:
    "匠寵 × 巴克幫－浪犬之家的中秋尋家合作計畫：七個包裝對應七隻正在等家的狗狗，每售出一顆月餅提撥 NT$10，已捐贈 NT$11,480，捐款收據公開。",
  openGraph: {
    title: "牠的月餅｜中秋月餅公益｜匠寵 FURMOSA",
    description:
      "七個包裝，七個正在等家的故事。已捐贈 NT$11,480 給社團法人臺灣巴克動物懷善救援協會，收據公開。",
    locale: "zh_TW",
    type: "article",
  },
};

export default function MooncakeLayout({
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
