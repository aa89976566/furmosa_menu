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
 * 桌機上右側刊頭柱吃掉將近四分之一，所以內容欄的實際寬度比直覺窄一截。
 */
const SIZES = {
  hero: "(max-width: 900px) 92vw, 26vw",
  side: "(max-width: 900px) 30vw, 11vw",
  mooncake: "(max-width: 900px) 92vw, 24vw",
  receipt: "(max-width: 900px) 92vw, 26vw",
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

/** 版名條。全頁只有這兩條是深色實地，所以它們同時是分版的界線與眼睛的落點。 */
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
            ---------- 報眉 ----------
            報紙最上面那一條事務列：小字標、欄目、查詢與購物、日期天氣。
            這裡的欄目是報紙的版面索引，所以排成一行細字，
            不做成有底色、有膠囊、有陰影的商店導覽列。
          */}
          <header className="st-head">
            <Link
              className="st-head__mark"
              href="/store"
              aria-label={`${NAMEPLATE.brand} ${NAMEPLATE.wordmark} 首頁`}
            >
              <span className="st-head__word">{NAMEPLATE.wordmark}</span>
              <span className="st-head__brand">{NAMEPLATE.brand}</span>
              <span className="st-head__motto">{NAMEPLATE.mottos[0]}</span>
            </Link>

            <nav className="st-head__nav" aria-label="版面索引">
              {NAV.map((item) => (
                <Anchor key={item.label} item={item} className="st-head__link" />
              ))}
            </nav>

            <nav className="st-head__tools" aria-label="帳號與購物車">
              <a
                className="st-head__icon"
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
                className="st-head__icon"
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
                className="st-head__icon"
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

          {/* ---------- 期號條 ---------- */}
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
            ---------- 刊頭柱 ----------
            刊名立在右側那條四分之一寬的直欄裡，不在版面中央。
            雙線框、直排紅字、拉丁字標墊在上面，底下兩行標語與一枚關防。
          */}
          <aside className="st-mast">
            <Link
              className="st-mast__mark"
              href="/store"
              aria-label={`${NAMEPLATE.brand} ${NAMEPLATE.wordmark}`}
            >
              <span className="st-mast__frame">
                <span className="st-mast__word">{NAMEPLATE.wordmark}</span>
                <span className="st-mast__brand">{NAMEPLATE.brand}</span>
                <span className="st-mast__column">{NAMEPLATE.column}</span>
              </span>
            </Link>

            <div className="st-mast__foot">
              {NAMEPLATE.mottos.map((motto) => (
                <p key={motto}>{motto}</p>
              ))}
            </div>
          </aside>

          {/*
            ---------- 第一版 ----------
            四欄兩列，寬度全不一樣：
            最左那一欄上面是窄高切口、下面是直排導言；接著直排主標、
            主圖，最右邊是直排規格。主標兩行一藍一紅，紅那一行是重點引文。

            DOM 的順序是手機要的順序：主標 → 導言 → 主圖 → 窄高切口 → 規格，
            桌機只是用 grid-area 把它們重新放位。
          */}
          <section className="st-front" aria-labelledby="st-front-title">
            <h1 className="st-front__head" id="st-front-title">
              <span className="st-front__kicker">{HERO.kicker}</span>

              <span className="st-front__lines">
                {HERO.headline.map((line, index) => (
                  <span
                    key={line}
                    className={
                      index === 0
                        ? "st-front__line"
                        : "st-front__line st-front__line--red"
                    }
                  >
                    {line}
                  </span>
                ))}
              </span>
            </h1>

            {/* 導言排在窄高切口底下，跟參考圖一樣是最左那一欄的下半。 */}
            <p className="st-front__lead">
              {HERO.lead.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>

            <figure className="st-front__figure">
              <Plate
                art={HERO.art}
                alt={HERO.alt}
                sizes={SIZES.hero}
                className="st-front__plate"
                priority
              />

              {/* 整頁唯一刻意跨到圖上的字。 */}
              <Seal
                text={HERO.seal}
                shape="oval"
                className="st-front__seal"
              />

              <figcaption>{HERO.caption}</figcaption>
            </figure>

            <figure className="st-front__side">
              <Plate
                art={HERO.side.art}
                alt={HERO.side.alt}
                sizes={SIZES.side}
                className="st-front__sideplate"
              />
              <figcaption>{HERO.side.caption}</figcaption>
            </figure>

            <div className="st-front__spec">
              <p className="st-front__specdisplay">
                {HERO.spec.display.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>

              <p className="st-front__specbody">
                {HERO.spec.body.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>

              <ul className="st-front__claims">
                {HERO.spec.claims.map((claim) => (
                  <li key={claim}>{claim}</li>
                ))}
              </ul>
            </div>
          </section>

          {/*
            ---------- 今日主打 ----------
            排在刊頭柱底下，和參考圖一樣是一盒加紅框的廣告：
            品名、價格、買的動作、出貨條件。
          */}
          <section className="st-feature" aria-labelledby="st-feature-label">
            <p className="st-feature__label" id="st-feature-label">
              {FEATURE.label}
            </p>

            <p className="st-feature__name">{FEATURE.name}</p>
            <p className="st-feature__sub">
              <span>{FEATURE.sub}</span>
              <span>{FEATURE.spec}</span>
            </p>

            <p className="st-feature__price">
              <span className="st-feature__currency">{FEATURE.currency}</span>
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
          </section>

          {/*
            ---------- 快訊 ----------
            一行高，全頁最小的一級字。它的工作是把第一版接到分類廣告，
            所以只給上下兩道線、沒有底色——有底色它就變成第二個版了。
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
            <Bar bar={ADS_BAR} id="st-ads-bar" />

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

          {/*
            ---------- 第二版：中秋月餅公益 ----------
            五欄，由左到右：紅框直排版名 → 直排內文 → 月餅實拍 →
            直排導言與橫向紅色引文 → 捐款收據。
            收據與月餅照都維持原彩，欄位逐字轉錄。
          */}
          <section className="st-second" aria-labelledby="st-second-bar">
            <Bar bar={SECOND.bar} id="st-second-bar" />

            <div className="st-second__body">
              <div className="st-second__title">
                <p className="st-second__kicker">{SECOND.kicker}</p>
                <p className="st-second__titleline">
                  {SECOND.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
              </div>

              <div className="st-second__text">
                {SECOND.body.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>

              <figure className="st-second__figure">
                <Plate
                  art={SECOND.photo.art}
                  alt={SECOND.photo.alt}
                  sizes={SIZES.mooncake}
                  className="st-second__plate"
                />

                {/* 橫向紅色引文，壓在月餅照的腳上、往右越過欄距。 */}
                <p className="st-second__pull">{SECOND.pull}</p>

                <figcaption>{SECOND.photo.caption}</figcaption>
              </figure>

              <div className="st-second__lead">
                <p className="st-second__leadline">
                  {SECOND.lead.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>

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

              {/* 整頁唯一加裝飾框的區塊，因為它是一份文件。 */}
              <div className="st-receipt">
                <p className="st-receipt__header">{SECOND.receipt.header}</p>

                <figure className="st-receipt__figure">
                  <Plate
                    art={SECOND.receipt.art}
                    alt={SECOND.receipt.alt}
                    sizes={SIZES.receipt}
                    className="st-receipt__plate"
                  />
                  <figcaption>{SECOND.receipt.caption}</figcaption>
                </figure>

                <p className="st-figure">
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

                <dl className="st-receipt__fields">
                  {SECOND.receipt.fields.map((field) => (
                    <div key={field.label} className="st-receipt__row">
                      <dt>{field.label}</dt>
                      <dd>{field.value}</dd>
                    </div>
                  ))}
                </dl>

                <p className="st-receipt__note">{SECOND.receipt.note}</p>
              </div>
            </div>

            <div className="st-dogs">
              <p className="st-kicker">{SECOND.dogs.label}</p>

              <ul className="st-dogs__list">
                {SECOND.dogs.items.map((dog) => (
                  <DogCell key={dog.name} dog={dog} />
                ))}
              </ul>
            </div>
          </section>

          {/* ---------- 換罐計畫 ---------- */}
          <section className="st-swap" aria-labelledby="st-swap-title">
            <p className="st-kicker st-kicker--v">{SWAP.kicker}</p>

            <div className="st-swap__main">
              <h3 className="st-swap__title" id="st-swap-title">
                {SWAP.title}
              </h3>

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
