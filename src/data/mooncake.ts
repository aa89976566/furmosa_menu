import charityMooncake from "@/assets/poster/charity-mooncake-wide.jpg";
import charityReceipt from "@/assets/poster/charity-receipt-wide.png";
import dogDada from "@/assets/poster/dog-dada.jpg";
import dogHeitang from "@/assets/poster/dog-heitang.jpg";
import dogSasa from "@/assets/poster/dog-sasa.jpg";
import packsPair from "@/assets/poster/mooncake-packs-pair.jpg";
import dogSiaohuei from "@/assets/poster/stray-dog-siaohuei.jpg";

import type { Chapter } from "./real-food";
import { CHARITY_URL } from "./real-food";

/**
 * 中秋月餅公益海報。版式與 CSS 完全沿用 /real-food，只換內容，
 * 所以每一欄的字數上限也照抄那邊的註記：
 * 第一、二帶每段五行、每行最多十四字；第三帶之後每行最多十六字。
 *
 * 文案與照片取自活動頁 them-stock-moon.furmosa.com 與受贈單位開立的捐款收據。
 * 活動頁上標示為「示意資料」的即時數字一律不引用；印出來的金額只有收據上那一筆。
 *
 * 第三帶的照片格不裁切，照片保留原比例，所以是它決定那一條帶的高度：
 * 寬高比低於 1.685 的話，格子會比帶高，壓掉帶與帶之間那條藍線。
 */

export { CHARITY_URL };

export const PACK_URL = "https://packtw.org/";

export const MASTHEAD = {
  ribbon: "牠的月餅，送進正在等家的故事！",
  brand: "匠寵",
  category: "中秋尋家合作計畫",
} as const;

export const OPENING = {
  spine: "匠寵FURMOSA",
  /** 書脊旁的黃色標語。「」由 CSS 補上，這裡不寫。 */
  claim: "中秋月餅公益",
  lede:
    "我們想做的，不只是賣出月餅，而是讓七隻狗狗，在今年中秋多一個找到家的機會。",
  /** 直書排不了阿拉伯數字，所以確切的金額、編號與日期都收在這張規格表裡。 */
  specs: [
    {
      label: "活動",
      value:
        "中秋尋家合作計畫 — 匠寵 FURMOSA × 巴克幫－浪犬之家（月餅已結單）",
    },
    {
      label: "月餅",
      value:
        "雞肉山藥地瓜月餅 — 七個包裝對應七隻狗狗，每售出一顆由匠寵提撥 NT$10",
    },
    {
      label: "捐贈",
      value: "NT$11,480 — 受贈單位：社團法人臺灣巴克動物懷善救援協會",
    },
    {
      label: "收據",
      value:
        "編號 2026BK70323 — 中華民國 115 年 10 月 6 日，款名用途：不指定",
    },
    {
      label: "狗狗",
      value: "小輝、善美、黑糖、達達、雪莉、莎莎、佩佩 — 七隻都還在等家",
    },
  ],
} as const;

export const RAIL_SLOGAN = "毛孩的一口，是台灣的驕傲！";

export const CHAPTERS: Chapter[] = [
  {
    id: "seven-packs",
    index: "01",
    tag: ["七個包裝七個故事"],
    lines: [
      "每打開一款，",
      "會遇見一個不同的牠。",
      "七個包裝，",
      "七個正在等家的故事。",
      "不只是一盒月餅。",
    ],
    photos: [
      {
        image: packsPair,
        alt: "「牠的月餅」與「牠的故事」兩款中秋月餅包裝並排，袋面印著狗狗插畫",
      },
    ],
    media: "full",
  },
  {
    id: "mooncake",
    index: "02",
    tag: ["月餅是給毛孩的"],
    lines: [
      "雞肉山藥地瓜月餅，",
      "給毛孩的中秋。",
      "每售出一顆月餅，",
      "由匠寵提撥十元，",
      "支持浪犬之家。",
    ],
    photos: [
      {
        image: charityMooncake,
        alt: "雞肉山藥地瓜月餅，上面插著 FURMOSA FOR DOGS 的小旗子與一隻小狗公仔",
      },
    ],
    media: "full",
  },
  {
    id: "seven-dogs",
    index: "03",
    tag: ["先來認識七隻狗狗"],
    lines: [
      "小輝、善美、黑糖、",
      "達達、雪莉、莎莎、佩佩。",
      "每一隻都有自己的個性，",
      "也有適合牠的生活。",
      "七隻都還在等一個家。",
    ],
    photos: [
      {
        image: dogSasa,
        alt: "莎莎的正面大頭照，黑色米克斯犬舔著鼻子",
      },
      {
        image: dogDada,
        alt: "達達坐在庭院裡，黑色拉布拉多混米克斯犬伸著舌頭",
      },
    ],
    media: "pair",
  },
  {
    id: "receipt",
    index: "04",
    tag: ["公益收據已公開"],
    lines: [
      "這筆帳是攤開的。",
      "捐款收據已經公開，",
      "受贈單位是",
      "台灣巴克動物懷善救援協會。",
      "編號與日期都印在上面。",
    ],
    photos: [
      {
        image: charityReceipt,
        alt: "社團法人臺灣巴克動物懷善救援協會開立的捐款收據，金額 NT$11,480",
      },
    ],
    media: "full",
  },
  {
    id: "donation",
    index: "05",
    tag: ["月餅有成交", "狗狗沒有價格"],
    lines: [
      "月餅結束了，",
      "找家的事還沒結束。",
      "匠寵已捐出一萬一千四百八十元，",
      "給台灣巴克動物懷善救援協會。",
      "你現在可能沒辦法養牠，",
      "但幫忙分享，",
      "也許就能讓適合牠的人看到。",
    ],
    photos: [
      {
        image: dogSiaohuei,
        alt: "等家的米克斯小輝在草坡步道上張嘴笑著",
      },
      {
        image: dogHeitang,
        alt: "黑糖從推車裡抬頭看鏡頭，咖啡色捲毛貴賓犬",
      },
    ],
    media: "pair",
  },
];

export const CLOSING = {
  title: "月餅結束了，找家的事還沒",
  slogan: RAIL_SLOGAN,
  body: "月餅與公益支持由匠寵負責，狗狗的照護與認養由巴克幫－浪犬之家負責。七隻狗狗的資料與照片來源：巴克幫－浪犬之家。活動頁上標示為示意的即時數字這裡一律不引用，印出來的金額以收據為準。",
  cta: "看七隻狗狗的故事",
} as const;
