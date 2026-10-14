import type { StaticImageData } from "next/image";

import beefCubes from "@/assets/poster/beef-cubes-loading.jpg";
import charityMooncake from "@/assets/poster/charity-mooncake.jpg";
/* 頭條是去背的，透明處會透出紙色，所以存成帶 alpha 的 webp。 */
import dogCutletCutout from "@/assets/poster/dog-cutlet-cutout.webp";
import dogMidBite from "@/assets/poster/dog-mid-bite.jpg";
import menuSign from "@/assets/poster/menu-sign.jpg";
/* 直幅版的小輝；橫幅的那一張還留著給 /mooncake 用。 */
import strayDog from "@/assets/poster/stray-dog-siaohuei-tall.jpg";

/**
 * 文案與照片取自 furmosa.com 首頁，排版沿用海報稿的格位，
 * 所以每一欄的字數都有上限：改字之前先看一眼下面的註記。
 */

export const SHOP_URL = "https://furmosa.com/collections/all";

/** 公益活動：匠寵 × 巴克幫－浪犬之家的中秋尋家合作計畫。 */
export const CHARITY_URL = "https://them-stock-moon.furmosa.com/";

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
    {
      label: "公益",
      value:
        "中秋尋家合作計畫 — 匠寵 × 巴克幫－浪犬之家，每售出一顆月餅提撥 NT$10（活動已結單）",
    },
  ],
} as const;

export const RAIL_SLOGAN = "先看誰要吃，再挑今天的菜！";

export type ChapterPhoto = {
  image: StaticImageData;
  alt: string;
  /**
   * 去背的照片：透明處要透出格子的紙色，而不是照片格的底色，
   * 而且窄螢幕不能把它鎖成橫幅，不然剪影會被裁掉。
   */
  cutout?: boolean;
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
 * 一條帶就是一個主題，帶與帶之間由藍色格線分開；每一帶的編排都一樣，
 * 由左而右是「照片｜小照片｜直書本文｜黃色標籤」。
 *
 * 直書的一行就是一欄，一行的字數＝帶高÷字級，行數×行距＝字塊的寬度，
 * 而照片吃掉的是剩下的寬度——所以分行同時決定了字塊填不填滿帶高、
 * 以及照片是什麼長寬比。本文字級是海報原稿的兩倍，換算出來的上限是：
 * 頭條帶每行十五字、第二與第三帶十字、公益帶九字。
 *
 * 同一帶的各行要一樣長（只有最後一行可以短），字塊才是方正的一塊；
 * 字數不夠就會在帶裡留下空白紙，所以是照字數斷行，不是照語氣斷行。
 * 行首不留標點。標籤單欄最多八字，兩欄的標籤各最多八字。
 */
export const CHAPTERS: Chapter[] = [
  {
    id: "signature",
    index: "01",
    /** 頭條：主標是商品名，副標接首頁的台灣味。 */
    tag: ["嚎大大・雞霸", "台灣味毛孩也有份"],
    lines: [
      "嚎大大・雞霸，純雞肉做的大片雞",
      "排，原味雞肉、淨重五十克。不添",
      "加香料、色素，也沒有防腐劑。雞",
      "肉製泥、鋪平塑形，把雞排變成毛",
      "孩零食。不是只有我們能逛夜市，",
      "台灣味牠也有份。",
    ],
    photos: [
      {
        image: dogCutletCutout,
        alt: "黑狗臥著，前腳攬著一只插著大片雞排的匠寵紙袋",
        cutout: true,
      },
    ],
    media: "full",
  },
  {
    id: "daily-treat",
    index: "02",
    tag: ["不計形象", "大口咬下"],
    lines: [
      "可以剪成小段，依體型",
      "調整份量，當作日常的",
      "獎勵，慢慢分食。零食",
      "記得搭配主食與充足的",
      "飲水。",
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
    index: "03",
    tag: ["本期好物上架中"],
    /**
     * 這一帶是清單，一行一品，所以不下逗號——行就是分隔。
     * 這一帶的帶高只容得下九字，排不完的那一品才接到下一行。
     */
    lines: [
      "大力士・牛肉丁凍乾",
      "頂真做・雞肉丁凍乾",
      "卵啵啵・柳葉魚凍乾",
      "走敢若飛・鴨翅",
      "草上飛・貓草雞肉乾",
      "薄片。",
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
    id: "stray-dogs",
    index: "04",
    tag: ["月餅有成交", "狗狗沒有價格"],
    lines: [
      "匠寵與巴克幫－浪犬",
      "之家合作，讓七隻狗",
      "狗在中秋被更多人看",
      "見。我們把牠們的故",
      "事放進月餅裡，每售",
      "出一顆月餅，由匠寵",
      "提撥十元支持浪犬之",
      "家。多一個人看到，",
      "就多一個回家的可",
      "能。",
    ],
    photos: [
      {
        image: strayDog,
        alt: "等家的米克斯小輝在草坡步道上張嘴笑著",
      },
      {
        image: charityMooncake,
        alt: "雞肉山藥地瓜月餅，上面插著 FURMOSA FOR DOGS 的小旗子與一隻小狗公仔",
      },
    ],
    media: "pair",
  },
];

export const CLOSING = {
  title: "不知道先點哪一道",
  slogan: RAIL_SLOGAN,
  body: "幾題小測驗，幫你挑選零食組合，找到牠的零食路線。看照片、挑規格，喜歡的勾一份，就進購物車。中秋尋家合作計畫已結單，七隻狗狗仍在等家。",
  cta: "看本期好物",
} as const;
