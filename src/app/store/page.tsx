import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import Seal from "@/components/store/Seal";
import {
  ADS,
  ADS_BAR,
  BRIEFS,
  CART_URL,
  FEATURE,
  FOOTER,
  FOOTER_NAV,
  HERO,
  ISSUE,
  LOGIN_URL,
  MASTHEAD,
  NAMEPLATE,
  NAV,
  NEWSLETTER_ACTION,
  PENDING_NOTE,
  SEARCH_URL,
  SECOND,
  SOCIALS,
  SUBSCRIBE,
  SWAP,
  TICKER,
  datelineOf,
  type Ad,
  type StrayDog,
} from "@/data/store";

/*
 * 每一格圖佔整張紙的寬度，照它所在的欄寬給，讓 next/image 不要抓過大的檔。
 * 桌機的欄寬量自參考圖：主圖 37.7%、今日主打裡的商品照約 13%、
 * 月餅 24%、收據 33%。
 */
const SIZES = {
  hero: "(max-width: 900px) 92vw, 38vw",
  feature: "(max-width: 900px) 34vw, 13vw",
  mooncake: "(max-width: 900px) 92vw, 24vw",
  receipt: "(max-width: 900px) 92vw, 33vw",
  adLead: "(max-width: 560px) 92vw, (max-width: 900px) 44vw, 22vw",
  ad: "(max-width: 560px) 44vw, (max-width: 900px) 30vw, 15vw",
  dog: "(max-width: 900px) 24vw, 10vw",
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
 * 一格圖。
 *
 * 有實拍就放實拍，而且維持原彩——商品與收據被染成單色就是在改變事實。
 * 沒有實拍的排成灰階占位框，框裡寫該放哪一張；拿一張像的照片頂替才是真的錯。
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

/**
 * 分類廣告的一則。
 *
 * 三種級別排出來的大小本來就不一樣：lead 有實拍與內文、plain 只有占位框、
 * text 連圖都沒有。所以這一列不會變成四張同尺寸的商品卡。
 */
function AdCell({ ad }: { ad: Ad }) {
  const lead = ad.kind === "lead";

  return (
    <li className={`st-ad st-ad--${ad.kind}`}>
      <a
        className="st-ad__link"
        href={ad.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {ad.kind === "text" ? null : (
          <Plate
            art={ad.art}
            alt={ad.alt}
            pending={ad.pending}
            sizes={lead ? SIZES.adLead : SIZES.ad}
            className="st-ad__plate"
          />
        )}

        <span className="st-ad__name">{ad.name}</span>
        <span className="st-ad__spec">{ad.spec}</span>

        {ad.body ? <span className="st-ad__body">{ad.body}</span> : null}

        <span className="st-ad__foot">
          <span className="st-ad__price">
            <span className="st-ad__figure">{figureOf(ad.price)}</span>
            <span className="st-ad__unit">元</span>
          </span>

          <span className="st-ad__action">
            {ad.note ?? ADS_BAR.action}
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
  const now = new Date();
  const year = now.getFullYear();
  const dateline = datelineOf(now);

  return (
    <div className="st-page">
      <div className="st-sheet">
        {/* 紙紋在墨下，對折那一道在墨上。 */}
        <span className="st-grain" aria-hidden="true" />
        <span className="st-fold" aria-hidden="true" />

        <div className="st-sheet__body">
          {/*
            ---------- 事務列 ----------
            版面最上面那一條：字標、欄目、查詢與購物、日期天氣。
            欄目排成一行細字，沒有底色、沒有膠囊、沒有陰影——
            它是報紙的版面索引，不是商店的導覽列。
          */}
          <header className="st-util">
            <Link
              className="st-util__mark"
              href="/store"
              aria-label={`${NAMEPLATE.brand} ${NAMEPLATE.wordmark} 首頁`}
            >
              <span className="st-util__word">{NAMEPLATE.wordmark}</span>
              <span className="st-util__brand">{NAMEPLATE.brand}</span>
              <span className="st-util__motto">{NAMEPLATE.mottos[0]}</span>
            </Link>

            <nav className="st-util__nav" aria-label="版面索引">
              {NAV.map((item) => (
                <Anchor key={item.label} item={item} className="st-util__link" />
              ))}
            </nav>

            <nav className="st-util__tools" aria-label="帳號與購物車">
              <a
                className="st-util__icon"
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
                className="st-util__icon"
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
                className="st-util__icon"
                href={CART_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ADS_BAR.cartLabel}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M3.4 4.4h2.5l2.5 10.4h9.4" />
                  <path d="M7.4 7.8h13l-1.9 6.1" />
                  <circle cx="9.6" cy="19" r="1.5" />
                  <circle cx="17.4" cy="19" r="1.5" />
                </svg>
              </a>
            </nav>

            {/*
              日期天氣。參考圖這一格寫了農曆與台北氣溫；那是查得到、
              而且每天都會變的數字，所以這裡只寫日期、紀年，
              天氣欄照農民曆那一欄寫宜不宜出門。
            */}
            <div className="st-dateline">
              <p className="st-dateline__date">{dateline.date}</p>
              <p className="st-dateline__row">
                <span>{dateline.weekday}</span>
                <span>{dateline.era}</span>
              </p>
              <p className="st-dateline__weather">
                <span className="st-dateline__wlabel">
                  {dateline.weather.label}
                </span>
                <span className="st-dateline__wvalue">
                  {dateline.weather.value}
                </span>
                <span className="st-dateline__wnote">
                  {dateline.weather.note}
                </span>
              </p>
            </div>
          </header>

          {/* ---------- 期號條：上下各一道雙線，三格一行 ---------- */}
          <p className="st-issue">
            <span className="st-issue__no">
              {ISSUE.number}
              <i aria-hidden="true">／</i>
              {ISSUE.origin}
            </span>
            <span className="st-issue__line">{ISSUE.line}</span>
            <span className="st-issue__daily">{ISSUE.daily}</span>
          </p>

          {/*
            ---------- 刊頭帶 ----------
            一條橫跨整幅的雙線框，三格：左側塊、刊名、右側塊。
            參考圖的側塊裡畫了插圖；這一版不畫插圖，只排字。
          */}
          <div className="st-masthead">
            <aside className="st-masthead__side st-masthead__side--left">
              <p className="st-masthead__sidelines">
                {MASTHEAD.left.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <p className="st-masthead__sidenote">{MASTHEAD.left.note}</p>
            </aside>

            <Link className="st-masthead__main" href="/store">
              <span className="st-masthead__title">
                <span className="st-masthead__word">{MASTHEAD.wordmark}</span>
                <span className="st-masthead__daily">{MASTHEAD.daily}</span>
              </span>

              <span className="st-masthead__line">
                {MASTHEAD.line.map((part) => (
                  <span key={part}>{part}</span>
                ))}
              </span>
            </Link>

            <aside className="st-masthead__side st-masthead__side--right">
              <p className="st-masthead__sidelines st-masthead__sidelines--wide">
                {MASTHEAD.right.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <p className="st-masthead__sidenote">{MASTHEAD.right.note}</p>
            </aside>
          </div>

          {/*
            ---------- 第一版 ----------
            四欄，寬度量自參考圖：主標與內文 25.5%、主圖 37.7%、
            今日主打 32.9%、最右那條直排小欄 3.9%。
          */}
          <section className="st-front" aria-labelledby="st-front-title">
            <div className="st-front__text">
              <p className="st-front__kicker">{HERO.kicker}</p>

              <h1 className="st-front__head" id="st-front-title">
                {HERO.headline.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h1>

              <div className="st-front__body">
                <p>{HERO.body[0]}</p>

                {/* 關防蓋在第一段與第二段之間，像參考圖那一枚圖章。 */}
                <Seal
                  text={HERO.seal}
                  shape="oval"
                  className="st-front__seal"
                />

                <p>{HERO.body[1]}</p>
              </div>
            </div>

            <figure className="st-front__figure">
              <Plate
                art={HERO.art}
                alt={HERO.alt}
                sizes={SIZES.hero}
                className="st-front__plate"
                priority
              />
              <figcaption>{HERO.caption}</figcaption>
            </figure>

            {/*
              今日主打。整幅的三分之一寬，所以它是一則大廣告：
              左半排字、右半放商品實拍。
            */}
            <aside className="st-feature" aria-labelledby="st-feature-label">
              {/* 欄名與免運都橫過整盒，所以它們是盒子的直接子元素，不在字欄裡。 */}
              <p className="st-feature__label" id="st-feature-label">
                {FEATURE.label}
              </p>

              <div className="st-feature__text">
                <p className="st-feature__name">{FEATURE.name}</p>
                <p className="st-feature__sub">{FEATURE.sub}</p>

                <p className="st-feature__spec">
                  {FEATURE.spec.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>

                <p className="st-feature__price">
                  <span className="st-feature__currency">
                    {FEATURE.currency}
                  </span>
                  <span className="st-feature__figure">{FEATURE.price}</span>
                </p>

                <a
                  className="st-buy"
                  href={FEATURE.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="st-buy__cart"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M3.4 4.4h2.5l2.5 10.4h9.4" />
                    <path d="M7.4 7.8h13l-1.9 6.1" />
                    <circle cx="9.6" cy="19" r="1.5" />
                    <circle cx="17.4" cy="19" r="1.5" />
                  </svg>
                  {FEATURE.cta}
                </a>
              </div>

              <Plate
                art={FEATURE.art}
                alt={FEATURE.alt}
                sizes={SIZES.feature}
                className="st-feature__plate"
              />

              <p className="st-ship">
                <svg
                  className="st-ship__truck"
                  viewBox="0 0 28 18"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M1 3h14v9H1z" />
                  <path d="M15 6h5.4L25 9.4V12h-10z" />
                  <circle cx="7" cy="14.4" r="2" />
                  <circle cx="20" cy="14.4" r="2" />
                </svg>

                <span className="st-ship__text">
                  {FEATURE.ship.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
              </p>
            </aside>

            {/* 第一版最右邊那條直排小欄。 */}
            <p className="st-front__aside">
              {HERO.aside.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </section>

          {/*
            ---------- 公益帶 ----------
            三欄，寬度量自參考圖：公益報導 52.2%、捐款收據 33.4%、
            換罐計畫 14.4%。月餅照與收據都維持原彩。
          */}
          <section className="st-charity" aria-labelledby="st-charity-title">
            <div className="st-charity__report">
              <div className="st-charity__text">
                <h2 className="st-charity__title" id="st-charity-title">
                  {SECOND.title}
                </h2>

                <p className="st-charity__lead">{SECOND.lead}</p>
                <p className="st-charity__pull">{SECOND.pull}</p>

                <div className="st-charity__body">
                  {SECOND.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>

                <a
                  className="st-link"
                  href={SECOND.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SECOND.cta}
                  <span aria-hidden="true">→</span>
                </a>
              </div>

              <figure className="st-charity__figure">
                <Plate
                  art={SECOND.photo.art}
                  alt={SECOND.photo.alt}
                  sizes={SIZES.mooncake}
                  className="st-charity__plate"
                />
                <figcaption>{SECOND.photo.caption}</figcaption>
              </figure>
            </div>

            {/* 整頁唯一加裝飾框的一欄，因為它是一份文件。 */}
            <div className="st-receipt">
              <p className="st-receipt__kicker">{SECOND.receipt.caption}</p>
              <p className="st-receipt__header">{SECOND.receipt.header}</p>

              <figure className="st-receipt__figure">
                <Plate
                  art={SECOND.receipt.art}
                  alt={SECOND.receipt.alt}
                  sizes={SIZES.receipt}
                  className="st-receipt__plate"
                />
              </figure>
            </div>

            {/*
              公益帶最右邊那一窄欄。參考圖這裡是一張線描插畫；這一版不畫插畫，
              改排收據上的字——金額與四個欄位逐字轉錄，放在原件照片旁邊，
              讀的人可以一欄一欄對回去。
            */}
            <aside className="st-ledger">
              <p className="st-ledger__kicker">{SECOND.receipt.ledger}</p>

              <p className="st-figure st-figure--ledger">
                <span className="st-figure__value">
                  {SECOND.receipt.figure.value}
                </span>
                <span className="st-figure__unit">
                  {SECOND.receipt.figure.unit}
                </span>
                <span className="st-figure__note">
                  {SECOND.receipt.figure.note}
                </span>
              </p>

              <dl className="st-ledger__fields">
                {SECOND.receipt.fields.map((field) => (
                  <div key={field.label} className="st-ledger__row">
                    <dt>{field.label}</dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="st-ledger__note">{SECOND.receipt.note}</p>
            </aside>

            {/* 七隻狗狗。公益帶的腳註，所以收在同一帶的最下面。 */}
            <div className="st-dogs">
              <p className="st-kicker">{SECOND.dogs.label}</p>

              <ul className="st-dogs__list">
                {SECOND.dogs.items.map((dog) => (
                  <DogCell key={dog.name} dog={dog} />
                ))}
              </ul>
            </div>
          </section>

          {/*
            ---------- 換罐計畫 ----------
            這一塊在參考圖上沒有對應的欄位（參考圖那一格是插畫）。
            它是這一頁的另一條公益線，資料本來就有，所以給它一條自己的帶：
            整幅三欄，直排眉題接橫排內文，右邊是家數與分區名單。
          */}
          <section className="st-swap" aria-labelledby="st-swap-title">
            <p className="st-kicker st-kicker--v">{SWAP.kicker}</p>

            <div className="st-swap__main">
              <h2 className="st-swap__title" id="st-swap-title">
                {SWAP.title}
              </h2>

              <div className="st-swap__body">
                {SWAP.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              <a
                className="st-link"
                href={SWAP.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {SWAP.cta}
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="st-swap__data">
              <p className="st-figure">
                <span className="st-figure__value">{SWAP.figure.value}</span>
                <span className="st-figure__unit">{SWAP.figure.unit}</span>
                <span className="st-figure__note">{SWAP.figure.note}</span>
              </p>

              <dl className="st-regions">
                {SWAP.regions.map((region) => (
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
          </section>

          {/*
            ---------- 快訊 ----------
            一行高，全頁最小的一級字。只給上下兩道線、沒有底色——
            有底色它就變成另一個版了。
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
            ---------- 分類廣告 ----------
            四則廣告的級別不一樣，所以尺寸也不一樣；最右邊再掛一條索引。
            商品照維持原彩，不染單色——客人要看到的是肉乾本來的顏色。
          */}
          <section className="st-ads" aria-labelledby="st-ads-bar">
            <h2 className="st-bar" id="st-ads-bar">
              <span className="st-bar__label">{ADS_BAR.label}</span>
              <span className="st-bar__note">{ADS_BAR.note}</span>
            </h2>

            <div className="st-ads__body">
              <ul className="st-ads__list">
                {ADS.map((ad) => (
                  <AdCell key={ad.name} ad={ad} />
                ))}
              </ul>

              <aside className="st-briefs">
                <p className="st-kicker">{BRIEFS.label}</p>

                <ul className="st-briefs__list">
                  {BRIEFS.items.map((brief) => (
                    <li key={brief.name}>
                      <Anchor item={brief} className="st-briefs__link">
                        <span className="st-briefs__name">{brief.name}</span>
                        <span className="st-briefs__note">{brief.note}</span>
                      </Anchor>
                    </li>
                  ))}
                </ul>

                <div className="st-briefs__foot">
                  <a
                    className="st-link"
                    href={ADS_BAR.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ADS_BAR.cta}
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </aside>
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
