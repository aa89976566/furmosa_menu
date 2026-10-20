import type { StaticImageData } from "next/image";

import beefMound from "@/assets/poster/cutout/beef-mound.webp";
import crystalFish from "@/assets/menu/crystal-fish.webp";
import cubesTower from "@/assets/poster/cubes-tower.jpg";
import cutletBag from "@/assets/poster/cutlet-bag.jpg";
import duckThroats from "@/assets/menu/duck-throats.webp";
import mixedBowl from "@/assets/poster/drop-partner-mixed.jpg";
import pigEarCup from "@/assets/poster/drop-all-fries-cup.jpg";
import vegCubes from "@/assets/menu/veg-cubes.webp";

import { collectionUrl, productUrl } from "./shop";

/**
 * 餐桌上八只菜盤。整頁只有這一份資料——盤面、中央那句話、連去哪，
 * 全部從這裡讀，元件裡一個字串都不寫。
 *
 * osText 是狗的內心話，不是文案也不是商品描述。語氣是乾的、台灣日常的，
 * 有一點白目。中央那塊只放三件事：分類名、這一句、還有一個「查看商品 →」。
 *
 * 圖全部是 furmosa.com 上真的商品照，沒有一張是生成的、也沒有重畫。
 * 刻意避開店上那幾張帶字或帶狗剪影的版本（鴨翅的「今天乖乖嗎？」、
 * 牛肉丁的 LOADING 圖），因為縮進圓裡會變成雜訊，不是因為它們不好。
 *
 * 三件跟店上實際情況不一樣、需要知道的事：
 *
 * 一、「水晶魚／柳葉魚」的柳葉魚店上沒有。海味仔系列現在是水晶魚凍乾與
 *     丁香魚凍乾兩款，所以這一只連到水晶魚凍乾。標籤照需求寫，但如果柳葉魚
 *     還沒上架，label 要改成「水晶魚／丁香魚」才對得上。
 *
 * 二、「鴨翅／鴨喉」店上是兩個商品（走敢若飛鴨翅、唐老鴨喉）。盤面放的是
 *     鴨喉那張（鴨翅自己的照片帶字與狗剪影），連結也跟著指鴨喉，圖與連結
 *     才一致。要讓鴨翅也進得去就得改成連 collection。
 *
 * 三、「自選組合」店上沒有可以自己挑的組合商品。現有的兩個組合
 *     （萬聖節限定組合、毛孩海陸三鮮凍乾組）都是固定內容，點進去不能自選，
 *     所以這一只連到全部商品，讓人真的自己挑。
 */
export type ShowcaseCategory = {
  /** 程式內部的代號，也是 DOM 上的 id。 */
  id: string;
  /** 盤子上那塊牌、以及中央大盤的標題。 */
  label: string;
  /** 中央大盤上那一句狗的內心話。 */
  osText: string;
  image: StaticImageData;
  /** 照片在講什麼。看不到圖的人靠這一句。 */
  alt: string;
  /** 點下去去哪。店上真的存在的商品頁或分類頁。 */
  productUrl: string;
  /** 照片是整張裁進圓裡（photo），還是去背後浮在盤面上（cut）。 */
  fit: "photo" | "cut";
  /** 盤底的顏色。盤子比照片大，露出來的那一圈就是這個色。 */
  tone: "pale" | "teal" | "paper" | "blue" | "mist" | "pan" | "cream";
  /** fit 是 cut 時，去背圖佔盤寬的比例。 */
  cut?: number;
};

export const SHOWCASE_CATEGORIES: ShowcaseCategory[] = [
  {
    id: "cutlet",
    label: "雞霸",
    osText: "我在等雞排",
    image: cutletBag,
    alt: "實拍：一整片嚎大大雞霸插在印著 thank you very much 的白色紙袋裡",
    productUrl: productUrl("chicken-fillet"),
    fit: "photo",
    tone: "cream",
  },
  {
    id: "pig-ear-strips",
    label: "豬耳朵條",
    osText: "這個咬完 我就不拆紙箱",
    image: pigEarCup,
    alt: "實拍：豬耳朵條裝在印著腳印的紅黃紙盒裡，像一份薯條",
    productUrl: productUrl("耳條慢慢咬-豬耳朵條"),
    fit: "photo",
    tone: "paper",
  },
  {
    id: "chicken-cubes",
    label: "凍乾雞丁",
    osText: "倒進碗裡就好",
    image: cubesTower,
    alt: "實拍：頂真做雞肉丁凍乾疊成一座塔，底下散著幾塊",
    productUrl: productUrl("ding-zhen-zuo-ji-rou-ding-dong-gan"),
    fit: "photo",
    tone: "teal",
  },
  {
    id: "beef-cubes",
    label: "牛肉丁",
    osText: "肉可以多 飯先不用",
    image: beefMound,
    alt: "實拍：大力士牛肉丁凍乾，切面看得到纖維的深褐色方塊",
    productUrl: productUrl("da-li-shi-niu-rou-ding-dong-gan"),
    fit: "cut",
    tone: "pale",
    cut: 0.9,
  },
  {
    id: "duck",
    label: "鴨翅／鴨喉",
    osText: "有東西咬 大家都好過",
    image: duckThroats,
    alt: "實拍：唐老鴨喉幾條立在玻璃杯裡",
    productUrl: productUrl("tang-lao-ya-hou-zku85"),
    fit: "photo",
    tone: "mist",
  },
  {
    id: "small-fish",
    label: "水晶魚／柳葉魚",
    osText: "小小一條 續到你下班",
    image: crystalFish,
    alt: "實拍：海味仔水晶魚凍乾堆成一圈金黃色的小魚",
    productUrl: productUrl("海味仔-水晶魚凍乾"),
    fit: "cut",
    tone: "pan",
    cut: 0.92,
  },
  {
    id: "veg",
    label: "蔬果凍乾",
    osText: "菜我吃 肉另外加",
    image: vegCubes,
    alt: "實拍：青菜底加混蔬菜凍乾，橘、紫、綠的方塊散在白桌上",
    productUrl: productUrl("青菜底加-混蔬菜凍乾"),
    fit: "photo",
    tone: "pale",
  },
  {
    id: "mix",
    label: "自選組合",
    osText: "每包來一點 我自己選",
    image: mixedBowl,
    alt: "實拍：一只碗裡一半蘋果片一半牛肉丁凍乾，桌上散著幾塊",
    productUrl: collectionUrl("all"),
    fit: "photo",
    tone: "cream",
  },
];

/** 開頁預設亮哪一只。照需求是雞霸，也就是第一只。 */
export const DEFAULT_CATEGORY_ID = SHOWCASE_CATEGORIES[0].id;
