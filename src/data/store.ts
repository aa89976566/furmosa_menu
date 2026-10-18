import type { StaticImageData } from "next/image";

/*
 * 這一頁只用專案裡既有的真實照片，沒有雕版、沒有線描、沒有生成的圖。
 *
 * 因此會出現「有事實、但沒有照片」的格子（兩項商品、七隻狗狗裡的三隻）。
 * 那些格子一律排成灰階的具名占位框——寫出該放什麼、標明照片待補，
 * 而不是找一張像的照片頂替，也不是畫一張插圖填滿版面。
 * 版面可以有缺口，資料不能有假的。
 *
 * 同樣的規矩也管文案：報頭的天氣欄不寫氣溫與降雨（那是查得到、
 * 而且馬上就錯的數字），商品不寫站上沒有的規格與促銷。
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

/*
 * 報眉的欄目列。參考圖上是五欄，所以這裡也挑五個——
 * 但挑的是站上真的有的那五個，不照抄參考圖裡「狗用零食／貓用零食」
 * 這種本站沒有對應頁面的欄名。
 */
export const NAV: NavItem[] = [
  { label: "全部商品", href: rowHref(1), external: true },
  /* /haodada 是本站的改寫路徑（見 next.config.ts），不是外部網址。 */
  { label: "嚎大大雞霸", href: rowHref(2) },
  { label: "chill嗨嗨ㄟ貓", href: rowHref(4), external: true },
  { label: "浪浪交易所", href: rowHref(3), external: true },
  { label: "店家合作", href: rowHref(7), external: true },
];

/* ---------------- 報眉與期號 ---------------- */

const CJK_DIGITS = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

/** 報頭的紀年。舊報紙寫民國年，數字也是中文的（二〇二六 → 一一五）。 */
export function minguo(year: number): string {
  return String(year - 1911)
    .split("")
    .map((digit) => CJK_DIGITS[Number(digit)])
    .join("");
}

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

export type Dateline = {
  date: string;
  weekday: string;
  era: string;
  weather: { label: string; value: string; note: string };
};

/**
 * 報眉右邊那一格日期天氣。
 *
 * 這一頁是靜態產生的，日期在 build 時就定下來——報紙本來就印了就不會改。
 * 天氣欄刻意不寫氣溫或降雨：那會變成一個查得到、而且馬上就錯的數字。
 * 寫的是宜不宜出門，像農民曆那一欄，是編輯語氣而不是氣象資料。
 */
export function datelineOf(now: Date): Dateline {
  return {
    date: `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`,
    weekday: `星期${WEEKDAYS[now.getDay()]}`,
    era: `中華民國${minguo(now.getFullYear())}年`,
    weather: { label: "天氣", value: "適合散步", note: "宜出門" },
  };
}

/** 期號那一條。三格：左邊期號、中間英文標語、右邊刊名的英文。 */
export const ISSUE = {
  number: "第 001 期",
  origin: "台灣・毛孩也有份",
  line: "TAIWAN FLAVOR FOR FURRY FAMILY",
  daily: "FURMOSA DAILY",
} as const;

/**
 * 刊名不在版面中央，而是立在右側那條直欄裡。
 * 所以品牌名要能直排——brand 兩個字直著疊，拉丁字標橫著墊在上面。
 */
export const NAMEPLATE = {
  brand: "匠寵",
  wordmark: "FURMOSA",
  line: "REAL FOOD FOR A WILDER LIFE",
  origin: "台灣製造・毛孩選物",
  issuer: "匠寵發行",
  seal: "匠寵",
  column: "毛孩日報",
  /* 刊頭柱底下那兩行，參考圖上也是兩行。 */
  mottos: ["吃的・用的・有個性的", "台灣味・毛孩也有份"],
} as const;

/* ---------------- 第一版 ---------------- */

/**
 * 第一版是四欄，寬度全不一樣，由左到右：
 *
 *   窄高切口 → 直排主標 → 主圖 → 直排規格
 *
 * 主標兩行，一行藍一行紅：紅那一行是重點引文，不是裝飾。
 * 主圖上壓一枚紅關防，那是唯一一處刻意讓字跨到圖上的地方。
 */
export const HERO = {
  kicker: "第一版",
  /** 兩行直書。第一行在最右邊，斷點自己指定，不交給自動折行。 */
  headline: ["雞霸不是零食", "是台灣狗的雞排"],
  /** 導言也自己指定斷點，直排才不會斷在詞中間。 */
  lead: ["把熟悉的台灣味", "放進牠的零食袋", "不是只有我們能逛夜市", "毛孩也有份"],
  art: heroJiba,
  alt: "實拍：一隻臘腸狗張嘴咬住從匠寵紙袋裡探出來的大片雞肉乾，一隻手拿著紙袋，袋上印著匠寵的紅色印章與商品勾選欄",
  caption: "嚎大大・雞霸｜台灣在地・小量製作",
  /** 壓在主圖上的紅關防。 */
  seal: "雞霸",
  /** 最左邊那條窄高切口。 */
  side: {
    art: cutletBag,
    alt: "實拍：一片大雞肉乾插在印著匠寵圖章與 Thank you very much 的紙袋裡",
    caption: "雞霸・原件",
  },
  /** 最右邊那欄直排規格。兩句都照抄 /real-food 的製程段落。 */
  spec: {
    display: ["一種肉", "沒有風味"],
    body: [
      "選用台灣在地新鮮雞肉，由匠寵團隊手工修整、低溫乾燥，",
      "保留肉質的原始風味與營養。",
    ],
    claims: ["低溫熱風烘乾", "不添香料色素", "台灣在地新鮮雞肉"],
  },
} as const;

/**
 * 刊頭柱底下那一盒今日主打。
 *
 * 價格、品名、網址都取自 furmosa.com 的商品頁；
 * 免運那一行是出貨條件，排成報紙廣告底下加框的小字。
 */
export const FEATURE = {
  label: "今日主打",
  name: "雞霸",
  sub: "嚎大大・雞霸",
  spec: "雞肉原味",
  currency: "NT$",
  price: "165",
  cta: "立即買雞霸",
  href: `${SHOP_ORIGIN}/products/chicken-fillet`,
  /*
   * 免運條件。刊頭欄那條窄欄只有紙寬的 11.6%，這一行一定會折成兩行，
   * 所以斷點自己指定——交給瀏覽器會折在 7-ELEVEN 的連字號上。
   */
  ship: ["六片雞霸", "7-ELEVEN 免運"],
} as const;

/* ---------------- 快訊 ---------------- */

const SWAP_TOTAL = SWAP_REGIONS.reduce((sum, region) => sum + region.count, 0);

/**
 * 頭版底下那一條。只有一行高，字級是全頁最小的一級，
 * 作用是把第一版與分類廣告接起來，不是又一個版。
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

/* ---------------- 分類廣告 ---------------- */

/**
 * 不是商品卡：四則廣告的級別不一樣，所以尺寸也不一樣。
 *
 *   lead   有實拍、有內文、照片最大
 *   plain  有占位框、沒有內文
 *   text   只有一行字，沒有圖——雞霸已經是第一版的頭條，
 *          分類廣告裡只留一則互見，這是報紙本來的做法
 *
 * art 只在專案裡確實有該商品的實拍時才給；沒有的留 undefined，
 * 由版面排成灰階占位框。拿一張別的商品照頂替，等於在資料裡說謊。
 */
export type AdKind = "lead" | "plain" | "text";

export type Ad = {
  kind: AdKind;
  name: string;
  spec: string;
  price: string;
  href: string;
  art?: StaticImageData;
  alt?: string;
  body?: string;
  /** 沒有實拍時，占位框上寫的是「該放哪一張」。 */
  pending?: string;
  /** 只有文字的那一則，指回第一版。 */
  note?: string;
};

export const ADS: Ad[] = [
  {
    kind: "lead",
    name: "簡記・牛肉地瓜",
    spec: "30 克",
    price: "NT$180",
    href: `${SHOP_ORIGIN}/products/jian-ji-niu-rou-di-gua-su`,
    art: beefCubes,
    alt: "實拍：牛肉丁凍乾排成一條 LOADING 進度條",
    body: "牛肉配地瓜，凍乾成一口一塊的大小。",
  },
  {
    kind: "plain",
    name: "青菜底加・混蔬菜凍乾",
    spec: "30 克",
    price: "NT$180",
    href: `${SHOP_ORIGIN}/products/青菜底加-混蔬菜凍乾`,
    pending: "混蔬菜凍乾商品照",
  },
  {
    kind: "plain",
    name: "唐老・鴨喉",
    spec: "30 克",
    price: "NT$110",
    href: `${SHOP_ORIGIN}/products/tang-lao-ya-hou-zku85`,
    pending: "鴨喉商品照",
  },
  {
    kind: "text",
    name: "嚎大大・雞霸",
    spec: "雞肉原味",
    price: "NT$165",
    href: `${SHOP_ORIGIN}/products/chicken-fillet`,
    note: "詳見第一版",
  },
];

export type NewsBrief = { name: string; note: string; href: string; external?: boolean };

/** 廣告欄最右邊那一條索引。只有標題與一行說明，沒有圖、沒有價格。 */
export const BRIEFS = {
  label: "其他欄目",
  items: [
    { name: "chill嗨嗨ㄟ貓", note: "貓咪的放鬆時光", href: rowHref(4), external: true },
    { name: "再來一包", note: "毛孩人格抽驗", href: rowHref(5), external: true },
    { name: "背景很硬的碗", note: "預購中", href: rowHref(6), external: true },
    { name: "店家合作", note: "一起讓更多毛孩吃到好東西", href: rowHref(7), external: true },
  ] satisfies NewsBrief[],
} as const;

export const ADS_BAR = {
  label: "分類廣告・本日狗食",
  note: "價格以商品頁為準",
  action: "選購",
  cta: "查看全部商品",
  href: SHOP_URL,
  cartLabel: "購物車",
  cartHref: CART_URL,
} as const;

/* ---------------- 第二版：中秋月餅公益 ---------------- */

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
 * 第二版。五欄，由左到右：
 *
 *   紅框直排版名 → 直排內文 → 月餅實拍 → 直排導言與紅色引文 → 捐款收據
 *
 * 金額、收據編號與日期逐字轉錄自受贈單位開立的收執聯，民國紀年照抄不換算。
 * 月餅照與收據都維持原彩——它們陳述的是事實，不能被染色。
 */
export const SECOND = {
  kicker: "第二版",
  bar: { label: "中秋月餅公益行動", note: "匠寵 × 巴克幫－浪犬之家" },
  /* 紅框那一欄的直排版名，斷點自己指定。 */
  title: ["中秋月餅", "公益行動"],
  body: [
    "匠寵與巴克幫－浪犬之家合作，",
    "把七隻等家狗狗的故事放進月餅裡。",
    "中秋場次已結單，七隻狗狗仍在等家。",
    "多一個人看到，就多一個回家的可能。",
  ],
  /** 直排導言，兩行。照抄 /mooncake 上的那一句。 */
  lead: ["七個包裝", "七個正在等家的故事"],
  /**
   * 捐款比例在這一頁只說一次，就說在這條橫向引文上。
   * 內文因此不再重述一遍——同一件事用兩種單位寫會自己打自己。
   */
  pull: "每售出一盒　捐出 NT$10",
  photo: {
    art: mooncakePacks,
    alt: "實拍：兩款中秋月餅包裝，左邊印著「牠的月餅」與一隻黑白狗，右邊印著「牠的故事」與七塊畫上狗臉的月餅",
    /* 圖說說的是照片裡有什麼，不重複導言已經說過的那一句。 */
    caption: "牠的月餅・牠的故事｜兩款包裝實拍",
  },
  receipt: {
    header: "社團法人臺灣巴克動物懷善救援協會　捐款收據",
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

/* ---------------- 換罐計畫（第二版右下的小欄目） ---------------- */

export type NewsFigure = { value: string; unit: string; note: string };

export const SWAP = {
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
} as const;

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
  slogan: "吃的、用的、有個性的　—　台灣味、毛孩也有份",
} as const;
