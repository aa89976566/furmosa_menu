import type { StaticImageData } from "next/image";

/*
 * 這一頁是一張食物海報：中央一鍋，四周一圈碟子，每一碟掛一張白色標籤牌。
 *
 * 參考圖裡的鍋、狗、手、筷子與每一盤食物都是插畫。這一版一張都不重畫、
 * 也不生成——碟子裡放的全是專案與 Shopify 的實拍。因此會出現「有商品、
 * 但沒有照片」的碟子（混蔬菜凍乾、鴨喉）。那些碟子一律排成灰階的具名
 * 占位框——寫出該放什麼、標明照片待補，而不是找一張像的照片頂替。
 * 盤面可以有缺口，資料不能有假的。
 *
 * 同樣的規矩也管文案：品名、價格、網址全部取自 furmosa.com，
 * 沒有一項規格或促銷是為了填滿標籤牌寫出來的。
 */
import beefCubes from "@/assets/poster/beef-cubes-loading.jpg";
import canning from "@/assets/poster/canning.jpg";
import cardShiba from "@/assets/poster/drop-card-shiba.jpg";
import charityReceipt from "@/assets/poster/charity-receipt-wide.png";
import cutletBag from "@/assets/poster/cutlet-bag.jpg";
import cutletDog from "@/assets/poster/drop-cutlet-dog.jpg";
import dogDada from "@/assets/poster/dog-dada.jpg";
import dogHeitang from "@/assets/poster/dog-heitang.jpg";
import dogSasa from "@/assets/poster/dog-sasa.jpg";
import dogSiaohuei from "@/assets/poster/stray-dog-siaohuei.jpg";
import dryingRacks from "@/assets/poster/drying-racks.jpg";
import friesCup from "@/assets/poster/drop-all-fries-cup.jpg";
import handTrim from "@/assets/poster/hand-trim.jpg";
import catGrass from "@/assets/poster/drop-cat-catgrass.jpg";
import menuSign from "@/assets/poster/menu-sign.jpg";
import mooncakePacks from "@/assets/poster/mooncake-packs-pair.jpg";
import moonPacks from "@/assets/poster/drop-moon-packs.jpg";
import partnerPigEar from "@/assets/poster/drop-partner-pigear.jpg";
import peekDog from "@/assets/store/photo-hero-jiba.webp";
import wovenBowl from "@/assets/poster/hero-06-bowl.webp";

import { SWAP_REGIONS } from "@/data/about";
import {
  CATNIP_URL,
  PARTNER_URL,
  SHOP_URL,
  WORKS_ROWS,
} from "@/data/works";

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

/** 上緣那一條導覽。挑的是站上真的有的那五個，不照抄參考圖沒有的欄名。 */
export const NAV: NavItem[] = [
  { label: "全部商品", href: rowHref(1), external: true },
  /* /haodada 是本站的改寫路徑（見 next.config.ts），不是外部網址。 */
  { label: "嚎大大雞霸", href: rowHref(2) },
  { label: "chill嗨嗨ㄟ貓", href: CATNIP_URL, external: true },
  { label: "浪浪交易所", href: rowHref(3), external: true },
  { label: "店家合作", href: PARTNER_URL, external: true },
];

export const BRAND = {
  wordmark: "FURMOSA",
  name: "匠寵",
  line: "REAL FOOD FOR A WILDER LIFE",
  mottos: ["吃的・用的・有個性的", "台灣味・毛孩也有份"],
  origin: "台灣製造・毛孩選物",
} as const;

/** 沒有照片的碟子上統一寫這一行，不另外編字。 */
export const PENDING_NOTE = "照片待補";

/* ---------------- 頭盤：雞霸 ---------------- */

/**
 * 整張海報的頭盤。黑描邊的大橢圓盤，旁邊一塊白色標籤牌。
 * 價格、品名、網址都取自 furmosa.com 的商品頁；
 * 規格兩行照抄 /real-food 的製程段落，不寫站上沒有的克數。
 */
export const HERO = {
  eyebrow: "今日主打",
  /** 兩行主標，斷點自己指定，不交給自動折行。 */
  headline: ["雞霸不是零食", "是台灣狗的雞排"],
  lead: "把熟悉的台灣味，放進牠的零食袋。不是只有我們能逛夜市，毛孩也有份。",
  spec: ["一種肉　沒有風味", "台灣在地新鮮雞肉"],
  name: "嚎大大・雞霸",
  currency: "NT$",
  price: "165",
  cta: "立即買雞霸",
  href: `${SHOP_ORIGIN}/products/chicken-fillet`,
  /** 出貨條件。排成海報上那一條紅白的小牌。 */
  ship: ["六片雞霸", "7-ELEVEN 免運"],
  art: cutletDog,
  alt: "實拍：一隻黑色米克斯犬叼著一整片大塊的雞肉乾",
  caption: "嚎大大・雞霸｜台灣在地・小量製作",
} as const;

/* ---------------- 盤面：中央一鍋 ---------------- */

/**
 * 中央那一鍋。參考圖的鍋裡是畫出來的一整鍋乾貨；這一版放的是
 * 實拍的一杯雞肉乾條——同樣是「一只容器裝滿了貨」，而且是真的照片。
 * 點下去是全部商品頁。
 */
export const POT = {
  kicker: "今日菜單",
  title: "一鍋端上來",
  lead: ["吃的・用的・有個性的", "台灣味・毛孩也有份"],
  label: "全部商品",
  note: "價格以商品頁為準",
  cta: "看全部商品",
  href: SHOP_URL,
  art: friesCup,
  alt: "實拍：一只印著匠寵肉掌標誌的紙杯裝滿立著的雞肉乾條",
  /**
   * 參考圖的鍋緣趴著一隻畫出來的狗。那隻不重畫——
   * 換成站上原本就有的去背實拍，讓牠從鍋緣後面探出來。
   */
  peek: {
    art: peekDog,
    alt: "實拍去背：一隻臘腸犬從匠寵的零食袋裡叼起一片雞肉乾",
  },
} as const;

/* ---------------- 盤面：四周的碟子 ---------------- */

/** 碟子的底色。四種，照參考圖量出來的網版印刷色。 */
export type PlateTone = "pale" | "teal" | "blue" | "pan";

/**
 * 碟子的形狀。
 *
 *   plate  壓扁的橢圓——俯視的盤
 *   pan    黑色實心橢圓加兩只鍋耳，參考圖左右各一只
 *   round  正圓的小碟
 */
export type PlateShape = "plate" | "pan" | "round";

export type Plate = {
  name: string;
  note: string;
  /** 只有 furmosa.com 上標了價的那四樣才有價格，其餘留空。 */
  price?: string;
  href: string;
  external?: boolean;
  art?: StaticImageData;
  alt?: string;
  /** 沒有實拍時，占位框上寫的是「該放哪一張」。 */
  pending?: string;
  tone: PlateTone;
  shape: PlateShape;
  /** 碟心在盤面上的座標與碟寬，都是盤面寬的百分比。 */
  x: number;
  y: number;
  w: number;
};

/*
 * 九只碟子的座標是照參考圖量的：中央的鍋佔盤面寬的 40%，碟子沿著
 * 左右兩緣各四只、底下兩只，左緣與右緣各有一只黑鍋。
 *
 * 標籤牌掛在碟子靠中央的那一側（左緣的碟往右掛、右緣的碟往左掛），
 * 參考圖就是這樣讓每一張牌都指回鍋子的。
 */
export const PLATES: Plate[] = [
  {
    name: "嚎大大・雞霸",
    note: "雞肉原味",
    price: "NT$165",
    href: `${SHOP_ORIGIN}/products/chicken-fillet`,
    external: true,
    art: cutletBag,
    alt: "實拍：一片大雞肉乾插在印著匠寵圖章與 Thank you very much 的紙袋裡",
    tone: "pale",
    shape: "plate",
    x: 12,
    y: 14,
    w: 17.6,
  },
  {
    name: "簡記・牛肉地瓜",
    note: "30 克",
    price: "NT$180",
    href: `${SHOP_ORIGIN}/products/jian-ji-niu-rou-di-gua-su`,
    external: true,
    art: beefCubes,
    alt: "實拍：牛肉丁凍乾排成一條 LOADING 進度條",
    tone: "teal",
    shape: "plate",
    x: 83,
    y: 12,
    w: 15.5,
  },
  {
    name: "青菜底加・混蔬菜凍乾",
    note: "30 克",
    price: "NT$180",
    href: `${SHOP_ORIGIN}/products/青菜底加-混蔬菜凍乾`,
    external: true,
    pending: "混蔬菜凍乾商品照",
    tone: "pale",
    shape: "plate",
    x: 91,
    y: 33,
    w: 14.5,
  },
  {
    name: "店家合作",
    note: "一起讓更多毛孩吃到好東西",
    href: PARTNER_URL,
    external: true,
    art: partnerPigEar,
    alt: "實拍：一只豬耳朵零食擺在白底上，底下寫著今天乖乖嗎",
    tone: "pan",
    shape: "pan",
    x: 13,
    y: 46,
    w: 19,
  },
  {
    name: "背景很硬的碗",
    note: "預購中",
    href: rowHref(6),
    external: true,
    art: wovenBowl,
    alt: "實拍：藤編外圈搭深綠釉內裡的寵物碗",
    tone: "pan",
    shape: "pan",
    x: 86.5,
    y: 56,
    w: 19,
  },
  {
    name: "唐老・鴨喉",
    note: "30 克",
    price: "NT$110",
    href: `${SHOP_ORIGIN}/products/tang-lao-ya-hou-zku85`,
    external: true,
    pending: "鴨喉商品照",
    tone: "blue",
    shape: "plate",
    x: 12,
    y: 71,
    w: 17,
  },
  {
    name: "chill嗨嗨ㄟ貓",
    note: "貓咪的放鬆時光",
    href: CATNIP_URL,
    external: true,
    art: catGrass,
    alt: "一片台灣形狀的貓草雞肉乾浮在星雲裡，右下角一隻黑貓抬頭看著",
    tone: "teal",
    shape: "plate",
    x: 87,
    y: 80,
    w: 17.6,
  },
  {
    name: "浪浪交易所",
    note: "中秋限定盤・已結單",
    href: rowHref(3),
    external: true,
    art: moonPacks,
    alt: "實拍：印著「牠的月餅」與一隻黑白狗的中秋月餅包裝",
    tone: "blue",
    shape: "round",
    x: 63,
    y: 88,
    w: 14,
  },
  {
    name: "再來一包",
    note: "毛孩人格抽驗",
    href: rowHref(5),
    external: true,
    art: cardShiba,
    alt: "實拍：一隻柴犬坐在步道上，前面有人舉著一張寫著柴犬的抽卡",
    tone: "teal",
    shape: "round",
    x: 29,
    y: 89,
    w: 13,
  },
];

/**
 * 鍋邊加點。品名照抄 /real-food 的「本期好物上架中」那一欄，
 * 那幾項站上有品名、但這一頁沒有單品頁與標價，所以只排名字，
 * 不自己編價格，點下去是全部商品頁。
 */
export const SIDES = {
  kicker: "鍋邊加點",
  note: "價格以商品頁為準",
  items: [
    "大力士・牛肉丁凍乾",
    "頂真做・雞肉丁凍乾",
    "卵啵啵・柳葉魚凍乾",
    "走敢若飛・鴨翅",
    "草上飛・貓草雞肉乾",
  ],
  cta: "看全部商品",
  href: SHOP_URL,
} as const;

/* ---------------- 怎麼做的 ---------------- */

/**
 * 三張製程實拍。圖說與 alt 照抄 /paper 原處，不改一個字。
 * 那三張是匠寵自己的現場照（圍裙與鐵罐上都有字標），不是示意圖。
 */
export const MAKING = {
  kicker: "怎麼做的",
  title: "一種肉　沒有風味",
  body: [
    "一片雞肉從台灣的產地走到毛孩的碗裡，中間經過幾雙手、幾度溫度、幾次挑選。",
    "選用台灣在地新鮮雞肉，由匠寵團隊手工修整、低溫乾燥，保留肉質的原始風味與營養。",
  ],
  figure: { value: "1", unit: "種肉", note: "零廢話・零「風味」" },
  steps: [
    {
      art: handTrim,
      alt: "戴手套的雙手以剪刀修整生雞肉片",
      caption: "一片一片修整",
    },
    {
      art: dryingRacks,
      alt: "不鏽鋼乾燥架上一層層舖平的雞肉片",
      caption: "低溫乾燥",
    },
    {
      art: canning,
      alt: "戴手套的手將雞肉乾放入印有匠寵字樣的不鏽鋼罐",
      caption: "裝進可回收的罐子",
    },
  ],
  sign: {
    art: menuSign,
    alt: "實拍：匠寵的紅色今日菜單告示牌，上面直書著握手騙的肉、半夜偷的糧等品名",
    caption: "匠寵・今日菜單告示牌",
  },
} as const;

/* ---------------- 公益：中秋月餅 ---------------- */

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
 * 公益那一段。
 *
 * 金額、收據編號與日期逐字轉錄自受贈單位開立的收執聯，民國紀年照抄不換算。
 * 月餅照與收據都維持原彩——它們陳述的是事實，不能被染色，也不能被橘底吃掉，
 * 所以這一段的底是白的。
 */
export const CHARITY = {
  kicker: "匠寵 × 巴克幫－浪犬之家",
  title: "中秋月餅公益行動",
  /** 導言照抄 /mooncake 上的那一句，中間一個全形空。 */
  lead: "七個包裝　七個正在等家的故事",
  /**
   * 捐款比例在這一頁只說一次，就說在這一條上。
   * 單位是「一顆月餅」不是「一盒」：/mooncake 與 /real-food 兩頁寫的都是
   * 每售出一顆提撥十元，這一頁跟著它們，不自己換一套算法。
   */
  pull: "每售出一顆月餅提撥十元",
  body: [
    "匠寵與巴克幫－浪犬之家合作，把七隻等家狗狗的故事放進月餅裡。",
    "中秋場次已結單，七隻狗狗仍在等家。多一個人看到，就多一個回家的可能。",
  ],
  photo: {
    art: mooncakePacks,
    alt: "實拍：兩款中秋月餅包裝，左邊印著「牠的月餅」與一隻黑白狗，右邊印著「牠的故事」與七塊畫上狗臉的月餅",
    caption: "牠的月餅・牠的故事｜兩款包裝實拍",
  },
  receipt: {
    kicker: "捐款收據・收執聯",
    header: "社團法人臺灣巴克動物懷善救援協會　捐款收據",
    art: charityReceipt,
    alt: "社團法人臺灣巴克動物懷善救援協會開立的捐款收據，金額 NT$11,480",
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

/* ---------------- 換罐計畫 ---------------- */

const SWAP_TOTAL = SWAP_REGIONS.reduce((sum, region) => sum + region.count, 0);

export const SWAP = {
  kicker: "換罐計畫",
  title: "洗澡時帶一罐回家，吃完把空罐帶回來",
  body: [
    "零食裝在可重複使用的玻璃瓶裡。空罐不進垃圾場，",
    "洗乾淨再裝下一輪，所以同一個罐子會來回很多次。",
  ],
  figures: [
    { value: String(SWAP_TOTAL), unit: "家", note: "合作店家" },
    { value: "333", unit: "人", note: "已經換過罐" },
  ],
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
  label: "訂閱",
  title: "新菜上桌就通知你",
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
  name: "匠寵",
  line: "REAL FOOD FOR A WILDER LIFE",
  holder: "FURMOSA 匠寵",
  origin: "TAIWAN",
  slogan: "吃的、用的、有個性的　—　台灣味、毛孩也有份",
} as const;
