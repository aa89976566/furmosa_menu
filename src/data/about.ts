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
    tag: "團隊",
    value: "5",
    line: "現役成員",
    hook: "沒有人討厭狗。",
  },
  {
    id: "swap",
    className: "furmosa-about__card--swap",
    label: "換罐計畫參與店家",
    tag: "換罐",
    value: "47",
    line: "合作店家",
    hook: "舊罐死在這裡。",
  },
  {
    id: "dogma",
    className: "furmosa-about__card--dogma",
    label: "理念",
    tag: "信條",
    value: "01",
    line: "宣言",
    hook: "那碗是牠的。",
  },
  {
    id: "services",
    className: "furmosa-about__card--services",
    label: "服務範圍",
    tag: "業務",
    value: "4",
    line: "服務線",
    hook: "凍乾。沒別的。",
  },
  {
    id: "returned",
    className: "furmosa-about__card--returned",
    label: "換罐計畫參與人數",
    tag: "人數",
    value: "333",
    line: "參與者",
    hook: "每一罐都被換掉。",
  },
];

export const CREW_MEMBERS = [
  {
    code: "凍乾-01",
    name: "阿凍",
    role: "凍乾偏執狂",
    note: "低溫不說謊。行銷會。",
    ig: "https://www.instagram.com/",
  },
  {
    code: "換罐組",
    name: "罐姐",
    role: "換罐現場指揮",
    note: "空罐不進垃圾場。",
    ig: "https://www.instagram.com/",
  },
  {
    code: "標籤組",
    name: "標籤警察",
    role: "成分表審查",
    note: "封面是廣告。背面才是真相。",
    ig: "https://www.instagram.com/",
  },
  {
    code: "獸醫組",
    name: "獸醫顧問",
    role: "蛋白質顧問",
    note: "數據會說話。廣告不會。",
    ig: "https://www.instagram.com/",
  },
  {
    code: "目錄-00",
    name: "目錄管理員",
    role: "編號清單維護",
    note: "每一行編號，都是上架證明。",
    ig: "https://www.instagram.com/",
  },
];

export const SWAP_REGIONS = [
  {
    id: "north",
    label: "北區",
    count: 18,
    position: { top: "22%", left: "48%" },
    spots: ["台北信義", "台北中山", "新北板橋", "桃園中壢", "新竹東區"],
  },
  {
    id: "central",
    label: "中區",
    count: 16,
    position: { top: "48%", left: "42%" },
    spots: ["台中西區", "台中北屯", "彰化市", "南投草屯", "雲林斗六"],
  },
  {
    id: "south",
    label: "南區",
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
    code: "服-01",
    name: "單一成分凍乾",
    tagline: "一種肉。零廢話。零「風味」。",
  },
  {
    code: "服-02",
    name: "嗷嗚計畫",
    tagline: "讓狗自己決定。不是你。",
  },
  {
    code: "服-03",
    name: "換罐計畫",
    tagline: "舊罐換新罐。垃圾不換地球。",
  },
  {
    code: "服-04",
    name: "成分表翻譯",
    tagline: "免費。態度很差，但誠實。",
  },
];
