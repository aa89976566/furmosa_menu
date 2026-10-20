/**
 * 運費規則只住在這一份常數裡。免運門檻、運費、幾件才免運——
 * 元件一律從這裡讀，不准在 JSX 或 CSS 裡再寫一次數字。
 *
 * 每一條都標了出處。出處是「常見問題」那一頁與「換罐／KALI」商品頁上
 * 真的寫了的字；參考圖上那幾句（宅配 NT$120、六片雞霸免運、KALI 分開出貨
 * 你只付一次運費）站上查不到，所以沒有照抄。
 *
 * 但這一版照需求把「六片雞霸免運」與「KALI 另行出貨」兩條做成可切換的規則：
 * verified 為 false 的規則預設不顯示，等站上真的有這個規則、把 verified
 * 改成 true 就會跟著出現。數字與文案都在這裡，不用翻元件。
 */

export type Currency = "TWD";

/** 只有一個門檻，頂端那條進度與中央那條說明都讀這個值。 */
export type FreeShippingRule = {
  /** 滿多少免運。單位是元。 */
  threshold: number;
  currency: Currency;
  /** 還差多少時那條字怎麼寫。 */
  away: (remaining: string) => string;
  /** 已達免運時那條字怎麼寫。 */
  reached: string;
  source: string;
};

/** 一條固定顯示在中央大盤下面的運送資訊。 */
export type ShippingLine = {
  id: string;
  text: string;
  /**
   * false 表示這一條是參考圖上寫的、但站上查不到的規則。
   * 預設不顯示；等規則真的上線再改成 true。
   */
  verified: boolean;
  source: string;
};

/**
 * 看購物車內容才成立的提示。
 * match 回傳 true 時才顯示，所以數字不會寫死在元件裡。
 */
export type ConditionalNotice = {
  id: string;
  /** 達成時顯示的字。 */
  text: string;
  /** 沒達成時顯示的字。不給就不顯示。 */
  pending?: (left: number) => string;
  tone: "good" | "warn";
  verified: boolean;
  source: string;
};

export const shippingRules = {
  freeShipping: {
    threshold: 1199,
    currency: "TWD",
    away: (remaining) => `再買 ${remaining} 宅配免運`,
    reached: "已達宅配免運",
    source: "常見問題：全館單筆消費滿 NT$1,199 宅配免運",
  } satisfies FreeShippingRule,

  /** 中央大盤下面那一行，照順序排。 */
  lines: [
    {
      id: "seven-cutlet",
      text: "7-11 六片雞霸免運",
      /*
       * 站上查不到「六片雞霸免運」這個說法——常見問題寫的是
       * 7-11 店到店 $60，沒有雞霸滿件免運。所以預設不顯示。
       */
      verified: false,
      source: "參考圖上的字，站上查不到",
    },
    {
      id: "seven-store",
      text: "7-11 店到店 $60",
      verified: true,
      source: "常見問題：7-11 店到店 $60",
    },
    {
      id: "home-delivery",
      text: "新竹物流 宅配到家",
      /*
       * 參考圖寫「宅配 NT$120」，站上沒有這個價，只寫了新竹物流宅配，
       * 所以這一條只留服務名、不寫金額。
       */
      verified: true,
      source: "常見問題：新竹物流宅配",
    },
    {
      id: "free-threshold",
      text: "滿 NT$1,199 免運",
      verified: true,
      source: "常見問題：全館單筆消費滿 NT$1,199 宅配免運",
    },
  ] satisfies ShippingLine[],

  /**
   * 雞霸滿件免運。件數與品名都在這裡，元件只拿結果。
   * cutletKeyword 用來在購物車裡認出雞霸——照品名認，不寫死商品 ID。
   */
  cutletFreeShipping: {
    id: "cutlet-six",
    keyword: "雞霸",
    quantity: 6,
    text: "已符合 7-11 雞霸免運",
    pending: (left: number) => `再 ${left} 片雞霸符合 7-11 免運`,
    tone: "good",
    verified: false,
    source: "參考圖上的字，站上查不到「六片雞霸免運」",
  },

  /**
   * KALI 另行出貨。同樣照品名認。
   * 站上 KALI 那一頁寫的是預購與出貨日，沒寫「你只付一次運費」，
   * 所以這一條的字只留查得到的部分。
   */
  kaliSeparate: {
    id: "kali-separate",
    keyword: "KALI",
    text: "KALI 是預購，2026/10/30 起依訂單順序出貨，與其他商品分開寄出",
    tone: "warn",
    verified: true,
    source: "pages/found-object-001：預購，2026/10/30 起依訂單順序出貨",
  },
} as const;

/**
 * 還差多少才免運。公式就是需求寫的 max(0, 門檻 − 小計)。
 * 小計由 Shopify 的 cart.cost.subtotalAmount 來，不自己加總。
 */
export function remainingForFreeShipping(subtotal: number): number {
  return Math.max(0, shippingRules.freeShipping.threshold - subtotal);
}

/** 進度條填多少。小計為 0 時是 0，達門檻就封頂在 1。 */
export function freeShippingProgress(subtotal: number): number {
  const { threshold } = shippingRules.freeShipping;
  if (threshold <= 0) return 1;
  return Math.min(1, Math.max(0, subtotal / threshold));
}
