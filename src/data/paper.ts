import type { StaticImageData } from "next/image";

import bowl from "@/assets/poster/bowl.jpg";
import canning from "@/assets/poster/canning.jpg";
import charityReceipt from "@/assets/poster/charity-receipt.png";
import dryingRacks from "@/assets/poster/drying-racks.jpg";
import goldenBite from "@/assets/poster/golden-bite.jpg";
import handTrim from "@/assets/poster/hand-trim.jpg";
import jackRussell from "@/assets/poster/jack-russell.jpg";
import lineWork from "@/assets/poster/line-work.jpg";
import mooncakePacks from "@/assets/poster/mooncake-packs.jpg";

import { DOGMA_RULES, SERVICE_LINES, SWAP_REGIONS } from "./about";
import { CHARITY_URL } from "./real-food";
import { PARTNER_URL, SHOP_URL, WORKS_ROWS } from "./works";

/**
 * 匠寵市場報 — 以台式傳統市場 DM 的版面語彙重編整個網站。
 *
 * 市場 DM 的大字欄位天生是價格。匠寵沒有在這裡標價，
 * 所以那個欄位一律放 about.ts / works.ts 既有的真實數字（家數、人數、編號），
 * 絕不為了版面好看而生出一個價錢。
 *
 * 所有文案與數字都從既有資料匯入或轉錄，這支檔案只負責編排，不自己發明事實。
 */

export { SHOP_URL };

export type PaperPhoto = {
  image: StaticImageData;
  alt: string;
  /** 壓在照片角落的黑色小標籤，對應 DM 上的產地／來源註記。 */
  tag?: string;
};

/** 大字欄位：市場 DM 的價格位置，這裡放的是實際紀錄。 */
export type PaperFigure = {
  value: string;
  unit: string;
  label: string;
};

export const MASTHEAD = {
  brand: "匠寵",
  latin: "FURMOSA",
  latinSub: "Taiwan Fresh Meat",
  /** 直書報頭拆成小字前綴與大字主標，模仿「第六市場的／耐人尋味」。 */
  kicker: "匠寵的",
  headline: "真食有據",
  issue: "第 01 號",
  edition: "台灣鮮肉寵物零食",
  dateline: "常年發行 ‧ 索取免費",
  note: "本報所列數字皆為實際紀錄，沒有一個是為了版面湊出來的。",
} as const;

/** 頭版：單一成分凍乾的製程故事。 */
export const LEAD = {
  label: "單一成分",
  points: ["不添加多餘成分", "職人手工修整", "全程低溫乾燥"],
  /** 直式商品照擺頭版左上角，對應參考稿那支去背香腸。 */
  cutout: {
    image: bowl,
    alt: "印著匠寵字樣的藍色碗裝滿雞肉乾",
  } satisfies PaperPhoto,
  photos: [
    {
      image: handTrim,
      alt: "戴手套的雙手以剪刀修整生雞肉片",
      tag: "職人手作 ‧ 一片一片修整",
    },
    {
      image: lineWork,
      alt: "身著無塵衣的人員在產線上整理烘乾後的雞肉片",
      tag: "全程台灣製造",
    },
  ] satisfies PaperPhoto[],
  /**
   * 直書欄寬等於行數，所以行數要控制在七行以內，
   * 每行也不超過二十字，矮視窗才不會把欄位折成第二段。
   */
  story: [
    "一片雞肉從台灣的產地走到毛孩的碗裡，",
    "中間經過幾雙手、幾度溫度、幾次挑選。",
    "選用台灣在地新鮮雞肉，以最單純的食材，",
    "製作毛孩安心享用的天然零食。",
    "每一片都由匠寵團隊手工修整、低溫乾燥，",
    "保留肉質的原始風味與營養。",
    "封面是廣告，背面才是真相。",
  ],
  figure: {
    value: "1",
    unit: "種肉",
    label: "一種肉。零廢話。零「風味」。",
  } satisfies PaperFigure,
} as const;

/** 二版：換罐計畫。標題裡的三區與 47 家都來自 SWAP_REGIONS。 */
const SWAP_TOTAL = SWAP_REGIONS.reduce((sum, region) => sum + region.count, 0);

/** 直書標題行。num 會以縦中横排成一個字身，不會躺平。 */
export type HeadlineLine = { text: string; num?: string };

export const SECOND = {
  kicker: "罐事在北中南",
  headline: [
    { text: "空罐回收走三區" },
    { text: "合作店家", num: String(SWAP_TOTAL) },
  ] satisfies HeadlineLine[],
  photos: [
    {
      image: canning,
      alt: "戴手套的手將雞肉乾放入印有匠寵字樣的不鏽鋼罐",
      tag: "換罐現場 ‧ 空罐不進垃圾場",
    },
    {
      image: dryingRacks,
      alt: "不鏽鋼乾燥架上一層層舖平的雞肉片",
    },
  ] satisfies PaperPhoto[],
  /** 爆炸章放換罐參與人數，數字出處是 ABOUT_CARDS 的 returned。 */
  burst: {
    value: "333",
    unit: "人",
    label: "已經換過罐",
  } satisfies PaperFigure,
  /** 信條直接當二版的直書社論，六條一條都不改。 */
  rules: DOGMA_RULES,
  regions: SWAP_REGIONS.map((region) => ({
    label: region.label,
    count: region.count,
    spots: region.spots.join("、"),
  })),
  total: SWAP_TOTAL,
} as const;

/**
 * 三版：中秋月餅公益。
 *
 * 這是全報唯一出現金額的版位——因為它是一張開立出來的捐款收據，
 * 不是價格。收據欄位逐字轉錄，民國紀年照抄，不換算成西元。
 */
export const CHARITY = {
  kicker: "中秋月餅公益",
  headline: [
    { text: "牠的月餅" },
    { text: "送進正在等家的故事" },
  ] satisfies HeadlineLine[],
  /** 爆炸章是圓的，交給自動斷行會把「收據」拆開，所以斷點自己指定。 */
  burst: ["公益收據", "已公開"],
  photos: [
    {
      image: mooncakePacks,
      alt: "兩款中秋月餅包裝：左邊印著「牠的月餅」與一隻黑白狗，右邊印著「牠的故事」與七塊畫上狗臉的月餅",
      tag: "七個包裝 ‧ 七個故事",
    },
  ] satisfies PaperPhoto[],
  receiptPhoto: {
    image: charityReceipt,
    alt: "社團法人臺灣巴克動物懷善救援協會開立的捐款收據，金額 NT$11,480",
    tag: "捐款收據 ‧ 收執聯",
  } satisfies PaperPhoto,
  /** 直書社論：欄數等於行數，所以維持在五行以內。 */
  story: [
    "每打開一款，會遇見一個不同的牠。",
    "七個包裝，七個正在等家的故事。",
    "這不只是月餅，更是一份陪伴與希望，",
    "讓愛持續走下去。",
  ],
  /** 收據上的欄位，照原件轉錄，順序也照原件。 */
  receipt: [
    { label: "受贈", value: "社團法人臺灣巴克動物懷善救援協會" },
    { label: "編號", value: "2026BK70323" },
    { label: "日期", value: "中華民國 115 年 10 月 6 日" },
    { label: "用途", value: "不指定" },
  ],
  donation: {
    value: "11,480",
    unit: "元",
    label: "已捐贈",
  } satisfies PaperFigure,
  payee: "台灣巴克動物懷善救援協會",
  note: "金額與收據編號逐字轉錄自受贈單位開立的收執聯；核准設立字號與統一編號載於收據上。",
  link: { label: "看七隻狗狗的故事", href: CHARITY_URL },
} as const;

/** 綠底上架格：網站的編號清單，一格一筆。 */
export type Listing = {
  index: string;
  name: string;
  note: string;
  href: string;
  /** 最新上架的那一筆掛紅色爆炸章。 */
  burst?: string;
  wide?: boolean;
};

export const LISTINGS: Listing[] = WORKS_ROWS.flatMap((row) => {
  if (row.kind !== "link") return [];
  const note = row.hoverText?.replace(/↗$/, "").trim();
  return [
    {
      index: String(row.index).padStart(2, "0"),
      name: row.label,
      note: note && note.length > 0 ? note : "長期上架",
      href: row.href,
      burst: row.latest ? "最新上架" : undefined,
      wide: row.highlight,
    },
  ];
});

export const LISTINGS_HEADING = {
  kicker: "上架清單",
  title: "每一行編號，都是上架證明",
  note: "編號只增不刪。下架的也留在清單上。",
} as const;

/** 底版服務格：四條服務線，大字放既有的服務編號。 */
export const SERVICES = SERVICE_LINES.map((line, index) => ({
  code: line.code,
  name: line.name,
  tagline: line.tagline,
  figure: {
    value: String(index + 1).padStart(2, "0"),
    unit: "號",
    label: "服務線",
  } satisfies PaperFigure,
}));

export const SERVICES_HEADING = {
  kicker: "服務一覽",
  title: "凍乾。沒別的。",
} as const;

export const CLOSING_PHOTOS: PaperPhoto[] = [
  {
    image: goldenBite,
    alt: "黃金獵犬張嘴接住遞過來的雞肉乾",
    tag: "決定性的瞬間",
  },
  {
    image: jackRussell,
    alt: "傑克羅素犬抬頭等著手上的雞肉乾",
  },
];

export const COLOPHON = {
  slogan: "把選擇還給牠。不是還給廣告。",
  publisher: "發行：匠寵 FURMOSA",
  links: [
    { label: "凍乾目錄", href: "/", external: false },
    { label: "毛孩的真食堂", href: "/real-food", external: false },
    { label: "浪浪尋家", href: CHARITY_URL, external: true },
    { label: "店家合作", href: PARTNER_URL, external: true },
    { label: "全部商品", href: SHOP_URL, external: true },
  ],
} as const;
