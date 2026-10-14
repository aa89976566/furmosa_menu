import Link from "next/link";

import Panel from "@/components/real-food/Panel";
import Photo from "@/components/real-food/Photo";
import RegisterOnScroll from "@/components/real-food/RegisterOnScroll";
import Wordmark from "@/components/real-food/Wordmark";
import {
  CHAPTERS,
  CHARITY_URL,
  CLOSING,
  MASTHEAD,
  OPENING,
  PACK_URL,
  RAIL_SLOGAN,
} from "@/data/mooncake";

/** 無 JS 時直接還原所有待揭露的元素，避免內容被樣式鎖在不可見狀態。 */
const NOSCRIPT_FALLBACK = `<style>[data-rf-reveal]{opacity:1;transform:none;clip-path:none}</style>`;

/* 各格位佔整張紙的寬度比例，和 /real-food 同一組值。 */
const SIZES = {
  band1: "(max-width: 860px) 92vw, 29vw",
  band2: "(max-width: 860px) 92vw, 37vw",
  plate: "(max-width: 860px) 92vw, 13vw",
  band3: "(max-width: 860px) 92vw, 34vw",
  band4: "(max-width: 860px) 92vw, 24vw",
  aside: "(max-width: 860px) 92vw, 23vw",
} as const;

const [SEVEN_PACKS, MOONCAKE, SEVEN_DOGS, RECEIPT, DONATION] = CHAPTERS;

export default function MooncakePage() {
  /* 第二帶右格在海報上自成一格，是一張直幅單圖，不屬於任何一段文案。 */
  const plate = SEVEN_DOGS.photos[1];
  const receiptPhoto = RECEIPT.photos[0];

  return (
    <div className="rf-page">
      <noscript dangerouslySetInnerHTML={{ __html: NOSCRIPT_FALLBACK }} />

      <span className="rf-grain" aria-hidden="true" />

      <div className="rf-sheet">
        <div className="rf-frame">
          <div className="rf-sheet__body">
            <header className="rf-masthead">
              <p className="rf-ribbon">
                <span className="rf-ribbon__text">{MASTHEAD.ribbon}</span>
              </p>
              <Link
                href="/"
                className="rf-mark"
                aria-label="匠寵 FURMOSA — 回到目錄"
              >
                <Wordmark className="rf-mark__word" />
                <span className="rf-mark__line" aria-hidden="true">
                  <span className="rf-mark__brand">{MASTHEAD.brand}</span>
                  <span className="rf-mark__category">{MASTHEAD.category}</span>
                </span>
              </Link>
            </header>

            <div className="rf-collage">
              <div className="rf-band rf-band--one">
                <Panel
                  chapter={SEVEN_PACKS}
                  variant="stack"
                  sizes={SIZES.band1}
                  priority
                />
                <Panel
                  chapter={MOONCAKE}
                  variant="stack"
                  sizes={SIZES.band1}
                  priority
                />
              </div>

              <div className="rf-band rf-band--two">
                <Panel chapter={SEVEN_DOGS} variant="row" sizes={SIZES.band2} />
                {plate ? (
                  <div className="rf-cell rf-cell--plate">
                    <Photo photo={plate} sizes={SIZES.plate} />
                  </div>
                ) : null}
              </div>

              {/* 收據是這張海報的證據，所以吃下第三帶那個最寬的照片格。 */}
              <div className="rf-band rf-band--three">
                <div className="rf-cell rf-cell--photo">
                  <Photo photo={receiptPhoto} sizes={SIZES.band3} />
                </div>
                <Panel chapter={RECEIPT} variant="copy" />
              </div>

              <Panel
                chapter={DONATION}
                variant="wide"
                className="rf-band--four"
                sizes={SIZES.band4}
                asideSizes={SIZES.aside}
              />

              {/* 海報上唯一刻意破框的元素，壓在左下角跨過最後兩條帶。 */}
              <aside className="rf-rail">
                <p className="rf-rail__text">{RAIL_SLOGAN}</p>
              </aside>

              <div className="rf-spine-panel">
                <div className="rf-spine-panel__inner">
                  <h1 className="rf-spine-panel__title">
                    <span className="rf-spine">{OPENING.spine}</span>
                  </h1>
                  <p className="rf-claim">
                    <span className="rf-claim__text">{OPENING.claim}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 直書排不了阿拉伯數字，所以金額、編號與日期都交代在紙的背面。 */}
      <section className="rf-backside" aria-labelledby="rf-backside-title">
        <h2 className="rf-backside__title" id="rf-backside-title">
          {CLOSING.title}
        </h2>

        <p className="rf-backside__lede">{OPENING.lede}</p>

        <dl className="rf-specs">
          {OPENING.specs.map((spec) => (
            <div className="rf-specs__row" key={spec.label}>
              <dt className="rf-specs__label">{spec.label}</dt>
              <dd className="rf-specs__value">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <p className="rf-backside__body">{CLOSING.body}</p>

        <a
          className="rf-cta"
          href={CHARITY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {CLOSING.cta}
          <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className="rf-footer">
        <p className="rf-footer__brand">
          <Wordmark className="rf-footer__word" />
          <span>{MASTHEAD.category}</span>
        </p>
        <nav className="rf-footer__nav" aria-label="其他頁面">
          <Link href="/">凍乾目錄</Link>
          <Link href="/real-food">毛孩的真食堂</Link>
          <Link href="/paper">市場報</Link>
          <a href={PACK_URL} target="_blank" rel="noopener noreferrer">
            巴克幫 ↗
          </a>
        </nav>
      </footer>

      <RegisterOnScroll />
    </div>
  );
}
