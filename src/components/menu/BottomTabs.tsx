import { SHOP_ORIGIN } from "@/config/shop";

/**
 * 餐桌最下面那一排四張卡。
 *
 * 這四個不是商品分類，所以視覺權重要壓在八只菜盤之下：牌子小一號、
 * 底色是奶白不是盤色、沒有盤緣也沒有照片，而且不參與「選中」那一套狀態。
 *
 * DROP 檔案庫連的是站內既有的企劃列表（雞霸、浪浪交易所、中秋月餅、
 * chill 嗨嗨ㄟ貓、背景很硬的碗…），不是另外做一份。
 */
const TABS = [
  {
    label: "DROP 檔案庫",
    href: "/works",
    icon: "archive" as const,
    note: "歷年企劃",
  },
  {
    label: "文章",
    href: "/real-food",
    icon: "book" as const,
    note: "真食堂",
  },
  {
    label: "配送與購物須知",
    href: `${SHOP_ORIGIN}/pages/${encodeURIComponent("常見問題")}`,
    icon: "truck" as const,
    external: true,
    note: "常見問題",
  },
  {
    label: "換罐計畫",
    href: `${SHOP_ORIGIN}/pages/partner`,
    icon: "jar" as const,
    external: true,
    note: "空罐帶回",
  },
];

const GLYPHS = {
  archive: (
    <>
      <rect x="3" y="4" width="18" height="5" rx="1" />
      <rect x="5" y="9" width="14" height="11" rx="1" />
      <path d="M10 13h4" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z" />
      <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5A1.5 1.5 0 0 0 20 18.5z" />
    </>
  ),
  truck: (
    <>
      <path d="M2 7h11v9H2z" />
      <path d="M13 10h4.5l2.5 3v3H13z" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="16.5" cy="18" r="1.8" />
    </>
  ),
  jar: (
    <>
      <path d="M8 3h8v2.5l-1.2 1.6A4 4 0 0 0 14 9.5V20H10V9.5a4 4 0 0 0-.8-2.4L8 5.5z" />
      <path d="M10 13h4" />
    </>
  ),
};

export function BottomTabs() {
  return (
    <nav className="mn-tabs" aria-label="其他頁面">
      <ul className="mn-tabs__list">
        {TABS.map((tab) => (
          <li key={tab.label}>
            <a
              className="mn-tab"
              href={tab.href}
              {...(tab.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <svg
                viewBox="0 0 24 24"
                className="mn-tab__icon"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {GLYPHS[tab.icon]}
              </svg>
              <span className="mn-tab__label">{tab.label}</span>
              <span className="mn-tab__note">{tab.note}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
