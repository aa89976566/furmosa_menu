import type { StaticImageData } from "next/image";

import beefCubes from "@/assets/poster/beef-cubes-loading.jpg";
import charityMooncake from "@/assets/poster/charity-mooncake.jpg";
/* 頭條是去背的，透明處會透出紙色，所以存成帶 alpha 的 webp。 */
import dogCutletCutout from "@/assets/poster/dog-cutlet-cutout.webp";
/*
 * 延伸七帶的第二張照片取自各個活動頁（drop）自己的圖，裁成正方：
 * 那七帶的照片格實測是 288×282，照原比例放進去只會被切掉主體。
 * 退下來的那幾張（洗毛精、黑糖、白貓、照片牆、綜合肉乾）還留在
 * src/assets/poster/，要換回來不必動版面。
 */
import dropAllFriesCup from "@/assets/poster/drop-all-fries-cup.jpg";
import dropBowlYellow from "@/assets/poster/drop-bowl-yellow.jpg";
import dropCardShiba from "@/assets/poster/drop-card-shiba.jpg";
import dropCatCatgrass from "@/assets/poster/drop-cat-catgrass.jpg";
import dropCutletDog from "@/assets/poster/drop-cutlet-dog.jpg";
import dropMoonPacks from "@/assets/poster/drop-moon-packs.jpg";
import dropPartnerPigear from "@/assets/poster/drop-partner-pigear.jpg";
/*
 * 延伸七帶的第一張照片是那一頁的 hero 圖——那一頁最上面那張主視覺的
 * 原始檔（og:image、首圖或影片封面），不是網頁截圖，所以報紙上登的是
 * 那一頁自己拿來當門面的照片，一律裁成正方。
 *
 * 兩頁沒有 hero 圖，取那一頁的第一張圖代替（紙背的「網頁」列有註記）：
 * 全部商品頁的 hero 位置是「給牠的愛」標題加商品格，所以取架上第一格；
 * 店家合作頁的門面是牛皮紙信箋，是 CSS 疊出來的，所以取目錄第一項。
 */
import heroAll from "@/assets/poster/hero-01-all.webp";
import heroBowl from "@/assets/poster/hero-06-bowl.webp";
import heroCard from "@/assets/poster/hero-05-card.webp";
import heroCat from "@/assets/poster/hero-04-cat.webp";
/* 雞霸那一帶的 hero 來自 /haodada 的獨立頁，不是 furmosa.com 的商品頁。 */
import heroCutlet from "@/assets/poster/hero-02-cutlet.webp";
import heroMoon from "@/assets/poster/hero-03-moon.webp";
import heroPartner from "@/assets/poster/hero-07-partner.webp";
/* 製程三連拍是情境示意圖，官網沒有製程照（紙背有註記）。 */
import processDry from "@/assets/poster/process-03-dry.jpg";
import processPaste from "@/assets/poster/process-02-paste.jpg";
import processWash from "@/assets/poster/process-01-wash.jpg";
/* 直幅版的小輝；橫幅的那一張還留著給 /mooncake 用。 */
import strayDog from "@/assets/poster/stray-dog-siaohuei-tall.jpg";
/* 延伸七帶的連結就是首頁那份編號清單的網址，維持單一真實來源。 */
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
    /** 延伸七帶是直書，放不下的拉丁字與確切價格收在這裡。 */
    {
      label: "本期",
      value:
        "洗護補上 Earthbath 系列八支（473ml）・Kali 回收藤編狗碗四款預購中（17–26cm）・品項、價格與活動期間以 furmosa.com 為準",
    },
    /*
     * 延伸七帶登的就是這七個網頁。頁名與網址是橫書，拉丁字在這裡才站得直，
     * 所以首頁寫作「chill嗨嗨ㄟ貓」的那一頁在正面只排得下「嗨嗨ㄟ貓」。
     */
    {
      label: "網頁",
      value:
        "① 全部商品 furmosa.com/collections/all（無 hero 圖，取架上第一格）・② 嚎大大雞霸 /haodada → aa89976566.github.io/haodada ・③ 浪浪交易所｜中秋限定盤 them-stock-moon.furmosa.com ・④ chill嗨嗨ㄟ貓 catnip-chick.furmosa.com（hero 影片封面）・⑤ 再來一包｜毛孩人格抽驗 furmosa-one-more-street ・⑥ 預購！背景很硬的碗 furmosa.com/pages/found-object-001 ・⑦ 店家合作 furmosa.com/pages/partner（門面為 CSS 牛皮紙信箋，取目錄第一項）",
    },
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
  /** 有活動頁的那幾帶，標籤本身就是連結（報紙的欄名本身可點）。 */
  href?: string;
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
 * 延伸的七帶：首頁那份編號清單的每一列，在報紙上就是往下接的一條帶。
 *
 * 一帶登的就是那一個網頁，所以標籤用那一頁自己的名字（長的照首頁的「｜」
 * 拆成主標與副標），第一張照片是那一頁的 hero 圖，第二張是那一頁在賣的
 * 東西——報導要登那一頁自己的門面，也要看得到產品。
 *
 * 編排與上面四帶完全同一套——照片｜照片｜直書本文｜黃色標籤——所以字數
 * 的算法也一樣：帶高 274fr（約 282 像素）÷ 本文字級 ＝ 一行九字，
 * 字塊寬放得下七行，上限六十三字；寫到第七行，帶裡才不留空白紙。
 * 直書排不了阿拉伯數字，數字一律寫成中文數字（確切數字與拉丁字留在紙背
 * 的規格欄，那裡是橫書）。
 *
 * 標籤也有同一套上限：一欄的長度＝帶高÷字級，所以主標最多七字、
 * 副標（主標的 0.68 倍）最多十字。超過就會折成第三欄，把照片擠窄一截。
 * 拉丁字在直書裡會躺著讀，所以 chill 這種字只留在紙背的橫書欄位。
 */
const DROP_HREFS = new Map(
  WORKS_ROWS.flatMap((row) =>
    row.kind === "link" ? [[row.index, row.href] as const] : [],
  ),
);

/*
 * 七列的網址照首頁原樣用，相對路徑也照用：第二列的 /haodada 不是壞連結，
 * next.config.ts 把它改寫到 aa89976566.github.io/haodada（雞霸的獨立頁），
 * 所以在這個站台裡點得開。
 */
function dropHref(index: number): string | undefined {
  return DROP_HREFS.get(index);
}

export const DROPS: Chapter[] = [
  {
    id: "drop-all",
    index: "05",
    /** 首頁 #1。 */
    tag: ["全部商品", "狗貓兔與小動物"],
    lines: [
      "不只做零食，更像一",
      "間為毛孩挑選好物的",
      "選品店。架上分成狗",
      "狗、貓咪、兔兔與小",
      "動物，從肉乾、凍乾",
      "一路排到洗護，一樣",
      "一樣慢慢挑。",
    ],
    photos: [
      {
        image: heroAll,
        alt: "全部商品頁架上第一格：Earthbath 2 合 1 芒果探戈洗毛精 473ml",
      },
      {
        image: dropAllFriesCup,
        alt: "薯條杯裝的雞肉乾條，杯身印著匠寵的腳印",
      },
    ],
    media: "pair",
    href: dropHref(1),
  },
  {
    id: "drop-cutlet",
    index: "06",
    /** 首頁 #2。副標是那一頁自己的那句介紹。 */
    tag: ["嚎大大雞霸", "夜市雞排靈感設計"],
    lines: [
      "雞霸這片：大片雞排",
      "拆開就給，剪成小段",
      "依體型調整份量。純",
      "雞肉做的，不添加香",
      "料、色素與防腐劑，",
      "零食之外主食與水也",
      "要備著。",
    ],
    photos: [
      {
        image: heroCutlet,
        alt: "雞霸頁的 hero 圖：一台「嚎大大雞排 食品資訊」印表機，六個工站從絞肉製泥排到低溫烘乾",
      },
      {
        image: dropCutletDog,
        alt: "黑狗叼著一片大雞排，身前是印著 Thank you very much 的匠寵紙袋",
      },
    ],
    media: "pair",
    href: dropHref(2),
  },
  {
    id: "drop-moon",
    index: "07",
    /** 首頁 #3，長欄名照「｜」拆成主標與副標。 */
    tag: ["浪浪交易所", "中秋限定盤"],
    lines: [
      "七個包裝對應七隻等",
      "家的狗狗，每售出一",
      "顆月餅，匠寵提撥十",
      "元給浪犬之家。盤子",
      "收了，狗狗的尋家故",
      "事還在繼續，照片裡",
      "的七隻都還在等。",
    ],
    photos: [
      {
        image: heroMoon,
        alt: "浪浪交易所的 hero 圖：小輝的正面大頭照，穿著橘色背心在街上張嘴笑",
      },
      {
        image: dropMoonPacks,
        alt: "「牠的月餅」月餅包裝盒，盒上印著一隻等家的黑白狗狗",
      },
    ],
    media: "pair",
    href: dropHref(3),
  },
  {
    id: "drop-cat",
    index: "08",
    /** 首頁 #4。拉丁字的 chill 排不進直書，留在紙背。 */
    tag: ["嗨嗨ㄟ貓", "一臉不屑一口淪陷"],
    lines: [
      "這一欄留給貓咪。草",
      "上飛・貓草雞肉乾薄",
      "片，貓草配雞肉，薄",
      "得好分食；活動頁抽",
      "一張貓格給你，說的",
      "就是家裡那位嘴硬的",
      "那一隻。",
    ],
    photos: [
      {
        image: heroCat,
        alt: "嗨嗨ㄟ貓活動頁的 hero 影片封面：一隻長毛貓側躺在綠色地磚上",
      },
      {
        image: dropCatCatgrass,
        alt: "草上飛・貓草雞肉乾薄片的活動主視覺：一片雞肉乾浮在星空上",
      },
    ],
    media: "pair",
    href: dropHref(4),
  },
  {
    id: "drop-card",
    index: "09",
    /** 首頁 #5，長欄名照「｜」拆成主標與副標。 */
    tag: ["再來一包", "毛孩人格抽驗"],
    lines: [
      "每一包裡都有一張卡",
      "牌，卡上是和自家毛",
      "孩同品種的那一位。",
      "拿卡跟牠拍一張、加",
      "官方帳號，就再領一",
      "包同樣的零食。照片",
      "牆上還有別人家的。",
    ],
    photos: [
      {
        image: heroCard,
        alt: "再來一包活動頁的 hero 圖：台灣巷口的毛孩街坊，背包小狗與兩隻貓在廟前走過",
      },
      {
        image: dropCardShiba,
        alt: "一隻柴犬坐在路邊，鏡頭前舉著一張畫著柴犬的卡牌",
      },
    ],
    media: "pair",
    href: dropHref(5),
  },
  {
    id: "drop-bowl",
    index: "10",
    /** 首頁 #6。 */
    tag: ["背景很硬的碗", "預購中"],
    lines: [
      "印尼匠人用回收藤編",
      "做的狗碗，綠黑與黃",
      "色兩色，尺寸從十七",
      "公分到二十六公分共",
      "四款，現正預購。藤",
      "是回收的，碗是一只",
      "一只手編的。",
    ],
    photos: [
      {
        image: heroBowl,
        alt: "背景很硬的碗預購頁的 hero 圖：綠黑款回收藤編狗碗的四十五度角",
      },
      {
        image: dropBowlYellow,
        alt: "同一款碗的黃色版本，碗身是原色藤編、碗內上黃釉",
      },
    ],
    media: "pair",
    href: dropHref(6),
  },
  {
    id: "drop-partner",
    index: "11",
    /** 首頁 #7。 */
    tag: ["店家合作", "五十組起訂"],
    lines: [
      "給台灣寵物店家的一",
      "份清單：肉乾與凍乾",
      "共十八項，五十組起",
      "訂。寄賣先放店裡三",
      "十天後結算，或由店",
      "家直接進貨，建議售",
      "價與官網同步。",
    ],
    photos: [
      {
        image: heroPartner,
        alt: "店家合作頁目錄第一項：一堆切成片的雞肉乾",
      },
      {
        image: dropPartnerPigear,
        alt: "一整片豬耳朵零食，旁邊寫著「今天乖乖嗎？」",
      },
    ],
    media: "pair",
    href: dropHref(7),
  },
];

export const CLOSING = {
  title: "不知道先點哪一道",
  slogan: RAIL_SLOGAN,
  body: "幾題小測驗，幫你挑選零食組合，找到牠的零食路線。看照片、挑規格，喜歡的勾一份，就進購物車。中秋尋家合作計畫已結單，七隻狗狗仍在等家。",
  cta: "看本期好物",
} as const;
