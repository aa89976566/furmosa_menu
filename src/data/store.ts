import type { StaticImageData } from "next/image";

/*
 * 門市版首頁的插圖是單色雕版（一支紅墨、一支藍墨），存成帶 alpha 的 webp：
 * 墨色是圖檔自己的顏色，空白處透明，所以紙色與紙紋從底下透上來，
 * 每一張圖都像直接印在同一張紙上，而不是貼一塊方形圖片。
 *
 * 全頁的圖都是情境示意圖，所以 alt 一律標出來。goods-* 是照 furmosa.com 的
 * 商品照一張一張描成雕版的，畫的是該商品本身；商品的名稱、規格與價格另外取自
 * 店裡的商品頁，不從圖上讀。
 */
import goodsBeef from "@/assets/store/goods-2-beef.webp";
import goodsDuck from "@/assets/store/goods-4-duck.webp";
import goodsJiba from "@/assets/store/goods-1-jiba.webp";
import goodsVeg from "@/assets/store/goods-3-veg.webp";
import photoHeroJiba from "@/assets/store/photo-hero-jiba.webp";
import sceneRidge from "@/assets/store/scene-ridge.webp";

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

/*
 * 導覽列就是首頁那份編號清單，加上同站的真食堂一頁，共九項——
 * 和稿子上的九項對齊。長欄名（「浪浪交易所｜中秋限定盤」、
 * 「再來一包｜毛孩人格抽驗」）照「｜」拆成兩項，網址仍指同一頁，
 * 所以點哪一項都到得了，欄名也還是首頁寫的那個。
 */
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

export const NAV: NavItem[] = [
  { label: "全部商品", href: rowHref(1), external: true },
  /* /haodada 是本站的改寫路徑（見 next.config.ts），不是外部網址。 */
  { label: "嚎大大雞霸", href: rowHref(2) },
  { label: "浪浪交易所", href: rowHref(3), external: true },
  { label: "中秋限定盤", href: rowHref(3), external: true },
  { label: "chill嗨嗨ㄟ貓", href: rowHref(4), external: true },
  { label: "再來一包", href: rowHref(5), external: true },
  { label: "毛孩人格抽驗", href: rowHref(5), external: true },
  { label: "背景很硬的碗", href: rowHref(6), external: true },
  { label: "店家合作", href: rowHref(7), external: true },
];

export type Product = {
  name: string;
  spec: string;
  price: string;
  href: string;
  art: StaticImageData;
  alt: string;
};

/*
 * 四項商品的名稱、規格與價格都取自 furmosa.com 的商品資料，不是稿子上的示意數字
 * （稿子寫的 NT$99 / NT$156 / NT$96 在店裡查不到）。改價請回店裡對一次。
 */
export const PRODUCTS: Product[] = [
  {
    name: "嚎大大・雞霸",
    spec: "雞肉原味",
    price: "NT$165",
    href: `${SHOP_ORIGIN}/products/chicken-fillet`,
    art: goodsJiba,
    alt: "情境示意圖：紅色雕版風格的插畫，一片大片雞肉乾裝在透明立袋裡，袋前散著幾條肉乾",
  },
  {
    name: "簡記・牛肉地瓜",
    spec: "30 克",
    price: "NT$180",
    href: `${SHOP_ORIGIN}/products/jian-ji-niu-rou-di-gua-su`,
    art: goodsBeef,
    alt: "情境示意圖：紅色雕版風格的插畫，一堆牛肉地瓜凍乾塊堆在桌上",
  },
  {
    name: "青菜底加・混蔬菜凍乾",
    spec: "30 克",
    price: "NT$180",
    href: `${SHOP_ORIGIN}/products/青菜底加-混蔬菜凍乾`,
    art: goodsVeg,
    alt: "情境示意圖：紅色雕版風格的插畫，一地混蔬菜凍乾方塊，後面是一只傾倒的小碗",
  },
  {
    name: "唐老・鴨喉",
    spec: "30 克",
    price: "NT$110",
    href: `${SHOP_ORIGIN}/products/tang-lao-ya-hou-zku85`,
    art: goodsDuck,
    alt: "情境示意圖：紅色雕版風格的插畫，幾根長條的鴨喉零食插在玻璃杯裡",
  },
];

/* ---------------- 報紙的版型 ---------------- */

/*
 * 這一頁的版面走台灣舊報紙的規矩，不是超市傳單：
 *
 *   一、報頭橫跨全寬，底下一道粗線封住，刊名、產地、紀年各佔一格。
 *   二、所有東西貼欄線。線只有兩級——粗線分版，細髮線分欄與條目。
 *   三、一主一輔一點：藍墨排字與線，奶油色是紙，紅只留給關防、價格、
 *       和報頭上那一處。紅不鋪滿，否則紙面會吵。
 *   四、圖版等於欄寬，底下附圖說，不出血、不重疊、不浮動。整頁只在
 *       頭版、商品版、社會版出現圖，分類廣告是純文字——報紙的廣告版
 *       本來就是排字排出來的。
 */

const CJK_DIGITS = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

/**
 * 報頭右格的紀年。舊報紙寫的是民國年，數字也是中文的，
 * 所以把西元年換算後逐位轉成中文數字（二〇二六 → 一一五）。
 */
export function minguo(year: number): string {
  return String(year - 1911)
    .split("")
    .map((digit) => CJK_DIGITS[Number(digit)])
    .join("");
}

export const NAMEPLATE = {
  /** 刊名左格的直書小標，一欄一個詞。 */
  origin: ["台灣製造", "毛孩選物"],
  brand: "匠寵",
  wordmark: "FURMOSA",
  line: "REAL FOOD FOR A WILDER LIFE",
  seal: "匠寵",
  /** 紀年後面那一句，說明這份是誰發的。 */
  issuer: "匠寵發行",
} as const;

/**
 * 版名條：舊報紙每一版的上緣壓一條反白的版名。
 * 這三條是整頁唯一的深色塊，負責把節奏切開，也當視覺的落點。
 */
export type SectionBar = { label: string; note: string };

export const BARS = {
  goods: { label: "商品版", note: "真食材・不調味" },
  /* 版名條的註記不要跟版裡的標題重複，所以這一條寫的是合作的單位。 */
  care: { label: "社會版", note: "匠寵 × 巴克幫－浪犬之家" },
  notices: { label: "分類廣告", note: "各欄詳見內頁" },
} as const satisfies Record<string, SectionBar>;

/**
 * 頭版頭條。整頁最大的那句是直書的，而且只有這一句直書——
 * 直書是語氣最重的手法，一頁用一次最強。
 */
export const FRONT = {
  kicker: "頭版",
  /** 直書的兩欄：第一欄是眉題，第二欄是主題。斷在逗號上。 */
  headline: ["在牠的眼神裡，", "找得到人的影子"],
  /** 導言。第一句是起手，排得比後面兩句重一級。 */
  lead: [
    "我們相信，一包食物不只是零食；",
    "那是你每天回家時，牠願意把頭靠過來的理由。",
    "真食材、不調味，讓牠陪你走更遠的路。",
  ],
  /** 欄底那三行規格，一行一條，前面壓一個小圓點。 */
  claims: ["低溫熱風烘乾", "不添香料色素", "慢工做的雞排"],
  /*
   * 頭版這一張是去背的實拍，不是雕版——全頁唯一的全彩，也是唯一的照片。
   * 擺在白圖版上：狗是近黑的，往下分離得很乾淨；紙袋是奶油白，調色時
   * 已經把高光壓到 247 以下，摺痕才不會在純白上溶掉，再補一層接地陰影收邊。
   */
  art: photoHeroJiba,
  alt: "實拍：一隻臘腸狗張嘴咬住從匠寵紙袋裡探出來的大片雞肉乾，一隻手拿著紙袋，袋上印著匠寵的紅色印章與商品勾選欄",
  caption: "嚎大大・雞霸｜台灣在地・小量製作",
  cta: "看更多",
  href: "/real-food",
} as const;

/** 商品版：四項商品排成四欄，欄間一道髮線，價格貼在欄底。 */
export const GOODS = {
  items: PRODUCTS,
  cta: "查看全部商品",
  href: SHOP_URL,
} as const;

/** 社會版：一張寬圖版配一欄字，是整頁第二個留白大的地方。 */
export const CARE_PAGE = {
  title: "浪浪支持計畫",
  /** 中秋尋家合作計畫的事實照 /real-food 的規格欄，活動已結單要寫清楚。 */
  body: [
    "匠寵與巴克幫－浪犬之家合作，",
    "把七隻等家狗狗的故事放進月餅裡。",
    "每售出一顆月餅，提撥十元支持浪犬之家。",
    "中秋場次已結單，七隻狗狗仍在等家。",
  ],
  art: sceneRidge,
  alt: "情境示意圖：紅色雕版風格的插畫，一個人與一隻狗並肩坐在草坡上，望向遠處的湖與山稜",
  caption: "巴克幫－浪犬之家",
  /** 提撥的金額用跟商品版同一套價格語言寫，不另發明一種。 */
  figure: { note: "每顆月餅提撥", amount: "10", unit: "元" },
  cta: "了解更多",
  href: CHARITY_URL,
} as const;

/**
 * 分類廣告。純文字排版，一格一則，共用同一套髮線格。
 * 文案全部沿用站上既有的說法，沒有新編的促銷字。
 */
export type Notice = {
  name: string;
  tagline: string;
  notes?: readonly string[];
  cta: string;
  href: string;
  external?: boolean;
};

export const NOTICES: Notice[] = [
  {
    name: "換罐計畫",
    tagline: "洗澡時帶一罐回家",
    /* 「換罐計畫」是關於匠寵那一頁寫的事，不是我們編的。 */
    notes: [
      "零食裝在可重複使用的玻璃瓶。",
      "洗澡時帶一罐回家，",
      "吃完把空罐帶回來。",
    ],
    cta: "了解更多",
    href: ABOUT_URL,
    external: true,
  },
  {
    name: "嚎大大・雞霸",
    tagline: "真肉・真食・真開心",
    notes: ["純雞肉做的大片雞排。", "低溫熱風烘乾。"],
    cta: "探索商品",
    href: rowHref(2),
  },
  {
    name: "chill嗨嗨ㄟ貓",
    tagline: "貓咪的放鬆時光",
    cta: "探索商品",
    href: rowHref(4),
    external: true,
  },
  {
    name: "再來一包｜毛孩人格抽驗",
    tagline: "抽出牠的真實個性",
    cta: "探索商品",
    href: rowHref(5),
    external: true,
  },
  {
    name: "預購！背景很硬的碗",
    tagline: "為牠，選一個更好的碗",
    notes: ["預購中。"],
    cta: "看預購",
    href: rowHref(6),
    external: true,
  },
  {
    name: "店家合作",
    tagline: "一起讓更多毛孩吃到好東西",
    cta: "聯絡我們",
    href: rowHref(7),
    external: true,
  },
];

/** 報尾的訂閱欄，照報紙的「讀者服務」小框排。 */
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
