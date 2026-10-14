import type { StaticImageData } from "next/image";

import beefCubes from "@/assets/poster/beef-cubes-loading.jpg";
import catGrass from "@/assets/poster/cat-grass-jerky.jpg";
import chickenCubes from "@/assets/poster/chicken-cubes-tower.jpg";
import cutletBag from "@/assets/poster/cutlet-bag.jpg";
import dogMidBite from "@/assets/poster/dog-mid-bite.jpg";
import dogWithCutlet from "@/assets/poster/dog-with-cutlet.jpg";
import menuSign from "@/assets/poster/menu-sign.jpg";

/**
 * 文案與照片取自 furmosa.com 首頁，排版沿用海報稿的格位，
 * 所以每一欄的字數都有上限：改字之前先看一眼下面的註記。
 */

export const SHOP_URL = "https://furmosa.com/collections/all";

export const MASTHEAD = {
  ribbon: "把熟悉的台灣味，放進牠的零食袋！",
  brand: "匠寵",
  category: "吃的・用的・有個性的",
} as const;

export const OPENING = {
  /** 直書大標：CJK 直立、拉丁字母側倒，由 writing-mode 自然處理。 */
  spine: "匠寵FURMOSA",
  claim: "雞不可失，毛孩的雞排攤！",
  lede:
    "我們不只是做零食，更像是一間為毛孩挑選好物的選品店。從食物到用品，一樣一樣慢慢挑。",
  /** 像食品標籤一樣的規格欄，讓開場除了氣勢之外也交代得出事實。 */
  specs: [
    { label: "招牌", value: "嚎大大・雞霸 — 純雞肉做的大片雞排，原味雞肉・淨重 50g・$165" },
    { label: "成分", value: "純雞肉製成，不添加香料、色素與防腐劑" },
    { label: "吃法", value: "可剪成小段，依體型調整份量；零食搭配主食與充足飲水" },
  ],
} as const;

export const RAIL_SLOGAN = "先看誰要吃，再挑今天的菜！";

export type ChapterPhoto = {
  image: StaticImageData;
  alt: string;
};

export type Chapter = {
  id: string;
  /** 延續首頁的編號索引語彙。 */
  index: string;
  /** 黃色標籤在海報上是直書，長標題分成兩欄，所以一欄一個字串。 */
  tag: string[];
  lines: string[];
  photos: ChapterPhoto[];
  /** full 為滿版單圖，pair 為主圖加一張小圖。 */
  media: "full" | "pair";
};

/*
 * 直書的本文一行就是一欄，欄高由海報的帶高決定，所以行數與每行字數都有上限：
 * 第一、二段每段五行、每行最多十四字；第三段之後每行最多十六字。
 * 標籤單欄最多八字，最後一段的兩欄標籤各最多九字。
 */
export const CHAPTERS: Chapter[] = [
  {
    id: "night-market",
    index: "01",
    tag: ["台灣味毛孩也有份"],
    lines: [
      "不是只有我們能逛夜市，",
      "把熟悉的台灣味，",
      "放進牠的零食袋。",
      "雞肉製泥、鋪平塑形，",
      "把雞排變成毛孩零食。",
    ],
    photos: [
      {
        image: cutletBag,
        alt: "大片雞排零食裝在印著 Thank you very much 的紙袋裡",
      },
    ],
    media: "full",
  },
  {
    id: "signature",
    index: "02",
    tag: ["純雞肉的內容"],
    lines: [
      "嚎大大・雞霸，",
      "純雞肉做的大片雞排，",
      "原味雞肉、淨重五十克。",
      "不添加香料、色素，",
      "也沒有防腐劑。",
    ],
    photos: [
      {
        image: dogWithCutlet,
        alt: "黑狗趴在地上，身邊放著插著雞排的匠寵紙袋",
      },
    ],
    media: "full",
  },
  {
    id: "daily-treat",
    index: "03",
    tag: ["不計形象大口咬下"],
    lines: [
      "可以剪成小段，",
      "依體型調整份量，",
      "當作日常的獎勵，慢慢分食。",
      "零食記得搭配主食",
      "與充足的飲水。",
    ],
    photos: [
      {
        image: dogMidBite,
        alt: "長毛黑狗張大嘴等著吃零食",
      },
      {
        image: menuSign,
        alt: "匠寵 FURMOSA 的今日菜單燈箱招牌",
      },
    ],
    media: "pair",
  },
  {
    id: "this-issue",
    index: "04",
    tag: ["本期好物上架中"],
    lines: [
      "大力士・牛肉丁凍乾，",
      "頂真做・雞肉丁凍乾，",
      "卵啵啵・柳葉魚凍乾，",
      "走敢若飛・鴨翅，",
      "從雞排、海味到咬感零食。",
    ],
    photos: [
      {
        image: beefCubes,
        alt: "牛肉丁凍乾排成一條 LOADING 進度條",
      },
    ],
    media: "full",
  },
  {
    id: "curated",
    index: "05",
    tag: ["只留下我們願意", "給自己毛孩用的"],
    lines: [
      "我們不只是做零食，",
      "更像一間為毛孩挑好物的選品店。",
      "從食物到日常用品，",
      "一樣一樣慢慢挑。",
      "雞肉加上貓草粉，",
      "做成容易分食的薄片，",
      "整片吃、捏碎拌食都可以。",
    ],
    photos: [
      {
        image: catGrass,
        alt: "草上飛貓草雞肉乾薄片，形狀像台灣島，旁邊有一隻黑貓抬頭看",
      },
      {
        image: chickenCubes,
        alt: "雞肉丁凍乾在烤網上疊成一座塔",
      },
    ],
    media: "pair",
  },
];

export const CLOSING = {
  title: "不知道先點哪一道",
  slogan: RAIL_SLOGAN,
  body: "幾題小測驗，幫你挑選零食組合，找到牠的零食路線。看照片、挑規格，喜歡的勾一份，就進購物車。",
  cta: "看本期好物",
} as const;
