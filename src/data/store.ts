import type { StaticImageData } from "next/image";

/*
 * 這一頁只用專案裡既有的真實照片，沒有雕版、沒有線描、沒有生成的圖。
 *
 * 因此會出現「有事實、但沒有照片」的格子（兩項商品、七隻狗狗裡的三隻）。
 * 那些格子一律排成灰階的具名占位框——寫出該放什麼、標明照片待補，
 * 而不是找一張像的照片頂替，也不是畫一張插圖填滿版面。
 * 版面可以有缺口，資料不能有假的。
 */
import beefCubes from "@/assets/poster/beef-cubes-loading.jpg";
import charityReceipt from "@/assets/poster/charity-receipt-wide.png";
import cutletBag from "@/assets/poster/cutlet-bag.jpg";
import dogDada from "@/assets/poster/dog-dada.jpg";
import dogHeitang from "@/assets/poster/dog-heitang.jpg";
import dogSasa from "@/assets/poster/dog-sasa.jpg";
import dogSiaohuei from "@/assets/poster/stray-dog-siaohuei.jpg";
import mooncakePacks from "@/assets/poster/mooncake-packs-pair.jpg";
import heroJiba from "@/assets/store/photo-hero-jiba.webp";

import { SWAP_REGIONS } from "@/data/about";
import { SHOP_URL, WORKS_ROWS } from "@/data/works";

/* furmosa.com 上實際存在的頁面，全部回過 200；沒有的（運送、退換貨、條款）就不列。 */
const SHOP_ORIGIN = "https://furmosa.com";
export const CART_URL = `${SHOP_ORIGIN}/cart`;
export const LOGIN_URL = `${SHOP_ORIGIN}/account/login`;
export const SEARCH_URL = `${SHOP_ORIGIN}/search`;
export const ABOUT_URL = `${SHOP_ORIGIN}/pages/關於匠寵`;
export const FAQ_URL = `${SHOP_ORIGIN}/pages/常見問題`;
export const PRIVACY_URL = `${SHOP_ORIGIN}/policies/privacy-policy`;

/** 中秋尋家合作計畫（匠寵 × 巴克幫－浪犬之家）。活動已結單。 */
export const CHARITY_URL = "https://them-stock-moon.furmosa.com/";

/**
 * 訂閱框不是裝飾：直接 POST 到 Shopify 內建的電子報端點（form_type=customer），
 * 所以送出後是真的進到 furmosa.com 的名單，而不是點了沒反應。
 */
export const NEWSLETTER_ACTION = `${SHOP_ORIGIN}/contact#contact_form`;

export const SOCIALS = [
  { label: "Instagram", short: "IG", href: "https://www.instagram.com/furmosa_food/" },
  { label: "Facebook", short: "FB", href: "https://www.facebook.com/p.et.formosa" },
  { label: "LINE 官方帳號", short: "LINE", href: "https://line.me/R/ti/p/@furmosa" },
] as const;

export const UTILITY = {
  left: "台灣製造・毛孩選物",
  centre: "真食材・不調味・陪牠看更大的世界",
} as const;

const ROW_HREFS = new Map(
  WORKS_ROWS.flatMap((row) =>
    row.kind === "link" ? [[row.index, row.href] as const] : [],
  ),
);

function rowHref(index: number): string {
  const href = ROW_HREFS.get(index);
  if (!href) throw new Error(`首頁清單少了第 ${index} 列`);
  return href;
}

export type NavItem = { label: string; href: string; external?: boolean };

/* 導覽列是首頁那份編號清單，長欄名照「｜」拆開，網址仍指同一頁。 */
export const NAV: NavItem[] = [
  { label: "全部商品", href: rowHref(1), external: true },
  /* /haodada 是本站的改寫路徑（見 next.config.ts），不是外部網址。 */
  { label: "嚎大大雞霸", href: rowHref(2) },
  { label: "浪浪交易所", href: rowHref(3), external: true },
  { label: "chill嗨嗨ㄟ貓", href: rowHref(4), external: true },
  { label: "再來一包", href: rowHref(5), external: true },
  { label: "背景很硬的碗", href: rowHref(6), external: true },
  { label: "店家合作", href: rowHref(7), external: true },
];

/* ---------------- 報頭 ---------------- */

const CJK_DIGITS = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

/** 報頭的紀年。舊報紙寫民國年，數字也是中文的（二〇二六 → 一一五）。 */
export function minguo(year: number): string {
  return String(year - 1911)
    .split("")
    .map((digit) => CJK_DIGITS[Number(digit)])
    .join("");
}

export const NAMEPLATE = {
  brand: "匠寵",
  wordmark: "FURMOSA",
  line: "REAL FOOD FOR A WILDER LIFE",
  origin: "台灣製造・毛孩選物",
  issuer: "匠寵發行",
  seal: "匠寵",
} as const;

/* ---------------- 頭版 ---------------- */

/**
 * 頭版只有三塊：主標、左欄短文與買的按鈕、一張最大面積的實拍。
 *
 * 主標橫書。右側原本那條直書欄拿掉了——直書欄寬要跟字數配，
 * 一佔就是一整欄的寬，而這一頁要把寬度讓給照片。
 */
export const HERO = {
  kicker: "頭版",
  /** 兩行橫書。斷點自己指定，不交給自動折行。 */
  headline: ["雞霸不是零食", "是台灣狗的雞排"],
  lead: "真食材 不調味 陪牠看更大的世界",
  /** 欄底三行規格，全部是 /real-food 上寫過的製程事實。 */
  claims: ["低溫熱風烘乾", "不添香料色素", "台灣在地新鮮雞肉"],
  cta: { label: "立即買雞霸", href: `${SHOP_ORIGIN}/products/chicken-fillet` },
  art: heroJiba,
  alt: "實拍：一隻臘腸狗張嘴咬住從匠寵紙袋裡探出來的大片雞肉乾，一隻手拿著紙袋，袋上印著匠寵的紅色印章與商品勾選欄",
  caption: "嚎大大・雞霸｜台灣在地・小量製作",
} as const;

/* ---------------- 細新聞條 ---------------- */

const SWAP_TOTAL = SWAP_REGIONS.reduce((sum, region) => sum + region.count, 0);

/**
 * 頭條下面那一條。只有一行高，字級是全頁最小的一級，
 * 作用是把頭版的大與下面的三欄接起來，不是又一個版。
 * 四則都是站上既有的數字，沒有一個是為了湊版面寫的。
 */
export const TICKER = {
  label: "快訊",
  items: [
    { text: `換罐計畫合作店家 ${SWAP_TOTAL} 家`, href: ABOUT_URL, external: true },
    { text: "已有 333 人換過罐", href: ABOUT_URL, external: true },
    { text: "中秋場次已結單・七隻狗狗仍在等家", href: CHARITY_URL, external: true },
    { text: "背景很硬的碗・預購中", href: rowHref(6), external: true },
  ],
} as const;

/* ---------------- 三個不等寬新聞欄 ---------------- */

/**
 * 三欄，寬度與字級都不一樣——這是整頁的編輯節奏所在。
 *
 *   主欄（最寬）：有眉題、有大標、有內文、有數字。
 *   次欄（中）：有標題、有內文，沒有數字。
 *   短欄（最窄）：只有一串標題與一行說明，當索引用。
 *
 * 三欄同寬同字級的話，讀者就沒有進入順序，整頁會變回格子。
 */
export type NewsFigure = { value: string; unit: string; note: string };

export type NewsLead = {
  kicker: string;
  title: string;
  body: readonly string[];
  figure: NewsFigure;
  regions: readonly { label: string; count: number; spots: string }[];
  cta: string;
  href: string;
};

export const NEWS_LEAD: NewsLead = {
  kicker: "換罐計畫",
  title: "洗澡時帶一罐回家，吃完把空罐帶回來",
  body: [
    "零食裝在可重複使用的玻璃瓶裡。空罐不進垃圾場，",
    "洗乾淨再裝下一輪，所以同一個罐子會來回很多次。",
  ],
  figure: { value: String(SWAP_TOTAL), unit: "家", note: "合作店家" },
  regions: SWAP_REGIONS.map((region) => ({
    label: region.label,
    count: region.count,
    spots: region.spots.join("、"),
  })),
  cta: "了解換罐計畫",
  href: ABOUT_URL,
};

export type NewsSecond = {
  kicker: string;
  title: string;
  body: readonly string[];
  cta: string;
  href: string;
  external?: boolean;
};

export const NEWS_SECOND: NewsSecond = {
  kicker: "製程",
  title: "一片雞肉從產地到碗裡，經過幾雙手",
  body: [
    "選用台灣在地新鮮雞肉，由匠寵團隊手工修整、低溫乾燥，",
    "保留肉質的原始風味與營養。一種肉，沒有「風味」。",
  ],
  cta: "看製程",
  href: "/real-food",
};

export type NewsBrief = { name: string; note: string; href: string; external?: boolean };

export const NEWS_BRIEFS = {
  kicker: "其他欄目",
  items: [
    { name: "chill嗨嗨ㄟ貓", note: "貓咪的放鬆時光", href: rowHref(4), external: true },
    { name: "再來一包", note: "毛孩人格抽驗", href: rowHref(5), external: true },
    { name: "背景很硬的碗", note: "預購中", href: rowHref(6), external: true },
    { name: "店家合作", note: "一起讓更多毛孩吃到好東西", href: rowHref(7), external: true },
  ] satisfies NewsBrief[],
} as const;

/* ---------------- 商品 ---------------- */

/**
 * 名稱、規格、價格、網址都取自 furmosa.com 的商品頁。
 *
 * art 只在專案裡確實有該商品的實拍時才給；沒有的留 undefined，
 * 由版面排成灰階占位框。拿一張別的商品照頂替，等於在資料裡說謊。
 */
export type Product = {
  name: string;
  spec: string;
  price: string;
  href: string;
  art?: StaticImageData;
  alt?: string;
  /** 沒有實拍時，占位框上寫的是「該放哪一張」。 */
  pending?: string;
};

export const PRODUCTS: Product[] = [
  {
    name: "嚎大大・雞霸",
    spec: "雞肉原味",
    price: "NT$165",
    href: `${SHOP_ORIGIN}/products/chicken-fillet`,
    art: cutletBag,
    alt: "實拍：一片大雞肉乾插在印著匠寵圖章與 Thank you very much 的紙袋裡",
  },
  {
    name: "簡記・牛肉地瓜",
    spec: "30 克",
    price: "NT$180",
    href: `${SHOP_ORIGIN}/products/jian-ji-niu-rou-di-gua-su`,
    art: beefCubes,
    alt: "實拍：牛肉丁凍乾排成一條 LOADING 進度條",
  },
  {
    name: "青菜底加・混蔬菜凍乾",
    spec: "30 克",
    price: "NT$180",
    href: `${SHOP_ORIGIN}/products/青菜底加-混蔬菜凍乾`,
    pending: "混蔬菜凍乾商品照",
  },
  {
    name: "唐老・鴨喉",
    spec: "30 克",
    price: "NT$110",
    href: `${SHOP_ORIGIN}/products/tang-lao-ya-hou-zku85`,
    pending: "鴨喉商品照",
  },
];

export const GOODS = {
  bar: { label: "本日狗食分類廣告", note: "價格以商品頁為準" },
  items: PRODUCTS,
  /** 商品頁才有加入購物車的按鈕，所以模組上的動作寫「選購」而不是「加入購物車」。 */
  action: "選購",
  cta: "查看全部商品",
  href: SHOP_URL,
  cartLabel: "購物車",
  cartHref: CART_URL,
} as const;

/* ---------------- 公益 ---------------- */

export type StrayDog = {
  name: string;
  art?: StaticImageData;
  alt?: string;
};

/**
 * 七隻狗狗的名字來自 /mooncake 的規格欄，照抄不改。
 * 四隻有照片（alt 也照抄原處），三隻沒有——那三格排成灰階具名占位框。
 */
export const STRAY_DOGS: StrayDog[] = [
  { name: "小輝", art: dogSiaohuei, alt: "等家的米克斯小輝在草坡步道上張嘴笑著" },
  { name: "善美" },
  { name: "黑糖", art: dogHeitang, alt: "黑糖從推車裡抬頭看鏡頭，咖啡色捲毛貴賓犬" },
  { name: "達達", art: dogDada, alt: "達達坐在庭院裡，黑色拉布拉多混米克斯犬伸著舌頭" },
  { name: "雪莉" },
  { name: "莎莎", art: dogSasa, alt: "莎莎的正面大頭照，黑色米克斯犬舔著鼻子" },
  { name: "佩佩" },
];

/**
 * 公益版。金額、收據編號與日期逐字轉錄自受贈單位開立的收執聯，
 * 民國紀年照抄不換算。這是全頁唯一出現捐款金額的地方。
 */
export const CARE = {
  bar: { label: "浪浪支持計畫", note: "匠寵 × 巴克幫－浪犬之家" },
  title: "月餅結束了，找家的事還沒",
  body: [
    "匠寵與巴克幫－浪犬之家合作，把七隻等家狗狗的故事放進月餅裡。",
    "每售出一顆月餅，由匠寵提撥十元支持浪犬之家。",
    "中秋場次已結單，七隻狗狗仍在等家。",
  ],
  photo: {
    art: mooncakePacks,
    alt: "實拍：兩款中秋月餅包裝，左邊印著「牠的月餅」與一隻黑白狗，右邊印著「牠的故事」與七塊畫上狗臉的月餅",
    caption: "七個包裝・七個等家的故事",
  },
  receipt: {
    art: charityReceipt,
    alt: "社團法人臺灣巴克動物懷善救援協會開立的捐款收據，金額 NT$11,480",
    caption: "捐款收據・收執聯",
    figure: { value: "11,480", unit: "元", note: "已捐贈" },
    fields: [
      { label: "受贈", value: "社團法人臺灣巴克動物懷善救援協會" },
      { label: "編號", value: "2026BK70323" },
      { label: "日期", value: "中華民國 115 年 10 月 6 日" },
      { label: "用途", value: "不指定" },
    ],
    note: "金額與編號逐字轉錄自受贈單位開立的收執聯。",
  },
  dogs: { label: "七隻都還在等家", items: STRAY_DOGS },
  cta: "看七隻狗狗的故事",
  href: CHARITY_URL,
} as const;

/** 沒有照片的格子上統一寫這一行，不另外編字。 */
export const PENDING_NOTE = "照片待補";

/* ---------------- 報尾 ---------------- */

export const SUBSCRIBE = {
  label: "讀者服務",
  title: "最新消息，訂閱。",
  placeholder: "輸入 Email",
  submit: "訂閱",
} as const;

export const FOOTER_NAV: NavItem[] = [
  { label: "關於匠寵", href: ABOUT_URL, external: true },
  { label: "常見問題", href: FAQ_URL, external: true },
  { label: "隱私權政策", href: PRIVACY_URL, external: true },
  { label: "真食堂", href: "/real-food" },
  { label: "凍乾目錄", href: "/" },
];

export const FOOTER = {
  wordmark: "FURMOSA",
  brand: "匠寵",
  line: "REAL FOOD FOR A WILDER LIFE",
  holder: "FURMOSA 匠寵",
  origin: "TAIWAN",
  slogan: "讓好食物，陪牠看更大的世界",
} as const;
