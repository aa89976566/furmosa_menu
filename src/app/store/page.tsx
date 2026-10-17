import Image from "next/image";
import Link from "next/link";

import Burst from "@/components/store/Burst";
import Cut from "@/components/store/Cut";
import Seal from "@/components/store/Seal";
import {
  CARE,
  CARE_STORY,
  CART_URL,
  FOOTER,
  FOOTER_NAV,
  LEAD,
  LOGIN_URL,
  MASTHEAD,
  NAV,
  NEWSLETTER_ACTION,
  SEARCH_URL,
  SOCIALS,
  STALL_ROWS,
  UTILITY,
  type Product,
  type Stall,
} from "@/data/store";

/* 每一格佔整張紙的寬度，照版面的欄寬給，讓 next/image 不要抓過大的檔。 */
const SIZES = {
  plate: "(max-width: 900px) 92vw, 34vw",
  scene: "(max-width: 900px) 92vw, 46vw",
  cut: "(max-width: 900px) 40vw, 17vw",
  stall: "(max-width: 900px) 40vw, 15vw",
  good: "(max-width: 900px) 30vw, 9vw",
  small: "(max-width: 900px) 30vw, 11vw",
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

/*
 * 稿子上的價格是「很大的數字」跟著「很小的單位」，所以 NT$165 得拆成 165 與元。
 * 價格字串仍是資料裡唯一的出處，這裡只負責把數字挑出來。
 */
function figureOf(price: string): string {
  return price.replace(/\D/g, "");
}

/** 攤位裡有標價的商品：一張小雕版、名稱、規格，再壓一個很大的空心數字。 */
function Good({ product }: { product: Product }) {
  return (
    <li className="st-good">
      <a
        className="st-good__link"
        href={product.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="st-good__shot">
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

/**
 * 一格攤位。牌子釘在哪一角、格裡擺的是標價商品還是一塊雕版加幾行字，
 * 都照稿子一攤一攤不同，所以版型由資料上的 tagAt 與欄位有無決定。
 */
function StallCell({ stall }: { stall: Stall }) {
  return (
    <article className={`st-stall st-stall--${stall.tagAt}`}>
      <h3 className="st-stall__name">
        <span className="st-stall__name-text">{stall.name}</span>
      </h3>

      <div className="st-stall__body">
        <p className="st-stall__tagline">{stall.tagline}</p>

        {stall.art && stall.alt ? (
          <Cut
            art={stall.art}
            alt={stall.alt}
            sizes={SIZES.stall}
            className="st-stall__art"
          />
        ) : null}

        {stall.notes ? (
          <div className="st-stall__notes">
            {stall.notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        ) : null}

        {stall.goods ? (
          <ul className="st-stall__goods">
            {stall.goods.map((product) => (
              <Good key={product.name} product={product} />
            ))}
          </ul>
        ) : null}

        {stall.burst ? (
          <Burst burst={stall.burst} className="st-stall__burst" />
        ) : null}

        <Anchor item={stall} className="st-stall__cta">
          {stall.cta}
          <span aria-hidden="true">→</span>
        </Anchor>
      </div>
    </article>
  );
}

export default function StorePage() {
  const year = new Date().getFullYear();

  return (
    <div className="st-page">
      <span className="st-grain" aria-hidden="true" />

      <div className="st-sheet">
        <div className="st-sheet__body">
          {/* ---------- 框外的事務列與欄目列 ---------- */}
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
            ---------- 傳單 ----------
            一道粗框圈住整張傳單：上半是紙上的拼貼，下半是滿版墨色的攤位格。
          */}
          <div className="st-flyer">
            {/* ---------- 頭一則：招牌商品 ---------- */}
            <section className="st-lead" aria-labelledby="st-lead-title">
              <Cut
                art={LEAD.cut.art}
                alt={LEAD.cut.alt}
                sizes={SIZES.cut}
                className="st-lead__cut"
                priority
              />

              <div className="st-lead__mark">
                <p className="st-lead__mark-text">{LEAD.mark}</p>
                <p className="st-lead__claims">
                  {LEAD.claims.map((claim) => (
                    <span key={claim}>{claim}</span>
                  ))}
                </p>
              </div>

              <figure className="st-plate st-lead__plate">
                <Cut
                  art={LEAD.plate.art}
                  alt={LEAD.plate.alt}
                  sizes={SIZES.plate}
                  className="st-plate__art"
                  priority
                />
                <figcaption className="st-tag">{LEAD.plate.tag}</figcaption>
              </figure>

              <Cut
                art={LEAD.inset.art}
                alt={LEAD.inset.alt}
                sizes={SIZES.small}
                className="st-lead__inset"
              />

              <Burst
                burst={LEAD.burst}
                href={LEAD.burstHref}
                className="st-lead__burst"
              />

              <div className="st-lead__offer">
                <div className="st-lead__offer-lines">
                  {LEAD.offer.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <Burst
                  burst={LEAD.offer.burst}
                  href={LEAD.offer.href}
                  className="st-lead__offer-burst"
                />
              </div>

              <div className="st-lead__column">
                {LEAD.column.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              <p className="st-lead__quote">
                {MASTHEAD.quote.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>

              <header className="st-masthead">
                <Link
                  className="st-masthead__mark"
                  href="/store"
                  aria-label="匠寵 FURMOSA 首頁"
                >
                  <span className="st-masthead__brand">{MASTHEAD.brand}</span>
                  <span className="st-masthead__word">{MASTHEAD.wordmark}</span>
                </Link>
                <p className="st-masthead__line">{MASTHEAD.line}</p>
              </header>

              <h1 className="st-display" id="st-lead-title">
                <span className="st-display__small">
                  {LEAD.headline.small}
                </span>
                <span className="st-display__large">
                  {LEAD.headline.large}
                </span>
              </h1>

              <Link className="st-link st-lead__cta" href={LEAD.href}>
                {LEAD.cta}
                <span aria-hidden="true">→</span>
              </Link>

              <Seal text={MASTHEAD.seal} className="st-lead__seal" />
            </section>

            {/* ---------- 第二則：浪浪支持計畫 ---------- */}
            <section className="st-care" aria-labelledby="st-care-title">
              <h2 className="st-care__title" id="st-care-title">
                {CARE.title}
              </h2>

              <Cut
                art={CARE_STORY.plates[0].art}
                alt={CARE_STORY.plates[0].alt}
                sizes={SIZES.small}
                className="st-care__cut"
              />

              <Burst burst={CARE_STORY.burst} className="st-care__burst" />

              <figure className="st-plate st-care__jar">
                <Cut
                  art={CARE_STORY.plates[1].art}
                  alt={CARE_STORY.plates[1].alt}
                  sizes={SIZES.small}
                  className="st-plate__art"
                />
              </figure>

              <div className="st-care__column">
                {CARE_STORY.column.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              <div className="st-care__marks">
                {CARE_STORY.marks.map((mark) => (
                  <p className="st-care__mark" key={mark}>
                    {mark}
                  </p>
                ))}
              </div>

              <figure className="st-plate st-care__scene">
                <Cut
                  art={CARE_STORY.scene.art}
                  alt={CARE_STORY.scene.alt}
                  sizes={SIZES.scene}
                  className="st-plate__art"
                />
                <figcaption className="st-tag">
                  {CARE_STORY.scene.tag}
                </figcaption>
              </figure>

              <a
                className="st-link st-care__cta"
                href={CARE_STORY.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CARE_STORY.cta}
                <span aria-hidden="true">→</span>
              </a>
            </section>

            {/* ---------- 下半張：攤位格 ---------- */}
            <div className="st-stalls">
              {STALL_ROWS.map((row, index) => (
                <div
                  className={`st-stalls__row st-stalls__row--${index + 1}`}
                  key={row[0].name}
                >
                  {row.map((stall) => (
                    <StallCell key={stall.name} stall={stall} />
                  ))}

                  {/* 最後一列的第三格是訂閱券。 */}
                  {index === STALL_ROWS.length - 1 ? (
                    <section className="st-stall st-coupon" aria-label="訂閱最新消息">
                      <h3 className="st-stall__name">
                        <span className="st-stall__name-text">最新消息</span>
                      </h3>

                      <div className="st-stall__body">
                        <Cut
                          art={CARE.news.art}
                          alt={CARE.news.alt}
                          sizes={SIZES.small}
                          className="st-coupon__art"
                        />

                        <form
                          className="st-coupon__form"
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
                          <label
                            className="st-coupon__label"
                            htmlFor="st-news-email"
                          >
                            {CARE.news.placeholder}
                          </label>
                          <input
                            className="st-coupon__input"
                            id="st-news-email"
                            type="email"
                            name="contact[email]"
                            autoComplete="email"
                            required
                            placeholder={CARE.news.placeholder}
                          />
                          <button className="st-coupon__submit" type="submit">
                            <span>{CARE.news.submit}</span>
                            <span aria-hidden="true">→</span>
                          </button>
                        </form>
                      </div>
                    </section>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

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
