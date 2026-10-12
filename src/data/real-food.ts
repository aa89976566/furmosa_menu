import type { StaticImageData } from "next/image";

import bowl from "@/assets/poster/bowl.jpg";
import canning from "@/assets/poster/canning.jpg";
import dryingRacks from "@/assets/poster/drying-racks.jpg";
import goldenBite from "@/assets/poster/golden-bite.jpg";
import handTrim from "@/assets/poster/hand-trim.jpg";
import jackRussell from "@/assets/poster/jack-russell.jpg";
import lineWork from "@/assets/poster/line-work.jpg";

/**
 * 真食堂的文案逐字轉錄自品牌海報稿，請在上線前校對一次。
 * 海報為低解析輸出，少數字元判讀有風險。
 *
 * src/assets/poster/*.jpg 同樣是從海報稿裁切而來，解析度僅夠網格尺寸；
 * 拿到原始攝影檔後，只需以同名檔案覆蓋即可，版面不必改動。
 */

export const SHOP_URL = "https://furmosa.com/collections/all";

export const MASTHEAD = {
  ribbon: "毛孩的真食堂，來自台灣的好味道！",
  brand: "匠寵",
  category: "台灣鮮肉寵物零食",
} as const;

export const OPENING = {
  /** 直書大標：CJK 直立、拉丁字母側倒，由 writing-mode 自然處理。 */
  spine: "匠寵FURMOSA",
  claim: "台灣鮮肉手作，給毛孩最真的幸福！",
  lede:
    "一片雞肉從台灣的產地走到毛孩的碗裡，中間經過幾雙手、幾度溫度、幾次挑選——我們把這段路攤開給你看。",
  /** 像食品標籤一樣的規格欄，讓開場除了氣勢之外也交代得出事實。 */
  specs: [
    { label: "原料", value: "台灣在地新鮮雞肉，不添加多餘成分" },
    { label: "工法", value: "職人手工修整 · 低溫乾燥" },
    { label: "產地", value: "從挑選到包裝，全程台灣完成" },
  ],
} as const;

export const RAIL_SLOGAN = "毛孩的一口，是台灣的驕傲！";

export type ChapterPhoto = {
  image: StaticImageData;
  alt: string;
  /** 圖說沿用海報的細字腳註，只在桌機顯示。 */
  caption?: string;
};

export type Chapter = {
  id: string;
  /** 延續首頁的編號索引語彙。 */
  index: string;
  tag: string;
  lines: string[];
  photos: ChapterPhoto[];
  /** full 為滿版單圖，pair 為主圖加一張小圖。 */
  media: "full" | "pair";
};

export const CHAPTERS: Chapter[] = [
  {
    id: "ingredient",
    index: "01",
    tag: "台灣雞肉原食材",
    lines: [
      "選用台灣在地新鮮雞肉，",
      "以最單純的食材，",
      "製作毛孩安心享用的天然零食。",
      "不添加多餘成分，",
      "保留食材最真實的營養與美味。",
    ],
    photos: [
      {
        image: dryingRacks,
        alt: "不鏽鋼乾燥架上一層層舖平的雞肉片",
        caption: "低溫乾燥架，一層一層把水分帶走",
      },
    ],
    media: "full",
  },
  {
    id: "craft",
    index: "02",
    tag: "職人手作堅持",
    lines: [
      "每一片雞肉都由匠寵團隊",
      "用手工細心修整、低溫乾燥，",
      "保留肉質的原始風味與營養。",
      "我們相信，毛孩值得吃到",
      "像家人一樣的真實食物。",
    ],
    photos: [
      {
        image: handTrim,
        alt: "戴手套的雙手以剪刀修整生雞肉片",
        caption: "一片一片修整，沒有機器可以代班",
      },
    ],
    media: "full",
  },
  {
    id: "joy",
    index: "03",
    tag: "一口真肉的快樂",
    lines: [
      "看見毛孩開心的眼神，",
      "就是我們堅持的理由。",
      "天然雞肉的香氣，",
      "讓每一口都充滿幸福，",
      "陪伴牠們度過健康、更快樂的日子。",
    ],
    photos: [
      {
        image: goldenBite,
        alt: "黃金獵犬張嘴接住遞過來的雞肉乾",
        caption: "決定性的瞬間，不需要任何形容詞",
      },
      {
        image: bowl,
        alt: "印著匠寵字樣的藍色碗裝滿雞肉乾",
      },
    ],
    media: "pair",
  },
  {
    id: "made-in-taiwan",
    index: "04",
    tag: "台灣製造安心之選",
    lines: [
      "從原料挑選、處理、烘乾到包裝，",
      "全程於台灣在地完成。",
      "匠寵堅持透明製程與嚴格品質把關，",
      "來自台灣的安心，",
      "獻給全世界的毛孩。",
    ],
    photos: [
      {
        image: lineWork,
        alt: "身著無塵衣的人員在產線上整理烘乾後的雞肉片",
        caption: "全程在台灣完成，包含每一次翻面",
      },
    ],
    media: "full",
  },
  {
    id: "companion",
    index: "05",
    tag: "用真食材，陪伴更久更好的生活",
    lines: [
      "我們相信，",
      "好的食物能陪伴毛孩的健康與活力。",
      "匠寵以天然雞肉為核心，",
      "製作真正看得見的鮮肉零食，",
      "陪伴毛孩走過每一個重要的日子。",
      "這不只是零食，",
      "更是一份來自台灣的溫柔承諾。",
    ],
    photos: [
      {
        image: canning,
        alt: "戴手套的手將雞肉乾放入印有匠寵字樣的不鏽鋼罐",
        caption: "裝罐，是這段路的最後一道手工",
      },
      {
        image: jackRussell,
        alt: "傑克羅素犬抬頭等著手上的雞肉乾",
      },
    ],
    media: "pair",
  },
];

export const CLOSING = {
  slogan: RAIL_SLOGAN,
  body: "翻過標籤，你會看見一樣的答案：台灣雞肉、手工修整、低溫乾燥。沒有風味、沒有佐料、沒有不必要的成分。",
  cta: "看全部商品",
} as const;
