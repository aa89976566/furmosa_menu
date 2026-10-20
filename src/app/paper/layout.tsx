import type { Metadata } from "next";
import { Baloo_2, Noto_Serif_TC } from "next/font/google";

import "./paper.css";

/**
 * 市場 DM 的中文幾乎全是粗明體，所以這頁只用一套 Noto Serif TC，
 * 由字重拉開報頭、店名與內文的層級。CJK 字檔大，關掉 preload 依需求取用。
 */
const serifTC = Noto_Serif_TC({
  display: "swap",
  preload: false,
  variable: "--pp-font-serif",
});

/** 大字數字專用。拉丁子集很小，值得 preload。 */
const numerals = Baloo_2({
  subsets: ["latin"],
  display: "swap",
  variable: "--pp-font-num",
});

export const metadata: Metadata = {
  title: "匠寵市場報｜第 01 號",
  description:
    "以台式傳統市場 DM 的版面，重編匠寵的全部內容：單一成分凍乾、換罐計畫北中南 47 家、上架清單與四條服務線。",
  openGraph: {
    title: "匠寵市場報｜第 01 號",
    description:
      "以台式傳統市場 DM 的版面，重編匠寵的全部內容。本報所列數字皆為實際紀錄。",
    locale: "zh_TW",
    type: "article",
  },
};

export default function PaperLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${serifTC.variable} ${numerals.variable}`}>{children}</div>
  );
}
