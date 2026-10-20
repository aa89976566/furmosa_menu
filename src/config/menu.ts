import type { StaticImageData } from "next/image";

import canning from "@/assets/poster/canning.jpg";
import cubesTower from "@/assets/poster/cubes-tower.jpg";
import cutletBag from "@/assets/poster/cutlet-bag.jpg";
import rabbitTray from "@/assets/poster/rabbit-tray.jpg";
import catGrass from "@/assets/poster/cutout/cat-grass.webp";
import kongToys from "@/assets/poster/cutout/kong-toys.webp";
import shampooRow from "@/assets/poster/cutout/shampoo-row.webp";
import wovenBowl from "@/assets/poster/cutout/woven-bowl.webp";

/**
 * 餐桌上八只菜盤對到哪一個 Shopify collection——整頁只有這一份對照表。
 * 要加、要改、要換 handle 都只動這個檔，元件與 API 都從這裡讀。
 *
 * handle 全部用 `collections.json` 對過，店上真的存在。有幾件事先說清楚：
 *
 * 一、肉乾與凍乾在店上是同一個 collection。
 *     「寵物零食與凍乾」裡 24 件，店上沒有再切成兩個 collection。但兩邊分得
 *     很乾淨：品名帶「凍乾」的 16 件（QiQi 八件加 ◈…◈ 八件），不帶的 8 件
 *     （雞霸、鴨喉、豬耳朵片、豬耳朵條、鴨翅、豬蛋蛋肉乾、牛肉地瓜、
 *     貓草雞肉乾薄片）。16 + 8 剛好是 24，沒有漏也沒有重複，所以這裡用
 *     品名含不含「凍乾」來切，兩只盤子各自指同一個 handle 加一個 filter。
 *     這不是猜的分類，是照品名切，店上改了品名這裡就跟著變，不會騙人。
 *
 * 二、換罐補給在店上沒有商品。
 *     查過 `換罐`、`罐`、`jar`、`tag:換罐` 都是零筆，全站 48 件裡沒有一件
 *     標成換罐補給。所以這一只盤子的 collection 是 null——盤面照常點得開，
 *     但中央不會憑空生出商品，而是照實說「站上還沒有可補給的商品」並連到
 *     換罐計畫那一頁。寧可盤子是空的，也不要放假商品。
 *
 * 三、兔鼠日常店上只有兩件（兔用大便盆、化毛膏擠壓器），其中一件缺貨。
 *     盤子照放，中央就顯示那一件真的有的。
 */

/** 店的網域。所有連到店上的網址都從這裡接，不要散在各處寫死。 */
export const SHOP_ORIGIN = "https://furmosa.com";

export const collectionUrl = (handle: string) =>
  `${SHOP_ORIGIN}/collections/${encodeURIComponent(handle)}`;

/**
 * 從一個 collection 裡再切出一半時用的規則。
 * 只能照品名切，不要照「我覺得這件屬於哪一類」切。
 */
export type ProductFilter = {
  /** 品名要含這個字才留。 */
  titleIncludes?: string;
  /** 品名含這個字就不留。 */
  titleExcludes?: string;
};

export type MenuCategory = {
  /** 程式內部用的代號，也是 URL 上的 hash。 */
  id: string;
  /** 盤子上那塊牌寫的字。 */
  label: string;
  /** 中央大盤的一句話。只寫店上查得到的事。 */
  blurb: string;
  /**
   * 對應的 Shopify collection handle。null 表示店上還沒有這一類的商品，
   * 中央大盤會照實說，不會拿別類的商品來填。
   */
  collection: string | null;
  /** collection 裡還要再切一刀時的規則。 */
  filter?: ProductFilter;
  /** 「查看全部」連去哪。沒有 collection 的那一只連到說明頁。 */
  href: string;
  /** 盤面上那張圖。全部是 furmosa.com 上真的商品照（或品牌實拍）。 */
  art: StaticImageData;
  alt: string;
  /** 盤底的顏色。盤子比照片大，露出來的那一圈就是這個色。 */
  tone: "pale" | "teal" | "paper" | "blue" | "mist" | "pan" | "cream";
  /** 照片是整張裁進圓裡（photo），還是去背後浮在盤面上（cut）。 */
  fit: "photo" | "cut";
  /** fit 是 cut 時，去背圖佔盤寬的比例。 */
  cut?: number;
};

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "jerky",
    label: "肉乾",
    blurb: "雞霸、鴨喉、豬耳朵條、鴨翅——整片烘出來的，咬得到纖維。",
    collection: "寵物零食與凍乾",
    filter: { titleExcludes: "凍乾" },
    href: collectionUrl("寵物零食與凍乾"),
    art: cutletBag,
    alt: "實拍：一整片嚎大大雞霸插在印著 thank you very much 的白色紙袋裡",
    tone: "pale",
    fit: "photo",
  },
  {
    id: "freeze-dried",
    label: "凍乾",
    blurb: "QiQi 的雞肉與魚類凍乾，加上匠寵自己那幾款 ◈ 系列。",
    collection: "寵物零食與凍乾",
    filter: { titleIncludes: "凍乾" },
    href: collectionUrl("寵物零食與凍乾"),
    art: cubesTower,
    alt: "實拍：頂真做雞肉丁凍乾疊成一座塔，底下散著幾塊",
    tone: "teal",
    fit: "photo",
  },
  {
    id: "small-pets",
    label: "兔鼠日常",
    blurb: "兔子與天竺鼠的便盆、飲水與收納。店上目前只有兩件。",
    collection: "小動物生活用品",
    href: collectionUrl("小動物生活用品"),
    art: rabbitTray,
    alt: "實拍：白色的兔用大便盆，盆底是一片格狀的落料網",
    tone: "paper",
    fit: "photo",
  },
  {
    id: "tableware",
    label: "餐具與居家",
    blurb: "KALI 回收藤編狗碗。手工藤編，預購。",
    collection: "寵物餐具與收納",
    href: collectionUrl("寵物餐具與收納"),
    art: wovenBowl,
    alt: "實拍：KALI 回收藤編狗碗，綠黑色的碗身嵌在藤編底座裡",
    tone: "blue",
    fit: "cut",
    cut: 0.92,
  },
  {
    id: "grooming",
    label: "清潔與照護",
    blurb: "Earthbath 的洗毛精與潤絲、KONG 除毛刷、耳部濕紙巾。",
    collection: "寵物清潔與洗護",
    href: collectionUrl("寵物清潔與洗護"),
    art: shampooRow,
    alt: "實拍：三支 Earthbath 473ml 洗毛精排成一列",
    tone: "pan",
    fit: "cut",
    cut: 0.95,
  },
  {
    id: "toys",
    label: "玩具與互動",
    blurb: "KONG Puppy 幼犬藏食玩具。店上目前只有這一件。",
    collection: "寵物玩具與互動",
    href: collectionUrl("寵物玩具與互動"),
    art: kongToys,
    alt: "實拍：粉紅與水藍的 KONG 幼犬玩具",
    tone: "pan",
    fit: "cut",
    cut: 0.85,
  },
  {
    id: "cats",
    label: "貓咪日常",
    blurb: "貓主食罐與貓糧，加上貓也吃的那幾款凍乾與肉乾。",
    collection: "貓咪",
    href: collectionUrl("貓咪"),
    art: catGrass,
    alt: "實拍：草上飛貓草雞肉乾薄片擺在白盤上",
    tone: "mist",
    fit: "cut",
    cut: 0.84,
  },
  {
    id: "refill",
    label: "換罐補給",
    /* 這兩個價是換罐計畫那一頁上真的寫的，不是我填的。 */
    blurb: "首罐 NT$129，空罐帶回 NT$99。下一罐，在合作店家的櫃檯換。",
    collection: null,
    href: `${SHOP_ORIGIN}/pages/partner`,
    art: canning,
    alt: "實拍：印著 FURMOSA 匠寵的回收鐵罐正在裝肉乾",
    tone: "cream",
    fit: "photo",
  },
];

/** 中央大盤的起始狀態：不選任何分類時顯示全店。 */
export const ALL_PRODUCTS = {
  id: "all",
  label: "全部商品",
  blurb: "台灣在地、小量製作。整間店都在這裡。",
  href: collectionUrl("all"),
} as const;

/** 中央大盤最多擺幾個商品。參考圖的盤子上就是三份。 */
export const FEATURED_LIMIT = 3;
