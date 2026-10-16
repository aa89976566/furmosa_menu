import Image from "next/image";
import Link from "next/link";

import Cut from "@/components/store/Cut";
import Ornament from "@/components/store/Ornament";
import Seal from "@/components/store/Seal";
import {
  ABOUT,
  CARE,
  CART_URL,
  DROPS,
  DROPS_BAND,
  FOOTER,
  FOOTER_NAV,
  GOODS_BAND,
  HERO,
  LOGIN_URL,
  MASTHEAD,
  NAV,
  NEWSLETTER_ACTION,
  PRODUCTS,
  PRODUCT_TABS,
  SEARCH_URL,
  SOCIALS,
  UTILITY,
} from "@/data/store";

/* 每一格佔整張紙的寬度，照版面的欄寬給，讓 next/image 不要抓過大的檔。 */
const SIZES = {
  hero: "(max-width: 900px) 92vw, 44vw",
  drop: "(max-width: 900px) 40vw, 13vw",
  scene: "(max-width: 900px) 92vw, 46vw",
  goods: "(max-width: 900px) 40vw, 14vw",
  small: "(max-width: 900px) 30vw, 9vw",
  tiny: "(max-width: 900px) 18vw, 5vw",
} as const;

/*
 * 稿子的頁尾放的是社群的字標本身，不是「IG」「FB」這種縮寫。
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

export default function StorePage() {
  const year = new Date().getFullYear();

  return (
    <div className="st-page">
      <span className="st-grain" aria-hidden="true" />

      <div className="st-sheet">
        <div className="st-sheet__body">
          {/* ---------- 事務列 ---------- */}
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

          {/* ---------- 報頭 ---------- */}
          <header className="st-masthead">
            <div className="st-masthead__badge">
              <p className="st-masthead__badge-text">{MASTHEAD.badge}</p>
              <p className="st-masthead__origin">
                {MASTHEAD.origin.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            </div>

            <Ornament className="st-masthead__weave" />

            <Seal text={MASTHEAD.seal} className="st-masthead__seal" />

            <Link className="st-masthead__mark" href="/store" aria-label="匠寵 FURMOSA 首頁">
              <span className="st-masthead__word">{MASTHEAD.wordmark}</span>
              <span className="st-masthead__brand">{MASTHEAD.brand}</span>
            </Link>

            <p className="st-masthead__line">{MASTHEAD.line}</p>

            <div className="st-masthead__quote">
              <p className="st-masthead__quote-text">
                {MASTHEAD.quote.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <Cut
                art={MASTHEAD.art}
                alt={MASTHEAD.alt}
                sizes={SIZES.tiny}
                className="st-masthead__dog"
              />
            </div>
          </header>

          {/* ---------- 導覽 ---------- */}
          <nav className="st-nav" aria-label="主要導覽">
            {NAV.map((item) => (
              <Anchor key={item.label} item={item} className="st-nav__link" />
            ))}
          </nav>

          {/* ---------- 頭版 ---------- */}
          <section className="st-hero" aria-labelledby="st-hero-title">
            <div className="st-hero__claim">
              <p className="st-hero__claim-text">
                {HERO.claim.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <p className="st-hero__claim-line">
                {HERO.line.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <Seal text={HERO.seal} shape="square" className="st-hero__seal" />
            </div>

            <div className="st-hero__plate">
              <Cut
                art={HERO.art}
                alt={HERO.alt}
                sizes={SIZES.hero}
                className="st-hero__art"
                priority
              />
            </div>

            <div className="st-hero__copy">
              <h1 className="st-hero__headline" id="st-hero-title">
                {HERO.headline.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h1>
              <div className="st-hero__body">
                {HERO.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <Link className="st-link" href="/real-food">
                {HERO.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>

          {/* ---------- 本期六大 DROP ---------- */}
          <section className="st-drops" aria-labelledby="st-drops-title">
            <header className="st-drops__head">
              <h2 className="st-drops__title" id="st-drops-title">
                {DROPS_BAND.title}
              </h2>
              <p className="st-drops__note">
                <span>{DROPS_BAND.note}</span>
              </p>
              <Seal
                text={DROPS_BAND.seal}
                shape="square"
                className="st-drops__seal"
              />
            </header>

            <ol className="st-drops__list">
              {DROPS.map((drop) => (
                <li className="st-drop" key={drop.index}>
                  <p className="st-drop__index">{drop.index}</p>
                  <h3 className="st-drop__title">
                    {drop.title.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h3>
                  <Cut
                    art={drop.art}
                    alt={drop.alt}
                    sizes={SIZES.drop}
                    className="st-drop__art"
                  />
                  <p className="st-drop__caption">{drop.caption}</p>
                  <Anchor item={drop} className="st-link st-drop__cta">
                    {DROPS_BAND.cta}
                    <span aria-hidden="true">→</span>
                  </Anchor>
                </li>
              ))}
            </ol>
          </section>

          {/* ---------- 關於 ---------- */}
          <section className="st-about" aria-labelledby="st-about-title">
            <div className="st-about__claim">
              <h2 className="st-about__claim-text" id="st-about-title">
                {ABOUT.claim.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p className="st-about__claim-line">
                {ABOUT.line.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <Seal
                text={ABOUT.seal}
                shape="square"
                className="st-about__seal"
              />
            </div>

            <div className="st-about__plate">
              <Cut
                art={ABOUT.art}
                alt={ABOUT.alt}
                sizes={SIZES.scene}
                className="st-about__art"
              />
            </div>

            <div className="st-about__copy">
              <div className="st-about__body">
                {ABOUT.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <a
                className="st-button"
                href={ABOUT.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {ABOUT.cta}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </section>

          {/* ---------- 嚴選商品 ---------- */}
          <section className="st-goods" aria-labelledby="st-goods-title">
            <header className="st-goods__head">
              <h2 className="st-goods__title" id="st-goods-title">
                {GOODS_BAND.title}
              </h2>
              <nav className="st-goods__tabs" aria-label="商品分類">
                {PRODUCT_TABS.map((tab) => (
                  <Anchor key={tab.label} item={tab} className="st-goods__tab" />
                ))}
              </nav>
              <a
                className="st-link st-goods__all"
                href={GOODS_BAND.shopHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {GOODS_BAND.cta}
                <span aria-hidden="true">→</span>
              </a>
            </header>

            <div className="st-goods__row">
              <div className="st-goods__claim">
                <p className="st-goods__claim-text">
                  {GOODS_BAND.claim.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
                <Cut
                  art={GOODS_BAND.art}
                  alt={GOODS_BAND.alt}
                  sizes={SIZES.small}
                  className="st-goods__dog"
                />
              </div>

              <ul className="st-goods__list">
                {PRODUCTS.map((product) => (
                  <li className="st-product" key={product.name}>
                    <a
                      className="st-product__link"
                      href={product.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="st-product__shot">
                        <Image
                          src={product.art}
                          alt={product.alt}
                          sizes={SIZES.goods}
                        />
                      </span>
                      <span className="st-product__name">{product.name}</span>
                      <span className="st-product__spec">{product.spec}</span>
                      <span className="st-product__foot">
                        <span className="st-product__price">
                          {product.price}
                        </span>
                        <span className="st-product__cart" aria-hidden="true">
                          <svg viewBox="0 0 24 24" focusable="false">
                            <path d="M2.5 3h3l2.6 11.2h10.1l2.3-8.2H7" />
                            <circle cx="10" cy="19.4" r="1.7" />
                            <circle cx="17.6" cy="19.4" r="1.7" />
                          </svg>
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="st-swap">
                <h3 className="st-swap__title">{GOODS_BAND.swap.title}</h3>
                <Cut
                  art={GOODS_BAND.swap.art}
                  alt={GOODS_BAND.swap.alt}
                  sizes={SIZES.small}
                  className="st-swap__art"
                />
                <div className="st-swap__body">
                  {GOODS_BAND.swap.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <a
                  className="st-link st-swap__cta"
                  href={GOODS_BAND.swap.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {GOODS_BAND.swap.cta}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </section>

          {/* ---------- 浪浪支持計畫與訂閱 ---------- */}
          <section className="st-care" aria-labelledby="st-care-title">
            <div className="st-care__main">
              <h2 className="st-care__title" id="st-care-title">
                {CARE.title}
              </h2>
              <Cut
                art={CARE.art}
                alt={CARE.alt}
                sizes={SIZES.small}
                className="st-care__art"
              />
              <div className="st-care__body">
                {CARE.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <a
                className="st-button st-care__cta"
                href={CARE.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CARE.cta}
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <aside className="st-care__aside">
              <Cut
                art={CARE.asideArt}
                alt={CARE.asideAlt}
                sizes={SIZES.small}
                className="st-care__cat"
              />
              <p className="st-care__aside-text">
                {CARE.aside.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            </aside>

            <div className="st-news">
              <h3 className="st-news__title">
                {CARE.news.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <Cut
                art={CARE.news.art}
                alt={CARE.news.alt}
                sizes={SIZES.small}
                className="st-news__art"
              />
              <form
                className="st-news__form"
                action={NEWSLETTER_ACTION}
                method="post"
                acceptCharset="UTF-8"
                target="_blank"
              >
                <input type="hidden" name="form_type" value="customer" />
                <input type="hidden" name="utf8" value="✓" />
                <input
                  type="hidden"
                  name="contact[tags]"
                  value="newsletter"
                />
                <label className="st-news__label" htmlFor="st-news-email">
                  {CARE.news.placeholder}
                </label>
                <input
                  className="st-news__input"
                  id="st-news-email"
                  type="email"
                  name="contact[email]"
                  autoComplete="email"
                  required
                  placeholder={CARE.news.placeholder}
                />
                <button className="st-news__submit" type="submit">
                  <span className="st-news__submit-label">
                    {CARE.news.submit}
                  </span>
                  <span aria-hidden="true">→</span>
                </button>
              </form>
            </div>
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
                <Anchor key={item.label} item={item} className="st-footer__link" />
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
