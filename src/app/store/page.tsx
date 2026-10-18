import Image from "next/image";
import Link from "next/link";

import Cut from "@/components/store/Cut";
import Seal from "@/components/store/Seal";
import {
  BARS,
  CARE_PAGE,
  CART_URL,
  FOOTER,
  FOOTER_NAV,
  FRONT,
  GOODS,
  LOGIN_URL,
  NAMEPLATE,
  NAV,
  NEWSLETTER_ACTION,
  NOTICES,
  SEARCH_URL,
  SOCIALS,
  SUBSCRIBE,
  UTILITY,
  minguo,
  type Notice,
  type Product,
  type SectionBar,
} from "@/data/store";

/* 每一塊圖版佔整張紙的寬度，照它所在的欄寬給，讓 next/image 不要抓過大的檔。 */
const SIZES = {
  front: "(max-width: 900px) 92vw, 40vw",
  scene: "(max-width: 900px) 92vw, 48vw",
  good: "(max-width: 900px) 44vw, 20vw",
} as const;

/*
 * 報尾放的是社群的字標本身，不是「IG」「FB」這種縮寫。
 * 三個圓章都畫在同一個 24 格的框裡，大小才會一致。
 */
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
 * 版名條。舊報紙每一版上緣壓一條反白的版名——這一頁只有這三條是深色塊，
 * 所以它們同時是分版的界線，也是眼睛的落點。
 */
function Bar({ bar, id }: { bar: SectionBar; id?: string }) {
  return (
    <h2 className="st-bar" id={id}>
      <span className="st-bar__label">{bar.label}</span>
      <span className="st-bar__note">{bar.note}</span>
    </h2>
  );
}

/*
 * 價格照報紙廣告的做法排：大號的數字配一個小的「元」。
 * 價格字串仍是資料裡唯一的出處，這裡只負責把數字挑出來。
 */
function figureOf(price: string): string {
  return price.replace(/\D/g, "");
}

/** 商品版的一欄：圖版、品名、規格，價格貼在欄底。 */
function GoodColumn({ product }: { product: Product }) {
  return (
    <li className="st-good">
      <a
        className="st-good__link"
        href={product.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="st-good__plate">
          <Image src={product.art} alt={product.alt} sizes={SIZES.good} />
        </span>
        <span className="st-good__name">{product.name}</span>
        <span className="st-good__spec">{product.spec}</span>
        <span className="st-good__price">
          <span className="st-good__figure">{figureOf(product.price)}</span>
          <span className="st-good__unit">元</span>
        </span>
      </a>
    </li>
  );
}

/** 分類廣告的一格：純文字，共用同一套髮線格，所以不必各自畫框。 */
function NoticeCell({ notice }: { notice: Notice }) {
  return (
    <article className="st-notice">
      <h3 className="st-notice__name">{notice.name}</h3>
      <p className="st-notice__tagline">{notice.tagline}</p>

      {notice.notes ? (
        <div className="st-notice__body">
          {notice.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      ) : null}

      <Anchor item={notice} className="st-link st-notice__cta">
        {notice.cta}
        <span aria-hidden="true">→</span>
      </Anchor>
    </article>
  );
}

export default function StorePage() {
  const year = new Date().getFullYear();

  return (
    <div className="st-page">
      <div className="st-sheet">
        {/* 紙紋在墨下、摺痕在墨上，所以是兩層而不是一層。 */}
        <span className="st-grain" aria-hidden="true" />
        <span className="st-creases" aria-hidden="true" />

        <div className="st-sheet__body">
          {/* ---------- 事務列與欄目列 ---------- */}
          <div className="st-top">
            <div className="st-utility">
              <p className="st-utility__note">{UTILITY.left}</p>
              <p className="st-utility__centre">{UTILITY.centre}</p>
              <nav className="st-utility__links" aria-label="帳號與購物車">
                <a href={LOGIN_URL} target="_blank" rel="noopener noreferrer">
                  登入 / 註冊
                </a>
                <a href={CART_URL} target="_blank" rel="noopener noreferrer">
                  購物車
                </a>
                <a
                  className="st-utility__search"
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
              </nav>
            </div>

            <nav className="st-nav" aria-label="主要導覽">
              {NAV.map((item) => (
                <Anchor key={item.label} item={item} className="st-nav__link" />
              ))}
            </nav>
          </div>

          {/*
            ---------- 報頭 ----------
            橫跨全寬，三格：左邊直書的產地、中間刊名、右邊民國紀年，
            底下一粗一細兩道線把它與頭版封開。
          */}
          <header className="st-nameplate">
            <p className="st-nameplate__origin">
              {NAMEPLATE.origin.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </p>

            <Link
              className="st-nameplate__mark"
              href="/store"
              aria-label={`${NAMEPLATE.brand} ${NAMEPLATE.wordmark} 首頁`}
            >
              <span className="st-nameplate__brand">{NAMEPLATE.brand}</span>
              <span className="st-nameplate__word">{NAMEPLATE.wordmark}</span>
              <span className="st-nameplate__line">{NAMEPLATE.line}</span>
            </Link>

            <p className="st-nameplate__date">
              <span>{`中華民國${minguo(year)}年`}</span>
              <span>{NAMEPLATE.issuer}</span>
            </p>
          </header>

          {/*
            ---------- 頭版 ----------
            一則故事、一塊圖版、一句直書大標。整頁只有這一句是直書的。
          */}
          <section className="st-front" aria-labelledby="st-front-title">
            <div className="st-front__text">
              <p className="st-front__kicker">{FRONT.kicker}</p>

              <div className="st-front__lead">
                {FRONT.lead.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              <ul className="st-front__claims">
                {FRONT.claims.map((claim) => (
                  <li key={claim}>{claim}</li>
                ))}
              </ul>

              <Link className="st-link st-front__cta" href={FRONT.href}>
                {FRONT.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <figure className="st-front__figure">
              {/* 色塊與圖分成兩層：底色在外層，接地陰影才能只跟著去背的輪廓走。 */}
              <span className="st-front__panel">
                <Cut
                  art={FRONT.art}
                  alt={FRONT.alt}
                  sizes={SIZES.front}
                  className="st-front__art"
                  priority
                />
              </span>
              <figcaption>{FRONT.caption}</figcaption>
            </figure>

            <h1 className="st-front__headline" id="st-front-title">
              {FRONT.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>

            <Seal text={NAMEPLATE.seal} className="st-front__seal" />
          </section>

          {/* ---------- 商品版 ---------- */}
          <section className="st-goods" aria-labelledby="st-goods-bar">
            <Bar bar={BARS.goods} id="st-goods-bar" />

            <ul className="st-goods__list">
              {GOODS.items.map((product) => (
                <GoodColumn key={product.name} product={product} />
              ))}
            </ul>

            <a
              className="st-link st-goods__cta"
              href={GOODS.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {GOODS.cta}
              <span aria-hidden="true">→</span>
            </a>
          </section>

          {/* ---------- 社會版 ---------- */}
          <section className="st-care" aria-labelledby="st-care-bar">
            <Bar bar={BARS.care} id="st-care-bar" />

            <div className="st-care__grid">
              <figure className="st-care__figure">
                <Cut
                  art={CARE_PAGE.art}
                  alt={CARE_PAGE.alt}
                  sizes={SIZES.scene}
                  className="st-care__art"
                />
                <figcaption>{CARE_PAGE.caption}</figcaption>
              </figure>

              <div className="st-care__text">
                <h3 className="st-care__title">{CARE_PAGE.title}</h3>

                <div className="st-care__body">
                  {CARE_PAGE.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>

                <p className="st-care__figureline">
                  <span className="st-care__figurenote">
                    {CARE_PAGE.figure.note}
                  </span>
                  <span className="st-care__figureamount">
                    {CARE_PAGE.figure.amount}
                  </span>
                  <span className="st-care__figureunit">
                    {CARE_PAGE.figure.unit}
                  </span>
                </p>

                <a
                  className="st-link st-care__cta"
                  href={CARE_PAGE.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {CARE_PAGE.cta}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </section>

          {/* ---------- 分類廣告 ---------- */}
          <section className="st-notices" aria-labelledby="st-notices-bar">
            <Bar bar={BARS.notices} id="st-notices-bar" />

            <div className="st-notices__grid">
              {NOTICES.map((notice) => (
                <NoticeCell key={notice.name} notice={notice} />
              ))}
            </div>
          </section>

          {/* ---------- 讀者服務 ---------- */}
          <section className="st-subscribe" aria-label={SUBSCRIBE.label}>
            <p className="st-subscribe__label">{SUBSCRIBE.label}</p>
            <h2 className="st-subscribe__title">{SUBSCRIBE.title}</h2>

            <form
              className="st-subscribe__form"
              action={NEWSLETTER_ACTION}
              method="post"
              acceptCharset="UTF-8"
              target="_blank"
            >
              <input type="hidden" name="form_type" value="customer" />
              <input type="hidden" name="utf8" value="✓" />
              <input type="hidden" name="contact[tags]" value="newsletter" />
              <label className="st-vh" htmlFor="st-news-email">
                {SUBSCRIBE.placeholder}
              </label>
              <input
                className="st-subscribe__input"
                id="st-news-email"
                type="email"
                name="contact[email]"
                autoComplete="email"
                required
                placeholder={SUBSCRIBE.placeholder}
              />
              <button className="st-subscribe__submit" type="submit">
                <span>{SUBSCRIBE.submit}</span>
                <span aria-hidden="true">→</span>
              </button>
            </form>
          </section>

          {/* ---------- 報尾 ---------- */}
          <footer className="st-footer">
            <div className="st-footer__brand">
              <p className="st-footer__mark">
                <span className="st-footer__word">{FOOTER.wordmark}</span>
                <span className="st-footer__cjk">{FOOTER.brand}</span>
              </p>
              <p className="st-footer__line">{FOOTER.line}</p>
            </div>

            <nav className="st-footer__nav" aria-label="其他頁面">
              {FOOTER_NAV.map((item) => (
                <Anchor
                  key={item.label}
                  item={item}
                  className="st-footer__link"
                />
              ))}
            </nav>

            <ul className="st-footer__socials">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
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

            <p className="st-footer__rights">
              <span>{`© ${year} ${FOOTER.holder}`}</span>
              <span>{FOOTER.origin}</span>
            </p>

            <p className="st-footer__slogan">{FOOTER.slogan}</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
