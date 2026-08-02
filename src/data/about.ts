export type AboutPanelId =
  | "crew"
  | "swap"
  | "dogma"
  | "services"
  | "returned";

export type AboutCard = {
  id: AboutPanelId;
  className: string;
  label: string;
  tag: string;
  value: string;
  line: string;
  hook: string;
};

export const ABOUT_CARDS: AboutCard[] = [
  {
    id: "crew",
    className: "furmosa-about__card--crew",
    label: "團隊介紹",
    tag: "THE CREW",
    value: "5",
    line: "ACTIVE MEMBERS",
    hook: "Nobody hates dogs.",
  },
  {
    id: "swap",
    className: "furmosa-about__card--swap",
    label: "換罐計畫參與店家",
    tag: "CAN SWAP",
    value: "47",
    line: "PARTNER STORES",
    hook: "Old cans die here.",
  },
  {
    id: "dogma",
    className: "furmosa-about__card--dogma",
    label: "理念",
    tag: "DOGMA",
    value: "01",
    line: "MANIFESTO",
    hook: "The bowl belongs to them.",
  },
  {
    id: "services",
    className: "furmosa-about__card--services",
    label: "服務範圍",
    tag: "WHAT WE DO",
    value: "4",
    line: "SERVICE LINES",
    hook: "Freeze-dried. Nothing else.",
  },
  {
    id: "returned",
    className: "furmosa-about__card--returned",
    label: "換罐計畫參與人數",
    tag: "HEAD COUNT",
    value: "333",
    line: "PARTICIPANTS",
    hook: "Every jar got swapped.",
  },
];

export const CREW_MEMBERS = [
  {
    code: "FREEZE-01",
    name: "阿凍",
    role: "凍乾偏執狂",
    note: "低溫不說謊。行銷會。",
    ig: "https://www.instagram.com/",
  },
  {
    code: "CAN-OPS",
    name: "罐姐",
    role: "換罐現場指揮",
    note: "空罐不進垃圾場。",
    ig: "https://www.instagram.com/",
  },
  {
    code: "LABEL-COP",
    name: "標籤警察",
    role: "成分表審查",
    note: "封面是廣告。背面才是真相。",
    ig: "https://www.instagram.com/",
  },
  {
    code: "VET-LINK",
    name: "獸醫顧問",
    role: "蛋白質顧問",
    note: "數據會說話。廣告不會。",
    ig: "https://www.instagram.com/",
  },
  {
    code: "INDEX-00",
    name: "目錄管理員",
    role: "編號清單維護",
    note: "每一行編號，都是上架證明。",
    ig: "https://www.instagram.com/",
  },
];

export const SWAP_REGIONS = [
  {
    id: "north",
    label: "NORTH",
    count: 18,
    position: { top: "22%", left: "48%" },
    spots: ["台北信義", "台北中山", "新北板橋", "桃園中壢", "新竹東區"],
  },
  {
    id: "central",
    label: "CENTRAL",
    count: 16,
    position: { top: "48%", left: "42%" },
    spots: ["台中西區", "台中北屯", "彰化市", "南投草屯", "雲林斗六"],
  },
  {
    id: "south",
    label: "SOUTH",
    count: 13,
    position: { top: "74%", left: "46%" },
    spots: ["台南中西", "高雄左營", "高雄苓雅", "屏東市"],
  },
] as const;

export const DOGMA_RULES = [
  "把選擇還給牠。不是還給廣告。",
  "成分表必須誠實。封面不算。",
  "單一蛋白。拒絕「風味」詐欺。",
  "廣告故事不是證據。",
  "空罐必須被回收。地球不是垃圾桶。",
  "編號清單只增不刪。每一包都要被記住。",
];

export const SERVICE_LINES = [
  {
    code: "S-01",
    name: "單一成分凍乾",
    tagline: "一種肉。零廢話。零「風味」。",
  },
  {
    code: "S-02",
    name: "嗷嗚計畫",
    tagline: "讓狗自己決定。不是你。",
  },
  {
    code: "S-03",
    name: "換罐計畫",
    tagline: "舊罐換新罐。垃圾不換地球。",
  },
  {
    code: "S-04",
    name: "成分表翻譯",
    tagline: "免費。態度很差，但誠實。",
  },
];
