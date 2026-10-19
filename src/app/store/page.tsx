import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import {
  BRAND,
  CART_URL,
  CHARITY,
  FOOTER,
  FOOTER_NAV,
  HERO,
  LOGIN_URL,
  MAKING,
  NAV,
  NEWSLETTER_ACTION,
  PENDING_NOTE,
  PLATES,
  POT,
  SEARCH_URL,
  SIDES,
  SOCIALS,
  SUBSCRIBE,
  SWAP,
  type Plate as PlateData,
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
  plate: "(max-width: 560px) 42vw, (max-width: 900px) 28vw, 18vw",
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
 * 盤面上的一只碟子。
 *
 * 座標與碟寬都是盤面寬的百分比，用 custom property 帶進 CSS，
 * 所以整個盤面縮放時九只碟子的相對位置不會跑掉。
 * 標籤牌掛在碟子靠中央的那一側——參考圖就是這樣讓每張牌都指回鍋子。
 */
function Plate({ plate }: { plate: PlateData }) {
  const side = plate.x > 50 ? "left" : "right";

  return (
    <li
      className={`po-plate po-plate--${plate.tone} po-plate--${plate.shape} po-plate--hang-${side}`}
      style={
        {
          "--x": plate.x,
          "--y": plate.y,
          "--w": plate.w,
        } as React.CSSProperties
      }
    >
      <Anchor item={plate} className="po-plate__link">
        <span className="po-plate__frame">
          <span className="po-disc">
            <Art
              art={plate.art}
              alt={plate.alt}
              pending={plate.pending}
              sizes={SIZES.plate}
              className="po-disc__art"
            />
          </span>
        </span>

        <span className="po-tag">
          <span className="po-tag__bullet" aria-hidden="true" />
          <span className="po-tag__body">
            <span className="po-tag__name">{plate.name}</span>
            <span className="po-tag__note">{plate.note}</span>
            {plate.price ? (
              <span className="po-tag__price">{plate.price}</span>
            ) : null}
          </span>
        </span>
      </Anchor>
    </li>
  );
}

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

      <div className="po-page__body">
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
            {/* 碟色與碟形沿用盤面那一套，但不帶 .po-plate——它不吃座標，是順著版面排的。 */}
            <span className="po-plate--pale po-hero__plate">
              <span className="po-plate__frame">
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
          ---------- 盤面 ----------
          中央一鍋，四周九只碟子，每只碟子掛一張白色標籤牌。
          整個盤面裝在一個固定長寬比的框裡，碟子用座標排，所以它整塊縮放。
        */}
        <section className="po-pot" aria-labelledby="po-pot-title">
          <header className="po-pot__head">
            <p className="po-eyebrow">{POT.kicker}</p>
            <h2 className="po-pot__title" id="po-pot-title">
              {POT.title}
            </h2>
            <p className="po-pot__lead">
              {POT.lead.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </header>

          <div className="po-stage">
            {/* 中央的鍋。白鍋緣上兩圈灰色放射虛線，是參考圖最認得出來的那一處。 */}
            <div className="po-center">
              <span className="po-center__rim" aria-hidden="true" />
              <span className="po-ticks po-ticks--outer" aria-hidden="true" />
              <span className="po-ticks po-ticks--inner" aria-hidden="true" />

              <figure className="po-center__bowl">
                <Art
                  art={POT.art}
                  alt={POT.alt}
                  sizes={SIZES.pot}
                  className="po-center__art"
                  priority
                />
              </figure>

              <Image
                className="po-peek"
                src={POT.peek.art}
                alt={POT.peek.alt}
                sizes={SIZES.peek}
                priority
              />

              <a
                className="po-tag po-tag--center"
                href={POT.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="po-tag__bullet" aria-hidden="true" />
                <span className="po-tag__body">
                  <span className="po-tag__name">{POT.label}</span>
                  <span className="po-tag__note">{POT.note}</span>
                  <span className="po-tag__price po-tag__price--cta">
                    {POT.cta}
                  </span>
                </span>
              </a>
            </div>

            <ul className="po-plates">
              {PLATES.map((plate) => (
                <Plate key={plate.name} plate={plate} />
              ))}
            </ul>
          </div>
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
            <p className="po-eyebrow po-eyebrow--ink">{CHARITY.kicker}</p>

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
