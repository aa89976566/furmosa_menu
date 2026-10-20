import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import Marks from "@/components/store/Marks";
import Tongs from "@/components/store/Tongs";
import {
  BRAND,
  CART_URL,
  CHARITY,
  COVERS,
  CTA,
  FOOTER,
  FOOTER_NAV,
  HERO,
  KALI_NOTE,
  LOGIN_URL,
  MAKING,
  MORE_COLLECTIONS,
  NAV,
  NEWSLETTER_ACTION,
  PENDING_NOTE,
  POSTER_FOOT,
  POT,
  SEARCH_URL,
  SHIP_STRIP,
  SIDES,
  SOCIALS,
  SUBSCRIBE,
  SWAP,
  TITLE,
  TOPBAR,
  type Cover as CoverData,
  type PosterFootItem,
  type StrayDog,
} from "@/data/store";

/*
 * 每一張圖佔整個版面的寬度。盤面上的碟子是用百分比排的，
 * 所以這裡的 vw 直接照碟寬換算，next/image 才不會抓過大的檔。
 */
const SIZES = {
  hero: "(max-width: 900px) 86vw, 34vw",
  pot: "(max-width: 900px) 62vw, 24vw",
  peek: "(max-width: 900px) 34vw, 14vw",
  cover: "(max-width: 560px) 42vw, (max-width: 900px) 28vw, 18vw",
  step: "(max-width: 900px) 40vw, 16vw",
  sign: "(max-width: 900px) 40vw, 14vw",
  mooncake: "(max-width: 900px) 86vw, 30vw",
  receipt: "(max-width: 900px) 86vw, 32vw",
  dog: "(max-width: 900px) 20vw, 9vw",
} as const;

/* 報尾的社群字標。三個都畫在同一個 24 格的框裡，大小才會一致。 */
const SOCIAL_GLYPHS: Record<string, React.ReactNode> = {
  Instagram: (
    <>
      <rect x="4.6" y="4.6" width="14.8" height="14.8" rx="4.4" />
      <circle cx="12" cy="12" r="3.7" />
      <circle cx="16.6" cy="7.4" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  Facebook: (
    <path d="M14.8 7.3h2V4.4h-2.4c-2.3 0-3.6 1.4-3.6 3.7v2h-1.9v3h1.9v6.5h3.1v-6.5h2.2l.4-3h-2.6V8.6c0-.9.4-1.3 1.3-1.3Z" />
  ),
  /* 圓章只有二十來像素，塞得進 LINE 四個字母也認不出來，只畫那只對話框。 */
  "LINE 官方帳號": (
    <path d="M12 4.8c4.2 0 7.6 2.7 7.6 6.1 0 3.4-3.4 6.1-7.6 6.1-.6 0-1.2 0-1.7-.1l-3.9 2.3 1-3.3c-1.9-1.1-3-2.9-3-5 0-3.4 3.4-6.1 7.6-6.1Z" />
  ),
};

const CART_ICON = (
  <>
    <path d="M3.4 4.4h2.5l2.5 10.4h9.4" />
    <path d="M7.4 7.8h13l-1.9 6.1" />
    <circle cx="9.6" cy="19" r="1.5" />
    <circle cx="17.4" cy="19" r="1.5" />
  </>
);

/** 外部連結一律新開視窗；站內的（含 /haodada 這種改寫路徑）用 Link。 */
function Anchor({
  item,
  className,
  children,
}: {
  item: { href: string; external?: boolean; label?: string };
  className?: string;
  children?: React.ReactNode;
}) {
  const body = children ?? item.label;

  if (item.external) {
    return (
      <a
        className={className}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {body}
      </a>
    );
  }

  return (
    <Link className={className} href={item.href}>
      {body}
    </Link>
  );
}

/**
 * 一格圖。
 *
 * 有實拍就放實拍，而且維持原彩——商品與收據被染成單色就是在改變事實。
 * 沒有實拍的排成灰階占位框，框裡寫該放哪一張；拿一張像的照片頂替才是真的錯。
 */
function Art({
  art,
  alt,
  sizes,
  pending,
  className,
  priority,
}: {
  art?: StaticImageData;
  alt?: string;
  sizes: string;
  pending?: string;
  className?: string;
  priority?: boolean;
}) {
  const classes = className ? `po-art ${className}` : "po-art";

  if (!art || !alt) {
    return (
      <span className={`${classes} po-art--pending`}>
        <span className="po-art__name">{pending}</span>
        <span className="po-art__note">{PENDING_NOTE}</span>
      </span>
    );
  }

  return (
    <span className={classes}>
      <Image src={art} alt={alt} sizes={sizes} priority={priority} />
    </span>
  );
}

/**
 * 盤面上的一只分類碟。
 *
 * 碟心、碟寬、壓扁程度與牌的座標都是逐一量自參考圖的，用 custom property
 * 帶進 CSS。全部都是盤面寬的百分比，所以整塊盤面縮放時七只碟子跟七張牌的
 * 相對位置一格都不會跑。
 *
 * 牌是獨立定位的（不是掛在碟子上），而且左半邊的碟子牌往右長、
 * 右上兩只往左長——參考圖量出來就是這樣。
 */
function Cover({ cover }: { cover: CoverData }) {
  const { tag } = cover;

  return (
    <li
      className={`po-cover po-cover--${cover.tone} po-cover--${cover.fit}`}
      style={
        {
          "--x": cover.x,
          "--y": cover.y,
          "--w": cover.w,
          "--r": cover.ratio,
          "--tag-at": tag.at,
          "--tag-top": tag.top,
          ...(cover.cut ? { "--cut": cover.cut } : null),
          ...(cover.cutY ? { "--cut-y": cover.cutY } : null),
        } as React.CSSProperties
      }
    >
      <a
        className="po-cover__link"
        href={cover.href}
        target="_blank"
        rel="noopener noreferrer"
        /* 牌上印的是分類全名的一段，無障礙名給全名——兩者不會互相矛盾。 */
        aria-label={cover.title}
      >
        <span className="po-cover__frame">
          <span className="po-disc">
            <Art
              art={cover.art}
              alt={cover.alt}
              sizes={SIZES.cover}
              className="po-disc__art"
            />
          </span>
        </span>

        <span
          className={`po-tag po-tag--${tag.side}`}
          /* 牌是跟著字長的，兩個字就窄、五個字就寬，參考圖也是這樣。 */
        >
          {cover.label}
        </span>
      </a>
    </li>
  );
}

/**
 * 窄螢幕的分類表。
 *
 * 海報本身是一張固定長寬比的圖，窄螢幕就整塊等比縮小，排法一格都不改——
 * 要跟參考圖一模一樣，就不能在某個寬度以下把它拆成別的版面。
 *
 * 但有一樣東西是縮不下去的：牌子上的字。參考圖的牌高固定 50–54px、
 * 字高 30–31px，換算成盤寬是 1.88cqw，所以盤面低於 640px 時字就會低於
 * 12px 的可讀下限。所以牌在那個寬度以下收起來，分類名改排成這張表接在
 * 海報下面——海報維持原樣，字回到讀得到的大小。
 *
 * 碟子本身一直是連結，所以收掉牌不會讓任何東西點不到；這張表是另一個入口。
 */
function PosterIndex() {
  return (
    <ul className="po-index" aria-label="盤面上的分類">
      {COVERS.map((cover) => (
        <li className="po-index__row" key={cover.title}>
          <a
            className="po-index__link"
            href={cover.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="po-index__name">{cover.title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/* 海報頁尾那四個線條圖示。都畫在同一個 24 格的框裡，大小才會一致。 */
const FOOT_GLYPHS: Record<PosterFootItem["icon"], React.ReactNode> = {
  /* 編號清單：一張捲角的紙，上面三條線。 */
  list: (
    <>
      <path d="M6.2 3.4h8.1l4 4v13.2H6.2Z" />
      <path d="M14.1 3.6v3.9h3.9" />
      <path d="M9.1 12h6M9.1 15.4h6M9.1 8.6h2.6" />
    </>
  ),
  /* 文章：一本翻開的書。 */
  book: (
    <>
      <path d="M12 6.6C10.3 5.2 7.9 4.6 4.4 4.8v12.9c3.5-.2 5.9.4 7.6 1.8 1.7-1.4 4.1-2 7.6-1.8V4.8c-3.5-.2-5.9.4-7.6 1.8Z" />
      <path d="M12 6.6v12.9" />
    </>
  ),
  /* 配送：一台貨車。 */
  truck: (
    <>
      <path d="M2.8 6.4h10.4v9.8H2.8Z" />
      <path d="M13.2 9.6h3.9l3.2 3.2v3.4h-7.1Z" />
      <circle cx="7" cy="18.2" r="1.9" />
      <circle cx="16.4" cy="18.2" r="1.9" />
    </>
  ),
  /* 換罐：一只圓罐。 */
  jar: (
    <>
      <ellipse cx="12" cy="7.6" rx="7.2" ry="2.9" />
      <path d="M4.8 7.6v8.8c0 1.6 3.2 2.9 7.2 2.9s7.2-1.3 7.2-2.9V7.6" />
    </>
  ),
};

/** 七隻狗狗的一格。名字一定在，照片不一定在。 */
function DogCell({ dog }: { dog: StrayDog }) {
  return (
    <li className="po-dog">
      <Art
        art={dog.art}
        alt={dog.alt}
        pending={`${dog.name}的照片`}
        sizes={SIZES.dog}
        className="po-dog__art"
      />
      <span className="po-dog__name">{dog.name}</span>
    </li>
  );
}

export default function StorePage() {
  const year = new Date().getFullYear();

  return (
    <div className="po-page">
      {/* 橘底的網版顆粒。整頁只有這一層是裝飾，其餘都是內容。 */}
      <span className="po-grain" aria-hidden="true" />

      <div className="po-page__head">
        {/*
          ---------- 上緣 ----------
          字標、欄目、查詢與購物。欄目是一排粗體小字，沒有底色、
          沒有膠囊、沒有陰影——它跟海報上的標籤牌是同一套語言。
        */}
        <header className="po-top">
          <Link className="po-top__mark" href="/store" aria-label={`${BRAND.name} ${BRAND.wordmark} 首頁`}>
            <span className="po-top__word">{BRAND.wordmark}</span>
            <span className="po-top__brand">{BRAND.name}</span>
            <span className="po-top__motto">{BRAND.mottos[0]}</span>
          </Link>

          <nav className="po-top__nav" aria-label="分類">
            {NAV.map((item) => (
              <Anchor key={item.label} item={item} className="po-top__link" />
            ))}
          </nav>

          <nav className="po-top__tools" aria-label="帳號與購物車">
            <a
              className="po-icon"
              href={SEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="在商店裡搜尋"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="10.5" cy="10.5" r="6.4" />
                <path d="M15.4 15.4 21 21" />
              </svg>
            </a>

            <a
              className="po-icon"
              href={LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="登入或註冊"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="8.4" r="3.9" />
                <path d="M4.8 20.2c0-3.6 3.2-6.1 7.2-6.1s7.2 2.5 7.2 6.1" />
              </svg>
            </a>

            <a
              className="po-icon"
              href={CART_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="購物車"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                {CART_ICON}
              </svg>
            </a>
          </nav>
        </header>

      </div>

      {/*
        ---------- 盤面 ----------
        這一塊是參考圖本身：滿版、長寬比鎖在 1594×987。
        上緣一條深紅的運送條、正中一只橢圓大鍋（鍋緣 66 格刻度）、
        四周七只分類碟各掛一張奶白的牌、鍋緣趴著一隻狗、
        鍋下一枚深紅的膠囊與一條奶白的運送說明，最下一排奶白的頁尾。
        每一個座標都量自參考圖，所以它是整塊等比縮放的一張海報，
        不是一個「放了圖的區塊」。
      */}
      <section className="po-poster" aria-label="全部商品：一鍋端上來">
        <div className="po-stage">
          {/*
            上緣那一條。參考圖右邊是購物車的即時金額、中間是一條金色的進度條，
            兩樣都是這一頁讀不到的狀態（車在 furmosa.com 上），所以不畫——
            留在條上的是公告列那一句真的免運門檻，與一個連到真購物車的入口。
          */}
          <div className="po-bar">
            <p className="po-bar__note">{TOPBAR.note}</p>

            <a
              className="po-bar__cart"
              href={TOPBAR.cartHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                {CART_ICON}
              </svg>
              {TOPBAR.cart}
            </a>
          </div>

          {/* 中央的鍋。白鍋緣上一圈 66 格的灰色刻度，是參考圖最認得出來的那一處。 */}
          <div
            className="po-center"
            style={
              {
                "--x": POT.x,
                "--y": POT.y,
                "--w": POT.w,
                "--r": POT.ratio,
              } as React.CSSProperties
            }
          >
            <span className="po-center__rim" aria-hidden="true" />
            <span className="po-ticks" aria-hidden="true" />

            <figure className="po-center__bowl">
              <Art
                art={POT.art}
                alt={POT.alt}
                sizes={SIZES.pot}
                className="po-center__art"
                priority
              />
            </figure>
          </div>

          {/*
            鍋緣上那一隻。參考圖是插畫，這裡是站上原本就有的去背實拍，
            擺在同一個座標、同一個尺寸，一半藏在鍋緣後面。
          */}
          <Image
            className="po-peek"
            src={POT.peek.art}
            alt={POT.peek.alt}
            sizes={SIZES.peek}
            style={
              {
                "--x": POT.peek.x,
                "--y": POT.peek.y,
                "--w": POT.peek.w,
              } as React.CSSProperties
            }
            priority
          />

          {/*
            大標。黑字包一圈奶白的描邊，中線落在盤面正中（量到 49.97%W）。
            兩側那四根傾斜的強調條與散在橘底上的爆炸紋都在 Marks.tsx 裡。
          */}
          <h1 className="po-headline">
            <a
              className="po-headline__link"
              href={TITLE.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/*
                一個字一個 span：參考圖的四個字不是排成一條直線，中間兩個字
                比外面兩個高 13px，所以各帶一個位移與旋轉角（見 store.ts）。
                aria-label 給完整的詞，拆成 span 不會讓它被讀成四個字。
              */}
              <span aria-hidden="true">
                {TITLE.glyphs.map((glyph) => (
                  <span
                    className="po-headline__glyph"
                    key={glyph.ch}
                    style={
                      {
                        "--dy": glyph.dy,
                        "--rot": glyph.rot,
                      } as React.CSSProperties
                    }
                  >
                    {glyph.ch}
                  </span>
                ))}
              </span>
              <span className="po-vh">{TITLE.text}</span>
            </a>
          </h1>

          <Marks />

          {/*
            盤面下緣交叉的那兩支夾子。疊在鍋緣上面、碟子下面——
            參考圖的疊法就是這樣。輪廓是描參考圖描下來的，見 Tongs.tsx。
          */}
          <Tongs />

          <ul className="po-covers">
            {COVERS.map((cover) => (
              <Cover key={cover.title} cover={cover} />
            ))}
          </ul>

          {/* 鍋下那一枚膠囊。量到 422×100px、圓角就是半個高。 */}
          <a
            className="po-cta"
            href={CTA.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="po-cta__cart"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              {CART_ICON}
            </svg>
            {CTA.label}
          </a>

          {/* 奶白的運送條。三格照抄常見問題的物流與免運那兩段。 */}
          <a
            className="po-strip"
            href={SHIP_STRIP.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {SHIP_STRIP.cells.map((cell) => (
              <span className="po-strip__cell" key={cell}>
                {cell}
              </span>
            ))}
          </a>

          {/* 左下角那一枚對話框。寫的是 KALI 那一頁真的出貨時程。 */}
          <a
            className="po-bubble"
            href={KALI_NOTE.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {KALI_NOTE.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </a>

          {/* 海報自己的頁尾。四個項目居中一列，之間三道 2px 的分隔線。 */}
          <nav className="po-foot" aria-label="其他入口">
            {POSTER_FOOT.map((item) => (
              <Anchor key={item.label} item={item} className="po-foot__link">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  {FOOT_GLYPHS[item.icon]}
                </svg>
                {item.label}
              </Anchor>
            ))}
          </nav>
        </div>

        {/* 牌子縮不下去的寬度才出現，見 PosterIndex。 */}
        <PosterIndex />
      </section>

      <div className="po-page__body">
        {/*
          ---------- 頭盤 ----------
          雞霸。左邊排字、右邊一只黑描邊的大橢圓盤，
          跟底下盤面上的碟子是同一個形狀，所以它讀起來是同一張海報的第一道菜。
        */}
        <section className="po-hero" aria-labelledby="po-hero-title">
          <div className="po-hero__text">
            <p className="po-eyebrow">{HERO.eyebrow}</p>

            <h1 className="po-hero__head" id="po-hero-title">
              {HERO.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>

            <p className="po-hero__lead">{HERO.lead}</p>

            <p className="po-hero__spec">
              {HERO.spec.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>

            <div className="po-hero__buy">
              <p className="po-price">
                <span className="po-price__currency">{HERO.currency}</span>
                <span className="po-price__figure">{HERO.price}</span>
              </p>

              <a
                className="po-button"
                href={HERO.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="po-button__cart"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  {CART_ICON}
                </svg>
                {HERO.cta}
              </a>

              <p className="po-ship">
                {HERO.ship.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            </div>
          </div>

          <figure className="po-hero__figure">
            {/* 碟色與碟形沿用盤面那一套，但不帶 .po-cover——它不吃座標，是順著版面排的。 */}
            <span className="po-cover--pale po-cover--photo po-hero__plate">
              <span className="po-cover__frame">
                <span className="po-disc">
                  <Art
                    art={HERO.art}
                    alt={HERO.alt}
                    sizes={SIZES.hero}
                    className="po-disc__art"
                    priority
                  />
                </span>
              </span>
            </span>

            <figcaption>{HERO.caption}</figcaption>
          </figure>
        </section>

        {/*
          ---------- 鍋邊加點 ----------
          這幾項站上有品名、這一頁沒有單品頁與標價，所以只排名字，
          不自己編價格。它排成一條字牌，不是另外一排商品卡。
        */}
        <section className="po-sides" aria-labelledby="po-sides-title">
          <h2 className="po-sides__title" id="po-sides-title">
            {SIDES.kicker}
          </h2>

          <ul className="po-sides__list">
            {SIDES.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {/*
            盤面上只排得下七只碟子，但站上有十四個分類。
            剩下的接在這裡，排成一列字——排不進盤面不代表它不存在。
          */}
          <ul className="po-sides__more">
            {MORE_COLLECTIONS.map((item) => (
              <li key={item.label}>
                <Anchor item={item} className="po-sides__link" />
              </li>
            ))}
          </ul>

          <p className="po-sides__foot">
            <span className="po-sides__note">{SIDES.note}</span>
            <a
              className="po-link"
              href={SIDES.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {SIDES.cta}
              <span aria-hidden="true">→</span>
            </a>
          </p>
        </section>

        {/* ---------- 怎麼做的 ---------- */}
        <section className="po-making" aria-labelledby="po-making-title">
          <div className="po-making__text">
            <p className="po-eyebrow">{MAKING.kicker}</p>

            <h2 className="po-making__title" id="po-making-title">
              {MAKING.title}
            </h2>

            <div className="po-making__body">
              {MAKING.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <p className="po-figure">
              <span className="po-figure__value">{MAKING.figure.value}</span>
              <span className="po-figure__unit">{MAKING.figure.unit}</span>
              <span className="po-figure__note">{MAKING.figure.note}</span>
            </p>
          </div>

          <ol className="po-steps">
            {MAKING.steps.map((step, index) => (
              <li key={step.caption} className="po-step">
                <span className="po-step__no">{index + 1}</span>
                <Art
                  art={step.art}
                  alt={step.alt}
                  sizes={SIZES.step}
                  className="po-step__art"
                />
                <span className="po-step__caption">{step.caption}</span>
              </li>
            ))}
          </ol>

          <figure className="po-sign">
            <Art
              art={MAKING.sign.art}
              alt={MAKING.sign.alt}
              sizes={SIZES.sign}
              className="po-sign__art"
            />
            <figcaption>{MAKING.sign.caption}</figcaption>
          </figure>
        </section>

        {/*
          ---------- 公益 ----------
          月餅照與收據都維持原彩。它們陳述的是事實，不能被染色，
          也不能被橘底吃掉，所以這一段的底是白的。
        */}
        <section className="po-charity" aria-labelledby="po-charity-title">
          <div className="po-charity__text">
            <p className="po-eyebrow">{CHARITY.kicker}</p>

            <h2 className="po-charity__title" id="po-charity-title">
              {CHARITY.title}
            </h2>

            <p className="po-charity__lead">{CHARITY.lead}</p>
            <p className="po-charity__pull">{CHARITY.pull}</p>

            <div className="po-charity__body">
              {CHARITY.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <a
              className="po-link"
              href={CHARITY.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {CHARITY.cta}
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <figure className="po-charity__figure">
            <Art
              art={CHARITY.photo.art}
              alt={CHARITY.photo.alt}
              sizes={SIZES.mooncake}
              className="po-charity__art"
            />
            <figcaption>{CHARITY.photo.caption}</figcaption>
          </figure>

          {/* 整段唯一加框的一格，因為它是一份文件。 */}
          <div className="po-receipt">
            <p className="po-receipt__kicker">{CHARITY.receipt.kicker}</p>
            <p className="po-receipt__header">{CHARITY.receipt.header}</p>

            <Art
              art={CHARITY.receipt.art}
              alt={CHARITY.receipt.alt}
              sizes={SIZES.receipt}
              className="po-receipt__art"
            />

            <p className="po-figure po-figure--ink">
              <span className="po-figure__value">
                {CHARITY.receipt.figure.value}
              </span>
              <span className="po-figure__unit">
                {CHARITY.receipt.figure.unit}
              </span>
              <span className="po-figure__note">
                {CHARITY.receipt.figure.note}
              </span>
            </p>

            {/* 金額與四個欄位逐字轉錄，排在原件照片旁邊，讀的人可以一欄一欄對回去。 */}
            <dl className="po-receipt__fields">
              {CHARITY.receipt.fields.map((field) => (
                <div key={field.label} className="po-receipt__row">
                  <dt>{field.label}</dt>
                  <dd>{field.value}</dd>
                </div>
              ))}
            </dl>

            <p className="po-receipt__note">{CHARITY.receipt.note}</p>
          </div>

          <div className="po-dogs">
            <p className="po-dogs__label">{CHARITY.dogs.label}</p>

            <ul className="po-dogs__list">
              {CHARITY.dogs.items.map((dog) => (
                <DogCell key={dog.name} dog={dog} />
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- 換罐計畫 ---------- */}
        <section className="po-swap" aria-labelledby="po-swap-title">
          <div className="po-swap__text">
            <p className="po-eyebrow">{SWAP.kicker}</p>

            <h2 className="po-swap__title" id="po-swap-title">
              {SWAP.title}
            </h2>

            <div className="po-swap__body">
              {SWAP.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <a
              className="po-link"
              href={SWAP.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {SWAP.cta}
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="po-swap__data">
            <p className="po-swap__figures">
              {SWAP.figures.map((figure) => (
                <span key={figure.note} className="po-figure">
                  <span className="po-figure__value">{figure.value}</span>
                  <span className="po-figure__unit">{figure.unit}</span>
                  <span className="po-figure__note">{figure.note}</span>
                </span>
              ))}
            </p>

            <dl className="po-regions">
              {SWAP.regions.map((region) => (
                <div key={region.label} className="po-regions__row">
                  <dt>
                    {region.label}
                    <span>{region.count}</span>
                  </dt>
                  <dd>{region.spots}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- 訂閱 ---------- */}
        <section className="po-subscribe" aria-label={SUBSCRIBE.label}>
          <h2 className="po-subscribe__title">{SUBSCRIBE.title}</h2>

          <form
            className="po-subscribe__form"
            action={NEWSLETTER_ACTION}
            method="post"
            acceptCharset="UTF-8"
            target="_blank"
          >
            <input type="hidden" name="form_type" value="customer" />
            <input type="hidden" name="utf8" value="✓" />
            <input type="hidden" name="contact[tags]" value="newsletter" />
            <label className="po-vh" htmlFor="po-news-email">
              {SUBSCRIBE.placeholder}
            </label>
            <input
              className="po-subscribe__input"
              id="po-news-email"
              type="email"
              name="contact[email]"
              autoComplete="email"
              required
              placeholder={SUBSCRIBE.placeholder}
            />
            <button className="po-subscribe__submit" type="submit">
              <span>{SUBSCRIBE.submit}</span>
              <span aria-hidden="true">→</span>
            </button>
          </form>
        </section>

        {/* ---------- 報尾 ---------- */}
        <footer className="po-footer">
          <div className="po-footer__brand">
            <p className="po-footer__mark">
              <span className="po-footer__word">{FOOTER.wordmark}</span>
              <span className="po-footer__cjk">{FOOTER.name}</span>
            </p>
            <p className="po-footer__line">{FOOTER.line}</p>
          </div>

          <nav className="po-footer__nav" aria-label="其他頁面">
            {FOOTER_NAV.map((item) => (
              <Anchor key={item.label} item={item} className="po-footer__link" />
            ))}
          </nav>

          <ul className="po-footer__socials">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  className="po-icon"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    {SOCIAL_GLYPHS[social.label]}
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <p className="po-footer__rights">
            <span>{`© ${year} ${FOOTER.holder}`}</span>
            <span>{FOOTER.origin}</span>
          </p>

          <p className="po-footer__slogan">{FOOTER.slogan}</p>
        </footer>
      </div>
    </div>
  );
}
