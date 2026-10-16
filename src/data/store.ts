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
import catFace from "@/assets/store/cat-face.webp";
import cutJerky from "@/assets/store/cut-1-jerky.webp";
import cutMoon from "@/assets/store/cut-2-moon.webp";
import cutCat from "@/assets/store/cut-3-cat.webp";
import cutSachets from "@/assets/store/cut-4-sachets.webp";
import cutBowl from "@/assets/store/cut-5-bowl.webp";
import cutRetriever from "@/assets/store/cut-6-retriever.webp";
import cutJar from "@/assets/store/cut-jar.webp";
import dogLying from "@/assets/store/dog-lying.webp";
import dogSitting from "@/assets/store/dog-sitting.webp";
import dogTrotting from "@/assets/store/dog-trotting.webp";
import goodsBeef from "@/assets/store/goods-2-beef.webp";
import goodsDuck from "@/assets/store/goods-4-duck.webp";
import goodsJiba from "@/assets/store/goods-1-jiba.webp";
import goodsVeg from "@/assets/store/goods-3-veg.webp";
import heroDogCat from "@/assets/store/hero-dog-cat.webp";
import sceneGrove from "@/assets/store/scene-grove.webp";
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

export const MASTHEAD = {
  /** 報頭左格的直書小標與它下面那行拉丁字。 */
  badge: "犬貓樂",
  origin: ["FURMOSA", "TAIWAN"],
  wordmark: "FURMOSA",
  brand: "匠寵",
  line: "REAL FOOD FOR A WILDER LIFE",
  /** 報頭右邊那只紅框裡的直書引文。 */
  quote: "好食物，讓牠們的世界再大一點。",
  seal: "匠寵",
  art: dogSitting,
  alt: "情境示意圖：紅色雕版風格的插畫，一隻側坐著的長毛狗",
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

export const HERO = {
  /**
   * 直書大標，一個字串就是一欄：斷在逗號上，不讓「生活」被折到兩欄去。
   * 直書排不了阿拉伯數字，所以這一頁的直書欄位一律不出現數字。
   */
  claim: ["吃好的，", "生活更野。"],
  line: ["REAL FOOD FOR A", "WILDER LIFE"],
  seal: "匠寵",
  /** 頭條也是一個字串一欄：稿子是兩欄，斷在逗號上。 */
  headline: ["在牠的眼神裡，", "找得到人的影子"],
  /**
   * 直書本文，一行就是一欄：分幾行就折幾欄，所以是照欄數斷行而不是照語氣。
   * 稿子上這一塊是三欄，每欄的字數要相近，字塊才是方正的一塊。
   */
  body: [
    "我們相信，一包食物不只是零食；",
    "那是你每天回家時，牠願意把頭靠過來的理由。",
    "真食材、不調味，讓牠陪你走更遠的路。",
  ],
  cta: "看更多",
  art: heroDogCat,
  alt: "情境示意圖：紅色雕版風格的插畫，一隻張嘴笑的牧羊犬與一隻虎斑貓並肩看著鏡頭",
} as const;

export type Drop = {
  index: string;
  title: string[];
  caption: string;
  href: string;
  external?: boolean;
  art: StaticImageData;
  alt: string;
};

/*
 * 稿子上的「本期六大 DROP」就是首頁清單的第二到第七列——第一列「全部商品」
 * 是架本身，所以它留在導覽列與下面那條「查看全部商品」。
 * 卡片插圖是雕版情境示意圖，各自照那一列真正在賣的東西刻。
 */
export const DROPS: Drop[] = [
  {
    index: "01",
    title: ["嚎大大雞霸"],
    caption: "真肉・真食・真開心",
    href: rowHref(2),
    art: cutJerky,
    alt: "情境示意圖：紅色雕版風格的插畫，一疊大片雞肉乾",
  },
  {
    index: "02",
    title: ["浪浪交易所", "中秋限定盤"],
    caption: "吃一口，幫助更多浪浪",
    href: rowHref(3),
    external: true,
    art: cutMoon,
    alt: "情境示意圖：紅色雕版風格的插畫，一隻狗與一隻貓並坐在滿月下",
  },
  {
    index: "03",
    title: ["chill嗨嗨ㄟ貓"],
    caption: "貓咪的放鬆時光",
    href: rowHref(4),
    external: true,
    art: cutCat,
    alt: "情境示意圖：紅色雕版風格的插畫，一隻瞇著眼的虎斑貓與幾葉貓草",
  },
  {
    index: "04",
    title: ["再來一包", "毛孩人格抽驗"],
    caption: "抽出牠的真實個性",
    href: rowHref(5),
    external: true,
    art: cutSachets,
    alt: "情境示意圖：紅色雕版風格的插畫，三包併排的零食鋁箔包",
  },
  {
    index: "05",
    title: ["預購！", "背景很硬的碗"],
    caption: "為牠，選一個更好的碗",
    href: rowHref(6),
    external: true,
    art: cutBowl,
    alt: "情境示意圖：紅色雕版風格的插畫，一只回收藤編的淺口狗碗",
  },
  {
    index: "06",
    title: ["店家合作"],
    caption: "一起讓更多毛孩吃到好東西",
    href: rowHref(7),
    external: true,
    art: cutRetriever,
    alt: "情境示意圖：紅色雕版風格的插畫，一隻黃金獵犬張嘴笑著看鏡頭",
  },
];

export const DROPS_BAND = {
  title: "本期六大 DROP",
  note: "每一個毛孩，都是一份支持。",
  seal: "匠寵",
  cta: "探索商品",
} as const;

export const ABOUT = {
  /** 直書大標。稿子在逗號處斷欄，所以一欄寫一句，別讓它自己折在「也是旅／伴」。 */
  claim: ["毛孩不是寵物，", "是家人，", "也是旅伴。"],
  line: ["REAL FOOD", "FOR A", "WILDER LIFE"],
  seal: "匠寵",
  /** 橫書本文，一行一句。 */
  body: [
    "每一包食物，",
    "都是一份對牠的理解與支持。",
    "從日常的營養開始，",
    "讓毛孩在你的身邊，",
    "走更遠的路，",
    "看更廣的風景。",
  ],
  cta: "關於匠寵",
  href: ABOUT_URL,
  art: sceneRidge,
  alt: "情境示意圖：紅色雕版風格的插畫，一個人與一隻狗並肩坐在草坡上，望向遠處的湖與山稜",
} as const;


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

/** 分頁籤連的是 furmosa.com 上真的存在的分類。 */
export const PRODUCT_TABS: NavItem[] = [
  { label: "零食凍乾", href: `${SHOP_ORIGIN}/collections/寵物零食與凍乾`, external: true },
  { label: "狗狗", href: `${SHOP_ORIGIN}/collections/狗狗`, external: true },
  { label: "貓咪", href: `${SHOP_ORIGIN}/collections/貓咪`, external: true },
  { label: "餐具收納", href: `${SHOP_ORIGIN}/collections/寵物餐具與收納`, external: true },
];

export const GOODS_BAND = {
  title: "嚴選商品",
  cta: "查看全部商品",
  shopHref: SHOP_URL,
  /** 左邊那塊直書欄的大標與它底下的藍墨商標犬。 */
  claim: ["真食材，", "不調味。"],
  art: dogTrotting,
  alt: "情境示意圖：藍色雕版風格的插畫，一隻側身跑著的小獵犬",
  /* 「換罐計畫」是關於匠寵那一頁寫的事，不是我們編的。 */
  swap: {
    title: "換罐計畫",
    body: [
      "零食裝在可重複使用的玻璃瓶。",
      "洗澡時帶一罐回家，",
      "吃完把空罐帶回來。",
    ],
    cta: "了解更多",
    href: ABOUT_URL,
    art: cutJar,
    alt: "情境示意圖：藍色雕版風格的插畫，一只裝著零食的玻璃保存罐",
  },
} as const;

export const CARE = {
  title: "浪浪支持計畫",
  /** 中秋尋家合作計畫的事實照 /real-food 的規格欄，活動已結單要寫清楚。 */
  body: [
    "匠寵與巴克幫－浪犬之家合作，",
    "把七隻等家狗狗的故事放進月餅裡。",
    "每售出一顆月餅，提撥十元支持浪犬之家。",
    "中秋場次已結單，七隻狗狗仍在等家。",
  ],
  cta: "了解更多",
  href: CHARITY_URL,
  art: dogLying,
  alt: "情境示意圖：紅色雕版風格的插畫，一隻狗伏在草地上抬著頭",
  /** 中間那塊直書欄。 */
  aside: ["牠的日常，", "也是我們的日常。"],
  asideArt: catFace,
  asideAlt: "情境示意圖：紅色雕版風格的插畫，一隻正面看著鏡頭的虎斑貓",
  news: {
    title: ["最新消息，", "訂閱。"],
    placeholder: "輸入 Email",
    submit: "訂閱",
    art: sceneGrove,
    alt: "情境示意圖：紅色雕版風格的插畫，一小片樹林、草坡與遠處的山稜",
  },
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
