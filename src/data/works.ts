export type WorksRow =
  | {
      kind: "link";
      index: number;
      label: string;
      href: string;
      color: "red" | "yellow" | "green" | "blue";
      latest?: boolean;
      hoverText?: string;
      external?: boolean;
    }
  | {
      kind: "upcoming";
      index: number;
      mystery: string;
      next?: boolean;
      hoverText?: string;
    };

export const WORKS_ROWS: WorksRow[] = [
  {
    kind: "link",
    index: 1,
    label: "全部商品",
    href: "https://furmosa.com/collections/all",
    color: "red",
    external: true,
  },
  {
    kind: "link",
    index: 2,
    label: "嚎大大雞霸",
    href: "/haodada",
    color: "yellow",
    latest: true,
    hoverText: "活動↗",
    external: true,
  },
  {
    kind: "link",
    index: 3,
    label: "浪浪交易所｜中秋限定盤",
    href: "https://them-stock-moon.furmosa.com/",
    color: "green",
    hoverText: "月餅成交 浪浪被看見",
    external: true,
  },
  {
    kind: "upcoming",
    index: 4,
    mystery: "????????????????????????????????",
    next: true,
    hoverText: "下一包",
  },
];

export const SHOP_URL = "https://furmosa.com/collections/all";
