import type { StaticImageData } from "next/image";

import beefCubes from "@/assets/poster/beef-cubes-loading.jpg";
import charityMooncake from "@/assets/poster/charity-mooncake.jpg";
/* 頭條是去背的，透明處會透出紙色，所以存成帶 alpha 的 webp。 */
import dogCutletCutout from "@/assets/poster/dog-cutlet-cutout.webp";
/* 製程三連拍是情境示意圖，官網沒有製程照（紙背有註記）。 */
import processDry from "@/assets/poster/process-03-dry.jpg";
import processPaste from "@/assets/poster/process-02-paste.jpg";
import processWash from "@/assets/poster/process-01-wash.jpg";
/* 直幅版的小輝；橫幅的那一張還留著給 /mooncake 用。 */
import strayDog from "@/assets/poster/stray-dog-siaohuei-tall.jpg";
/* 版底七欄的欄名與連結就是首頁那份編號清單，維持單一真實來源。 */
import { WORKS_ROWS } from "@/data/works";

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
    {
      label: "製程",
      value:
        "雞肉製泥後鋪平塑形，以接近 70–75°C 的低溫熱風緩慢帶走水分，耗時是一般做法的 3 倍",
    },
    { label: "吃法", value: "可剪成小段，依體型調整份量；零食搭配主食與充足飲水" },
    {
      label: "公益",
      value:
        "中秋尋家合作計畫 — 匠寵 × 巴克幫－浪犬之家，每售出一顆月餅提撥 NT$10（活動已結單）",
    },
    /** 官網沒有製程照，所以照官網自己的做法標註示意。 */
    {
      label: "圖片",
      value:
        "製程三連拍為情境示意圖，僅用於呈現製作概念；實際製程與產品請以實品為準",
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
  /** full 為滿版單圖，pair 為主圖加一張小圖，trio 為三連拍的製程圖。 */
  media: "full" | "pair" | "trio";
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
    id: "how-its-made",
    index: "02",
    /**
     * 製程的說法照常見問題頁：「脆」是低溫熱風慢慢帶走水分，
     * 接近七十五度、耗時是別人的三倍；塑形的說法照雞排商品頁。
     * 直書排不了阿拉伯數字，所以溫度與倍數都寫成中文數字。
     */
    tag: ["慢工做的雞排", "低溫熱風烘乾"],
    lines: [
      "只用純雞肉，洗淨後製",
      "泥、鋪平塑形，再用低",
      "溫熱風慢慢帶走水分，",
      "耗時是別人的三倍。",
    ],
    /** 三連拍就是三道工：洗、製泥、烘乾。 */
    photos: [
      {
        image: processWash,
        alt: "情境示意圖：小廚房的不鏽鋼水槽裡，戴手套的手正沖洗整塊雞胸肉",
      },
      {
        image: processPaste,
        alt: "情境示意圖：絞肉機把雞肉絞成肉泥，落進不鏽鋼盆裡",
      },
      {
        image: processDry,
        alt: "情境示意圖：不鏽鋼烘乾架上一盤盤鋪平的大片雞排",
      },
    ],
    media: "trio",
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

/*
 * 版底的七欄：首頁那份編號清單的每一列，在報紙上就是一欄報導。
 *
 * 標題與連結直接取自 WORKS_ROWS，所以首頁改欄名、改網址，報紙跟著動；
 * 本文是那一欄自己的事實，散在首頁與各活動頁上的清單（毛孩分類、免運、
 * 月餅結案、碗的尺寸與顏色、合作條件）各自收進它該在的那一欄。
 *
 * 一欄的本文有上限：欄高 26cqw ÷ 本文字級 ＝ 一行十七字，欄寬放得下四行，
 * 所以上限是六十八字，寫滿四行欄裡才不留空白紙。直書排不了阿拉伯數字，
 * 數字一律寫成中文數字（確切數字留在紙背的規格欄，那裡是橫書）。
 */
const REPORT_BODIES: Record<number, string> = {
  1: "不只做零食，更像一間為毛孩挑選好物的選品店。架上分成狗狗、貓咪、兔兔與小動物，本期補上洗護系列八支，單筆滿一千一百九十九元免運。",
  2: "頭版那片雞排自己的活動頁。純雞肉做的大片雞排，淨重五十克，不添加香料、色素與防腐劑；低溫熱風慢慢烘乾，耗時是一般做法的三倍。",
  3: "與巴克幫－浪犬之家的中秋合作盤。每售出一顆月餅提撥十元支持浪犬之家；月餅已結單，售出八百四十八顆，預計捐出一萬一千四百八十元。",
  4: "貓的那一欄。活動頁自己喊「一臉不屑，一口淪陷」；架上對應的是草上飛・貓草雞肉乾薄片，給家裡那位嘴硬、聞到貓草就自己軟下來的貓。",
  5: "每一包裡都有一張卡，卡上是和自家毛孩同品種的那一位。拿卡跟牠拍一張、加官方帳號，就再領一包同樣的零食；照片牆上還有別人家的那一隻。",
  6: "匠寵選物第一件：印尼匠人用回收藤編做的狗碗，綠黑與黃色兩色，尺寸從十七到二十六公分共四款；首頁掛著最新上架的那一列，現正預購。",
  7: "給店家的那一欄：肉乾與凍乾共十八項，五十組起訂。合作分兩種——寄賣先放店裡三十天後結算，或由店家直接進貨；建議售價與官網同步。",
};

export const REPORTS = {
  title: "本期七欄",
  kicker: "首頁七列，一列一欄",
  /** 直書欄位放不下的拉丁字與價格，收在這條橫書的註記裡。 */
  note: "本期架上：Earthbath 洗護系列八支（473ml）・品項、價格與活動期間以 furmosa.com 為準",
  columns: WORKS_ROWS.flatMap((row) =>
    row.kind === "link" && REPORT_BODIES[row.index]
      ? [
          {
            index: row.index,
            label: row.label,
            href: row.href,
            body: REPORT_BODIES[row.index],
          },
        ]
      : [],
  ),
} as const;

export const CLOSING = {
  title: "不知道先點哪一道",
  slogan: RAIL_SLOGAN,
  body: "幾題小測驗，幫你挑選零食組合，找到牠的零食路線。看照片、挑規格，喜歡的勾一份，就進購物車。中秋尋家合作計畫已結單，七隻狗狗仍在等家。",
  cta: "看本期好物",
} as const;
