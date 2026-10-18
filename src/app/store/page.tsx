import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import Seal from "@/components/store/Seal";
import {
  CARE,
  CART_URL,
  FOOTER,
  FOOTER_NAV,
  GOODS,
  HERO,
  LOGIN_URL,
  NAMEPLATE,
  NAV,
  NEWSLETTER_ACTION,
  NEWS_BRIEFS,
  NEWS_LEAD,
  NEWS_SECOND,
  PENDING_NOTE,
  SEARCH_URL,
  SOCIALS,
  SUBSCRIBE,
  TICKER,
  UTILITY,
  minguo,
  type Product,
  type StrayDog,
} from "@/data/store";

/* 每一格圖佔整張紙的寬度，照它所在的欄寬給，讓 next/image 不要抓過大的檔。 */
const SIZES = {
  hero: "(max-width: 900px) 92vw, 62vw",
  care: "(max-width: 900px) 92vw, 42vw",
  good: "(max-width: 560px) 92vw, (max-width: 900px) 44vw, 21vw",
  dog: "(max-width: 900px) 30vw, 12vw",
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

/** 版名條。全頁只有這兩條是深色塊，所以它們同時是分版的界線與眼睛的落點。 */
function Bar({
  bar,
  id,
}: {
  bar: { label: string; note: string };
  id?: string;
}) {
  return (
    <h2 className="st-bar" id={id}>
      <span className="st-bar__label">{bar.label}</span>
      <span className="st-bar__note">{bar.note}</span>
    </h2>
  );
}

/**
 * 一格圖。
 *
 * 有實拍就放實拍；沒有的排成灰階占位框，框裡寫該放哪一張。
 * 占位框是刻意看得出是缺口的——拿一張像的照片頂替才是真的錯。
 */
function Plate({
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
  const classes = className ? `st-plate ${className}` : "st-plate";

  if (!art || !alt) {
    return (
      <span className={`${classes} st-plate--pending`}>
        <span className="st-plate__pendingname">{pending}</span>
        <span className="st-plate__pendingnote">{PENDING_NOTE}</span>
      </span>
    );
  }

  return (
    <span className={classes}>
      <Image src={art} alt={alt} sizes={sizes} priority={priority} />
    </span>
  );
}

/*
 * 價格照報紙廣告的做法排：大號的數字配一個小的「元」。
 * 價格字串仍是資料裡唯一的出處，這裡只負責把數字挑出來。
 */
function figureOf(price: string): string {
  return price.replace(/\D/g, "");
}

/** 商品模組：圖、品名、規格、價格、選購。格與格之間不畫框，靠間距分。 */
function GoodCell({ product }: { product: Product }) {
  return (
    <li className="st-good">
      <a
        className="st-good__link"
        href={product.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Plate
          art={product.art}
          alt={product.alt}
          pending={product.pending}
          sizes={SIZES.good}
          className="st-good__plate"
        />

        <span className="st-good__name">{product.name}</span>
        <span className="st-good__spec">{product.spec}</span>

        <span className="st-good__buy">
          <span className="st-good__price">
            <span className="st-good__figure">{figureOf(product.price)}</span>
            <span className="st-good__unit">元</span>
          </span>
          <span className="st-good__action">
            {GOODS.action}
            <span aria-hidden="true">→</span>
          </span>
        </span>
      </a>
    </li>
  );
}

/** 七隻狗狗的一格。名字一定在，照片不一定在。 */
function DogCell({ dog }: { dog: StrayDog }) {
  return (
    <li className="st-dog">
      <Plate
        art={dog.art}
        alt={dog.alt}
        pending={`${dog.name}的照片`}
        sizes={SIZES.dog}
        className="st-dog__plate"
      />
      <span className="st-dog__name">{dog.name}</span>
    </li>
  );
}

export default function StorePage() {
  const year = new Date().getFullYear();

  return (
    <div className="st-page">
      <div className="st-sheet">
        {/* 紙紋在墨下，對折那一道在墨上。 */}
        <span className="st-grain" aria-hidden="true" />
        <span className="st-fold" aria-hidden="true" />

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
            報頭比上一版小四成：整頁最大的那塊墨讓給頭條與照片，
            刊名只負責說明這是誰發的，不必自己當主角。
          */}
          <header className="st-nameplate">
            {/* 左格放品牌的那一行英文，不重複事務列已經說過的產地。 */}
            <p className="st-nameplate__origin">{NAMEPLATE.line}</p>

            <Link
              className="st-nameplate__mark"
              href="/store"
              aria-label={`${NAMEPLATE.brand} ${NAMEPLATE.wordmark} 首頁`}
            >
              <span className="st-nameplate__brand">{NAMEPLATE.brand}</span>
              <span className="st-nameplate__word">{NAMEPLATE.wordmark}</span>
            </Link>

            <p className="st-nameplate__date">
              <span>{`中華民國${minguo(year)}年`}</span>
              <span>{NAMEPLATE.issuer}</span>
            </p>
          </header>

          {/*
            ---------- 頭版 ----------
            四塊：主標橫跨、左欄短文、照片吃掉剩下的全部寬度、買的按鈕。
            手機上這四塊的順序是 主標 → 短文 → 照片 → 按鈕，所以它們是
            四個獨立的孩子，而不是「文字欄」與「圖欄」兩塊。
          */}
          <section className="st-hero" aria-labelledby="st-hero-title">
            <h1 className="st-hero__head" id="st-hero-title">
              <span className="st-hero__kicker">{HERO.kicker}</span>
              {HERO.headline.map((line) => (
                <span key={line} className="st-hero__line">
                  {line}
                </span>
              ))}
            </h1>

            <div className="st-hero__text">
              <p className="st-hero__lead">{HERO.lead}</p>

              <ul className="st-hero__claims">
                {HERO.claims.map((claim) => (
                  <li key={claim}>{claim}</li>
                ))}
              </ul>
            </div>

            <figure className="st-hero__figure">
              <Plate
                art={HERO.art}
                alt={HERO.alt}
                sizes={SIZES.hero}
                className="st-hero__plate"
                priority
              />
              <figcaption>{HERO.caption}</figcaption>
            </figure>

            <div className="st-hero__act">
              <a
                className="st-buy"
                href={HERO.cta.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {HERO.cta.label}
                <span aria-hidden="true">→</span>
              </a>

              <Seal text={NAMEPLATE.seal} shape="square" className="st-hero__seal" />
            </div>
          </section>

          {/*
            ---------- 細新聞條 ----------
            一行高，全頁最小的一級字。它的工作是把頭版的大接到下面的三欄，
            所以它不能是第二個版——只給上下兩道線，沒有底色。
          */}
          <nav className="st-ticker" aria-label={TICKER.label}>
            <span className="st-ticker__label">{TICKER.label}</span>
            <ul className="st-ticker__list">
              {TICKER.items.map((item) => (
                <li key={item.text}>
                  <Anchor item={item} className="st-ticker__item">
                    {item.text}
                  </Anchor>
                </li>
              ))}
            </ul>
          </nav>

          {/*
            ---------- 三個不等寬新聞欄 ----------
            寬度與字級都不一樣，讀者才有進入順序：
            主欄有眉題、大標、內文與數字；次欄只有標題與內文；
            短欄只有一串標題。三欄同寬同字級就會變回格子。
          */}
          <div className="st-news">
            <article className="st-news__lead">
              <p className="st-kicker">{NEWS_LEAD.kicker}</p>
              <h3 className="st-news__title">{NEWS_LEAD.title}</h3>

              <div className="st-news__body">
                {NEWS_LEAD.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              <div className="st-news__data">
                <p className="st-figure">
                  <span className="st-figure__value">
                    {NEWS_LEAD.figure.value}
                  </span>
                  <span className="st-figure__unit">
                    {NEWS_LEAD.figure.unit}
                  </span>
                  <span className="st-figure__note">
                    {NEWS_LEAD.figure.note}
                  </span>
                </p>

                <dl className="st-regions">
                  {NEWS_LEAD.regions.map((region) => (
                    <div key={region.label} className="st-regions__row">
                      <dt>
                        {region.label}
                        <span>{region.count}</span>
                      </dt>
                      <dd>{region.spots}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <a
                className="st-link"
                href={NEWS_LEAD.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {NEWS_LEAD.cta}
                <span aria-hidden="true">→</span>
              </a>
            </article>

            <article className="st-news__second">
              <p className="st-kicker">{NEWS_SECOND.kicker}</p>
              <h3 className="st-news__title">{NEWS_SECOND.title}</h3>

              <div className="st-news__body">
                {NEWS_SECOND.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              <Anchor item={NEWS_SECOND} className="st-link">
                {NEWS_SECOND.cta}
                <span aria-hidden="true">→</span>
              </Anchor>
            </article>

            <aside className="st-briefs">
              <p className="st-kicker">{NEWS_BRIEFS.kicker}</p>

              <ul className="st-briefs__list">
                {NEWS_BRIEFS.items.map((brief) => (
                  <li key={brief.name}>
                    <Anchor item={brief} className="st-briefs__link">
                      <span className="st-briefs__name">{brief.name}</span>
                      <span className="st-briefs__note">{brief.note}</span>
                    </Anchor>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          {/* ---------- 商品 ---------- */}
          <section className="st-goods" aria-labelledby="st-goods-bar">
            <Bar bar={GOODS.bar} id="st-goods-bar" />

            <ul className="st-goods__list">
              {GOODS.items.map((product) => (
                <GoodCell key={product.name} product={product} />
              ))}
            </ul>

            <div className="st-goods__foot">
              <a
                className="st-link"
                href={GOODS.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {GOODS.cta}
                <span aria-hidden="true">→</span>
              </a>

              <a
                className="st-link"
                href={GOODS.cartHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {GOODS.cartLabel}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </section>

          {/*
            ---------- 浪浪支持計畫 ----------
            三塊真東西：月餅包裝的實拍、開立出來的收據、七隻狗狗。
            收據是全頁唯一出現捐款金額的地方，欄位逐字轉錄。
          */}
          <section className="st-care" aria-labelledby="st-care-bar">
            <Bar bar={CARE.bar} id="st-care-bar" />

            <div className="st-care__top">
              <figure className="st-care__figure">
                <Plate
                  art={CARE.photo.art}
                  alt={CARE.photo.alt}
                  sizes={SIZES.care}
                  className="st-care__plate"
                />
                <figcaption>{CARE.photo.caption}</figcaption>
              </figure>

              <div className="st-care__text">
                <h3 className="st-care__title">{CARE.title}</h3>

                <div className="st-care__body">
                  {CARE.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>

                <a
                  className="st-link"
                  href={CARE.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {CARE.cta}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            <div className="st-receipt">
              <figure className="st-receipt__figure">
                <Plate
                  art={CARE.receipt.art}
                  alt={CARE.receipt.alt}
                  sizes={SIZES.care}
                  className="st-receipt__plate"
                />
                <figcaption>{CARE.receipt.caption}</figcaption>
              </figure>

              <div className="st-receipt__text">
                <p className="st-figure">
                  <span className="st-figure__value">
                    {CARE.receipt.figure.value}
                  </span>
                  <span className="st-figure__unit">
                    {CARE.receipt.figure.unit}
                  </span>
                  <span className="st-figure__note">
                    {CARE.receipt.figure.note}
                  </span>
                </p>

                <dl className="st-receipt__fields">
                  {CARE.receipt.fields.map((field) => (
                    <div key={field.label} className="st-receipt__row">
                      <dt>{field.label}</dt>
                      <dd>{field.value}</dd>
                    </div>
                  ))}
                </dl>

                <p className="st-receipt__note">{CARE.receipt.note}</p>
              </div>
            </div>

            <div className="st-dogs">
              <p className="st-kicker">{CARE.dogs.label}</p>

              <ul className="st-dogs__list">
                {CARE.dogs.items.map((dog) => (
                  <DogCell key={dog.name} dog={dog} />
                ))}
              </ul>
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
