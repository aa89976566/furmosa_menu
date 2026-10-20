import type { StaticImageData } from "next/image";

/*
 * 這一頁是一張食物海報。版面逐一量自參考圖（1594×987）：
 * 最上一條深紅的運送條、正中一只橢圓大鍋、四周七只分類碟、
 * 鍋下一枚「加入購物車」的膠囊、一條奶白的運送說明，最下一排奶白的頁尾。
 *
 * 參考圖裡的鍋、狗、夾子與每一碟的食物都是插畫。這一版一張都不重畫、
 * 也不生成——碟子裡放的全是 furmosa.com 的商品實拍，而且每一張都確認過
 * 它真的屬於牌上寫的那一個分類（用 collections/<handle>/products.json 對過）。
 * 盤面可以有缺口，資料不能有假的。
 *
 * 同樣的規矩也管文案。參考圖上有三處是編出來的，所以這一版都沒照抄：
 *   - 「再買 NT$734」「購物車 2｜NT$465」是購物車的即時狀態。這一頁是靜態的，
 *     而且車在 furmosa.com 上（跨網域讀不到），所以不寫數字，也不畫進度條。
 *   - 「宅配 NT$120」站上沒有這個價。常見問題寫的是 7-11 店到店 $60 與
 *     新竹物流宅配，所以運送條排的是那兩項加上真的免運門檻。
 *   - 「六片雞霸免運」站上已經查不到「六片」這個說法，所以不留。
 *   - 「KALI 分開出貨 你只付一次運費」站上沒有。KALI 那一頁寫的是預購與出貨日，
 *     所以那一枚對話框改寫真的出貨時程。
 */
import canning from "@/assets/poster/canning.jpg";
import charityReceipt from "@/assets/poster/charity-receipt-wide.png";
import cutletDog from "@/assets/poster/drop-cutlet-dog.jpg";
import dogDada from "@/assets/poster/dog-dada.jpg";
import dogHeitang from "@/assets/poster/dog-heitang.jpg";
import dogSasa from "@/assets/poster/dog-sasa.jpg";
import dogSiaohuei from "@/assets/poster/stray-dog-siaohuei.jpg";
import dryingRacks from "@/assets/poster/drying-racks.jpg";
import handTrim from "@/assets/poster/hand-trim.jpg";
import menuSign from "@/assets/poster/menu-sign.jpg";
import mooncakePacks from "@/assets/poster/mooncake-packs-pair.jpg";
import peekDog from "@/assets/poster/dog-cutlet-cutout.webp";

/*
 * 去背的實拍。參考圖的碟子上擺的是去背食材、而且會溢出碟緣，所以碟子裡
 * 不能放方形照片——得有帶 alpha 的素材才做得出同一件事。
 * 這幾張是用 scripts/make-cutouts.py 把原圖的單色背景挖掉的，
 * 食材本身的像素一個都沒動，原彩完全保留。
 */
import catGrass from "@/assets/poster/cutout/cat-grass.webp";
import kongToys from "@/assets/poster/cutout/kong-toys.webp";
import potFill from "@/assets/poster/cutout/pot-fill.webp";
import shampooRow from "@/assets/poster/cutout/shampoo-row.webp";
import wovenBowl from "@/assets/poster/cutout/woven-bowl.webp";

/*
 * 另外三只碟子放的是整張商品照裁進圓裡。這三張原圖的背景本身就是一片乾淨的
 * 淺色（白紙袋、青色背板、柔灰棚景），裁成圓之後那片背景就是碟面——
 * 參考圖那三只碟子就是這樣做的，所以這裡不去背。
 */
import cubesTower from "@/assets/poster/cubes-tower.jpg";
import cutletBag from "@/assets/poster/cutlet-bag.jpg";
import rabbitTray from "@/assets/poster/rabbit-tray.jpg";

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

/** 沒有照片的格子上統一寫這一行，不另外編字。 */
export const PENDING_NOTE = "照片待補";

/* ---------------- 海報的上緣與下緣 ---------------- */

/**
 * 最上面那一條深紅。參考圖量到高 52px（5.27%H），左邊一行白字接一條金色的
 * 進度條（x 375–701、高 18px），右邊是購物車的即時金額（x 1215–1529）。
 *
 * 進度條與金額都是購物車狀態。這一頁是靜態的、車又在 furmosa.com 上，
 * 跨網域讀不到，所以兩樣都不畫——寧可讓那 20% 的寬度空著，
 * 也不要畫一條沒有依據的進度條。
 * 留在條上的是真的：公告列逐字寫的免運門檻，與一個連到真購物車的入口。
 */
export const TOPBAR = {
  /** furmosa.com 公告列寫的是「滿1199免運」，常見問題寫的是全句，這裡取全句。 */
  note: "全館單筆消費滿 NT$1,199 宅配免運",
  cart: "購物車",
  cartHref: CART_URL,
} as const;

/**
 * 海報的大標。參考圖的黑字量到 x 628–965（寬 338px）、y 69–166（高 98px），
 * 中線 49.97%W——也就是整張圖的正中。一個字 84.5px，外面包一圈奶白的描邊。
 * 兩側各兩根傾斜的強調條，描邊是黑的、內芯是奶白，座標見 store.css。
 */
export const TITLE = {
  text: "全部商品",
  href: SHOP_URL,
} as const;

/**
 * 鍋下那一枚膠囊。量到 x 586–1007（寬 422px、26.47%W）、y 691–790
 * （高 100px、10.13%H），中心落在 (49.97%W, 75.03%H)，圓角就是半個高
 * （dy=0 內縮 49px、dy=16 內縮 14px，對得上 r=50 的圓）。底色 rgb(136,15,20)。
 *
 * 參考圖寫「加入購物車」。這一頁沒有購物車（商品在 furmosa.com 上結帳），
 * 所以同一枚膠囊連到全部商品頁，字改成動作本身做得到的那一件事。
 */
export const CTA = {
  label: "逛全部商品",
  href: SHOP_URL,
} as const;

/**
 * 膠囊下面那一條奶白。量到 x 373–1217（寬 845px、53.01%W）、
 * y 808–878（高 71px、7.19%H），裡面兩道分隔線在 44.48%W 與 56.52%W，
 * 分成三格。底色 rgb(253,245,219)。
 *
 * 三格的內容照抄 /pages/常見問題 的「物流與運費」與「免運優惠」：
 * 兩種物流各一格、免運門檻一格。參考圖那格「宅配 NT$120」站上沒有，不留。
 * 參考圖第一格印了 7-ELEVEN 的商標，那是別人的註冊商標、也是畫出來的，
 * 所以這裡只留字。
 */
export const SHIP_STRIP = {
  cells: [
    "7-11 店到店 $60",
    "新竹物流 宅配到家",
    "滿 NT$1,199 免運",
  ],
  href: FAQ_URL,
} as const;

/**
 * 左下角那一枚深紅的對話框。量到 x 55–294（寬 240px、15.06%W）、
 * y 743–855（高 113px、11.45%H），底色 rgb(148,21,28)，裡面兩行白字。
 *
 * 參考圖寫「KALI 分開出貨 你只付一次運費」——站上查不到這件事，所以不照抄。
 * 換成 /pages/found-object-001 上真的寫了的那兩行：它是預購，不是現貨。
 */
export const KALI_NOTE = {
  lines: ["KALI 藤編碗是預購", "2026/10/30 起依序出貨"],
  href: "https://furmosa.com/pages/found-object-001",
} as const;

/**
 * 海報最下面那一排奶白。整條量到 y 895–986（高 92px、9.32%H），
 * 四個項目的左右界是 x 150–390、510–744、851–1141、1251–1443，
 * 三道 2px 的分隔線在 27.79%W、49.65%W、74.75%W、縱向 y 909–964。
 * 整排的中線落在 49.97%W，所以是一列居中、項目之間約 110px 的間距。
 * 字高量到 29px，圖示 40–46px。
 *
 * 參考圖的四個項目是 DROP 檔案庫／真食堂 文章／配送與購物須知／換罐計畫。
 * 這四個站上都有對應的頁，所以名字按真的頁名寫：
 * 編號清單那一頁自己的標題是「匠寵凍乾目錄」，配送寫在常見問題裡，
 * 換罐計畫寫在關於匠寵裡。
 */
export type PosterFootItem = {
  label: string;
  href: string;
  external?: boolean;
  /** 圖示的代號，字形畫在 page.tsx 裡。 */
  icon: "list" | "book" | "truck" | "jar";
};

export const POSTER_FOOT: PosterFootItem[] = [
  { label: "凍乾目錄", href: "/", icon: "list" },
  { label: "真食堂 文章", href: "/real-food", icon: "book" },
  { label: "配送與購物須知", href: FAQ_URL, external: true, icon: "truck" },
  { label: "換罐計畫", href: ABOUT_URL, external: true, icon: "jar" },
];

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
  /**
   * 出貨條件。排成海報上那一條紅白的小牌。
   * 兩行都照抄 /pages/常見問題；上一版寫的「六片雞霸免運」站上已經查不到
   * 「六片」這個說法了，所以換成真的那兩項。
   */
  ship: ["7-11 店到店 $60", "滿 NT$1,199 免運"],
  art: cutletDog,
  alt: "實拍：一隻黑色米克斯犬叼著一整片大塊的雞肉乾",
  caption: "嚎大大・雞霸｜台灣在地・小量製作",
} as const;

/* ---------------- 盤面：中央一鍋 ---------------- */

/**
 * 中央那一鍋。
 *
 * 這一版的鍋不是圓的，是壓扁的橢圓。量法是在鍋緣外側挑乾淨的角度打探針
 * （「往外連續 12–14px 都是橘底」才算邊），把標題、七張牌、膠囊與夾子的框
 * 全部先排除，收到 25 個手工對過的邊界點，再做最小平方擬合：
 *   橢圓 鍋心 (784.3, 497.4)px、rx 396.8、ry 359.4 → rms 1.84px
 *   正圓 同一組點                               → rms 3.93px
 * 所以是橢圓，扁率 ry/rx = 0.9057。換算成盤面的百分比就是下面四個數。
 *
 * 鍋緣由外往內是五層，界線用「半軸的比例 t」表示，是把鍋緣展成長條量的：
 *   白邊    t 0.941–1.001  rgb(251,252,252)
 *   刻度圈  t 0.850–0.935  rgb(194,190,189)
 *   白溝    t 0.798–0.854  rgb(249,250,252)
 *   灰鍋壁  t 0.734–0.772  rgb(196,192,190)
 *   鍋裡    t < 0.734
 * 刻度是 66 格：在三段沒被貨與夾子壓到的弧上量「20 個間隔跨多少度」
 * （總共 108.850°，一格 5.4425°），360/66 = 5.4545 的殘差 0.0120，
 * 比 67 格與 68 格好一個數量級。灰的中位數 4.65°，佔比 0.853，起角 2.2°。
 *
 * 參考圖的鍋裡是畫出來的一整鍋乾貨：塞到鍋緣，而且同一種東西是聚在一區的
 * ——亮橘的纖維片佔左上、粉褐帶奶白紋的捲片在左、暗紅的大方丁擠在正上、
 * 奶白的凍乾方塊與柳葉魚在右、深褐的細條綁成一束放在正下。
 * 手上沒有任何一張實拍是一鍋混裝的乾貨，所以這一鍋是把去背的實拍照同一個分區
 * 疊出來的（見 scripts/make-cutouts.py 的 pack_pot）——肉乾、雞排、蘋果乾片、
 * 貓草雞肉乾、鴨肉丁、牛肉丁，全是真的商品照，只做了縮放與擺位，
 * 像素與顏色一個都沒改。片與片的縫會透出鍋底的深褐色，那個色是量參考圖鍋裡
 * 沒被貨蓋到的地方取的，rgb(70, 43, 34)。
 *
 * 參考圖裡有兩樣這邊湊不出來：奶白的凍乾方塊與那三條柳葉魚。站上沒有這兩樣的
 * 實拍（柳葉魚只在「鍋邊加點」留了品名），所以就是沒有——不找相似的頂替。
 * 這兩樣正好是參考圖裡最亮的東西，所以這一鍋比參考圖暗：參考圖鍋裡量到的平均
 * 亮度是 145，這一鍋是 106。手上所有去背素材的平均亮度都落在 75–111（全是
 * 深色的肉乾與肉丁），唯一夠亮的是蘋果乾片（164）。多鋪幾片蘋果能把數字拉上去，
 * 但鋪到七片以上整鍋就讀成一碗蘋果了——寧可暗一點，也不要讓一樣配料蓋掉
 * 其他真的商品。
 */
export const POT = {
  /** 鍋心與鍋寬，盤面寬的百分比；ratio 是鍋高除以鍋寬。 */
  x: 49.2,
  y: 50.39,
  w: 49.79,
  ratio: 0.9057,
  art: potFill,
  alt: "一鍋混裝的乾貨實拍：肉乾、雞肉乾、蘋果乾片、貓草雞肉乾、鴨肉丁與牛肉丁凍乾塞滿整個鍋子",
  /**
   * 參考圖的鍋緣趴著一隻畫出來的柴犬，兩隻前腳搭在鍋緣上，舌頭伸出來。
   * 用「夠暗又夠不彩」切出來的黑色輪廓量到 x 417–580（寬 164px、10.29%W）、
   * y 108–309，中線 31.27%W、頭頂 10.94%H。
   *
   * 那一隻不重畫、也不生成——同一個座標換成專案原本就有的去背實拍。
   * 實拍是一整隻坐著的狗，頭只佔圖寬的 0.57、中心偏右 0.628，
   * 所以 x 放的是整張圖的中線，y 量的是頭頂而不是身體中心，
   * 狗才不會被盤面的上緣切掉。
   */
  peek: {
    art: peekDog,
    alt: "實拍去背：一隻黑色的台灣犬坐在一袋嚎大大雞排旁邊",
    x: 31.27,
    y: 10.94,
    w: 13.5,
  },
} as const;

/* ---------------- 盤面：四周的七只分類碟 ---------------- */

/**
 * 碟色。七只碟子不是同一個淺灰重複用，是量過的六種：
 * 淺灰 rgb(226,230,234)、青 rgb(127,178,182)、灰白 rgb(238,238,235)、
 * 寶藍 rgb(47,113,192)、淡灰綠 rgb(231,236,235)，另外兩只是黑鍋
 * rgb(30,25,20) 與 rgb(30,27,28)。
 */
export type CoverTone = "pale" | "teal" | "paper" | "blue" | "mist" | "pan";

export type Cover = {
  /** 牌上印的字。 */
  label: string;
  /** furmosa.com 上那個分類的全名。牌上的字一定是它的一段，無障礙名用全名。 */
  title: string;
  href: string;
  art: StaticImageData;
  alt: string;
  tone: CoverTone;
  /**
   * photo：整張商品照裁進圓裡，往內縮一點讓碟色露出一圈。
   * cut：去背的素材壓在碟面上、不裁進橢圓裡，會溢出碟緣——參考圖就是這樣。
   */
  fit: "photo" | "cut";
  /**
   * fit 是 cut 時，素材寬度除以碟寬。目標是寬度 0.98、高度 0.95，
   * 取兩者算出來較小的那一個：
   *   cut = min(0.98, 0.95 × 素材長寬比 × 碟高比)
   * 每一碟的素材長寬比都不同，所以值也都不同。
   */
  cut?: number;
  /** 素材在碟面上往上或往下挪一點，碟高的百分比。 */
  cutY?: number;
  /** 碟心座標與碟寬，盤面寬的百分比。 */
  x: number;
  y: number;
  w: number;
  /** 碟高除以碟寬（像素比）。每只碟子的壓扁程度都不一樣，所以一碟一個值。 */
  ratio: number;
  /**
   * 牌的定位。參考圖的牌不是掛在碟子上，是各有自己的座標：
   * 左半邊的碟子牌往右長（指回鍋子），右上兩只往左長，右下兩只往右長。
   * 所以 side 指的是「牌用哪一邊對位」，at 是那一邊離盤面邊界的百分比，
   * top 是牌的上緣。
   */
  tag: { side: "left" | "right"; at: number; top: number };
};

/*
 * 七只碟子，全部量自參考圖（1594×987）。
 *
 * 碟子是橢圓，而且上面都壓著貨，所以用目測抓不準。量法是：先用碟色的容差
 * 遮罩挑出碟面露出來的部分，從已知的碟心往外長連通塊（避免吃到隔壁），
 * 取每一列與每一欄的左右／上下極值當邊界點、落在搜尋框邊上的點一律丟掉，
 * 再用 soft_l1 做最小平方擬合一個正置橢圓——貨壓出來的假邊界會被當成
 * 離群值。擬合完的七個橢圓畫回參考圖上逐一對過。
 *
 *   位置   碟心 x/y        碟寬    碟高/碟寬   像素 碟心/rx/ry
 *   ----   -------------   -----   ---------   --------------------------
 *   左上   13.41 / 19.66   16.64   0.956       ( 213.7, 194.0) 132.7 126.8
 *   右上   78.55 / 18.93   15.45   0.986       (1252.0, 186.9) 123.2 121.4
 *   右中上 90.71 / 36.12   14.76   0.897       (1445.9, 356.5) 117.7 105.5
 *   左中   10.45 / 44.28   16.45   0.772       ( 166.6, 437.0) 131.1 101.3
 *   右中   85.00 / 54.99   17.30   0.690       (1354.8, 542.8) 137.9  95.1
 *   左下   12.11 / 65.54   17.37   0.764       ( 193.0, 646.9) 138.4 105.8
 *   右下   82.46 / 75.60   15.53   0.819       (1314.4, 746.2) 123.8 101.3
 *
 * 牌也是逐一量的（像素）：
 *   左上 287–407 × 246–299　右上 1098–1219 × 204–253
 *   右中上 1193–1362 × 355–405　左中 255–436 × 456–505
 *   左下 244–427 × 704–753　右中 1356–1543 × 594–644
 *   右下 1392–1548 × 771–820
 * 字高 30–31px、牌高 50–54px、左右內距約 16px、最小寬約 121px。
 * 牌本身是跟著字長的，所以字數不同寬度就不同——參考圖也是這樣
 * （兩個字的牌 121px、五個字的牌 188px）。
 *
 * ---- 哪一張照片配到哪一只碟子 ----
 *
 * 參考圖的七只碟子裡有四只放的本來就是 furmosa.com 的商品照（雞霸的謝謝紙袋、
 * 雞肉丁凍乾的疊疊樂、兔用大便盆、KALI 藤編碗），那四只照片留在原位，
 * 只把牌上的字換成那張照片真正所屬的分類。
 * 剩下三只參考圖放的是肉乾與小魚，跟牌上的「玩具」「清潔」對不上，
 * 所以換成那兩類裡真的商品照（KONG 幼犬玩具、三支 Earthbath 洗毛精），
 * 小魚那一只站上沒有，換成貓咪類裡的草上飛貓草雞肉乾。
 *
 * 七個分類都用 collections/<handle>/products.json 對過，
 * 確認每一張照片的商品真的在那個分類裡面。
 */
export const COVERS: Cover[] = [
  {
    label: "零食與凍乾",
    title: "寵物零食與凍乾",
    href: `${SHOP_ORIGIN}/collections/${encodeURIComponent("寵物零食與凍乾")}`,
    art: cutletBag,
    alt: "實拍：一整片嚎大大雞霸插在印著 thank you very much 的白色紙袋裡",
    /* 背景本來就是一片近白的棚景，裁成圓之後那片白就是碟面——參考圖這一只就是這樣。 */
    fit: "photo",
    tone: "pale",
    x: 13.41,
    y: 19.66,
    w: 16.64,
    ratio: 0.956,
    tag: { side: "left", at: 18.01, top: 24.92 },
  },
  {
    label: "狗狗",
    title: "狗狗",
    href: `${SHOP_ORIGIN}/collections/${encodeURIComponent("狗狗")}`,
    art: cubesTower,
    alt: "實拍：頂真做雞肉丁凍乾疊成一座疊疊樂，底下是深色的烤網",
    /* 原圖的背板是青的，跟量到的青碟色同一個調，所以直接裁圓當碟面。 */
    fit: "photo",
    tone: "teal",
    x: 78.55,
    y: 18.93,
    w: 15.45,
    ratio: 0.986,
    tag: { side: "right", at: 23.53, top: 20.67 },
  },
  {
    label: "小動物",
    title: "小動物共用",
    href: `${SHOP_ORIGIN}/collections/${encodeURIComponent("小動物共用")}`,
    art: rabbitTray,
    alt: "實拍：一只奶白色的兔用大便盆，盆內是可拆的網格底板",
    /*
     * 這一張試過去背：邊框的灰是漸層（171→231），用二次曲面擬合是量得出來的
     * （邊框殘差中位數 5.1），但盆子受光的那幾面量到 (224,223,219)，
     * 跟擬合出來的背景同色，一挖就連盆面一起咬掉；形態學補回來又會把
     * 大塊背景一起拉進來，比不挖更糟。
     * 所以這一只是裁圓的照片——照片自己那片柔灰就是碟面。
     * 跟參考圖唯一的差別是盆子不會溢出碟緣。
     */
    fit: "photo",
    tone: "paper",
    x: 90.71,
    y: 36.12,
    w: 14.76,
    ratio: 0.897,
    tag: { side: "right", at: 14.55, top: 35.97 },
  },
  {
    label: "玩具與互動",
    title: "寵物玩具與互動",
    href: `${SHOP_ORIGIN}/collections/${encodeURIComponent("寵物玩具與互動")}`,
    art: kongToys,
    alt: "實拍去背：一只水藍與一只粉紅的 KONG Puppy 幼犬玩具並排站著",
    fit: "cut",
    /* 素材 687×596（長寬比 1.153），碟高比 0.772 → 0.95 × 1.153 × 0.772 = 0.85。 */
    cut: 0.85,
    tone: "pan",
    x: 10.45,
    y: 44.28,
    w: 16.45,
    ratio: 0.772,
    tag: { side: "left", at: 16.0, top: 46.2 },
  },
  {
    label: "餐具與收納",
    title: "寵物餐具與收納",
    href: `${SHOP_ORIGIN}/collections/${encodeURIComponent("寵物餐具與收納")}`,
    art: wovenBowl,
    alt: "實拍去背：KALI 回收藤編外圈搭深綠釉內裡的寵物碗",
    fit: "cut",
    /* 素材 1056×837（長寬比 1.262），碟高比 0.764 → 0.95 × 1.262 × 0.764 = 0.92。 */
    cut: 0.92,
    tone: "blue",
    x: 12.11,
    y: 65.54,
    w: 17.37,
    ratio: 0.764,
    tag: { side: "left", at: 15.31, top: 71.33 },
  },
  {
    label: "清潔與洗護",
    title: "寵物清潔與洗護",
    href: `${SHOP_ORIGIN}/collections/${encodeURIComponent("寵物清潔與洗護")}`,
    art: shampooRow,
    alt: "實拍去背：三支 Earthbath 473ml 洗毛精與潤絲精並排站著",
    fit: "cut",
    /*
     * 這一只是七只裡最扁的（0.690），但這一類的商品照全是立起來的瓶子。
     * 一支放上去只蓋到四分之一，所以排三支（見 make-cutouts.py 的 pack_shampoo），
     * 整組的長寬比變成 1.45 → 0.95 × 1.45 × 0.690 = 0.95，瓶肩會高過碟緣。
     */
    cut: 0.95,
    tone: "pan",
    x: 85.0,
    y: 54.99,
    w: 17.3,
    ratio: 0.69,
    tag: { side: "left", at: 85.07, top: 60.18 },
  },
  {
    label: "貓咪",
    title: "貓咪",
    href: `${SHOP_ORIGIN}/collections/${encodeURIComponent("貓咪")}`,
    art: catGrass,
    alt: "實拍去背：一片台灣形狀的草上飛貓草雞肉乾，表面撒著貓草碎",
    fit: "cut",
    /* 素材 320×295（長寬比 1.085），碟高比 0.819 → 0.95 × 1.085 × 0.819 = 0.84。 */
    cut: 0.84,
    tone: "mist",
    x: 82.46,
    y: 75.6,
    w: 15.53,
    ratio: 0.819,
    tag: { side: "left", at: 87.33, top: 78.12 },
  },
];

/**
 * 海報上只排得下七只碟子，但 furmosa.com 上有十四個分類。
 * 剩下的那幾個不會因為排不進盤面就不存在，所以接在「鍋邊加點」那一段後面，
 * 排成一列字。商品數不寫——那是會變的，寫了就是在編。
 */
export const MORE_COLLECTIONS: NavItem[] = [
  "兔兔",
  "小動物生活用品",
  "犬貓主食與營養",
  "犬用照護與衛生",
  "寵物口腔照護",
  "特殊與客製商品",
].map((name) => ({
  label: name,
  href: `${SHOP_ORIGIN}/collections/${encodeURIComponent(name)}`,
  external: true,
}));

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
  /* 參考圖只有八只碟子，所以再來一包從盤面上收到這裡，連結本身不變。 */
  { label: "再來一包", href: rowHref(5), external: true },
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
