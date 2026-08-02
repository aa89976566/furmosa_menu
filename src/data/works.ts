export type WorksRow =
  | {
      kind: "link";
      index: number;
      label: string;
      href: string;
      color: "red" | "yellow";
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
    label: "嗷嗚計劃：青蛙誰在怕",
    href: "/challenge",
    color: "yellow",
    latest: true,
    hoverText: "活動↗",
  },
  {
    kind: "upcoming",
    index: 3,
    mystery: "????????????????????????????????",
    next: true,
    hoverText: "下一包",
  },
  {
    kind: "upcoming",
    index: 4,
    mystery: "????????????????????????????????",
  },
];

export const SHOP_URL = "https://furmosa.com/collections/all";
