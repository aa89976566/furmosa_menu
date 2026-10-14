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
  RAIL_SLOGAN,
  SHOP_URL,
} from "@/data/real-food";

/** 無 JS 時直接還原所有待揭露的元素，避免內容被樣式鎖在不可見狀態。 */
const NOSCRIPT_FALLBACK = `<style>[data-rf-reveal]{opacity:1;transform:none;clip-path:none}</style>`;

/* 各格位佔整張紙的寬度比例，直接取自海報量測值。 */
const SIZES = {
  band1: "(max-width: 860px) 92vw, 29vw",
  band2: "(max-width: 860px) 92vw, 37vw",
  plate: "(max-width: 860px) 92vw, 13vw",
  band3: "(max-width: 860px) 92vw, 34vw",
  band4: "(max-width: 860px) 92vw, 24vw",
  aside: "(max-width: 860px) 92vw, 23vw",
} as const;

const [NIGHT_MARKET, SIGNATURE, DAILY_TREAT, THIS_ISSUE, CHARITY] = CHAPTERS;

export default function RealFoodPage() {
  /* 第二帶右格在海報上自成一格，是一張直幅單圖，不屬於任何一段文案。 */
  const plate = DAILY_TREAT.photos[1];
  const issueHero = THIS_ISSUE.photos[0];

  return (
    <div className="rf-page">
      <noscript dangerouslySetInnerHTML={{ __html: NOSCRIPT_FALLBACK }} />

      <span className="rf-grain" aria-hidden="true" />

      <div className="rf-sheet">
        <div className="rf-frame">
          {/* 整張紙的寬度就是版面單位：以下所有尺寸都用 cqw 寫，縮放時比例不變。 */}
          <div className="rf-sheet__body">
            <header className="rf-masthead">
              <p className="rf-ribbon">
                <span className="rf-ribbon__text">{MASTHEAD.ribbon}</span>
              </p>
              <Link href="/" className="rf-mark" aria-label="匠寵 FURMOSA — 回到目錄">
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
                  chapter={NIGHT_MARKET}
                  variant="stack"
                  sizes={SIZES.band1}
                  priority
                />
                <Panel
                  chapter={SIGNATURE}
                  variant="stack"
                  sizes={SIZES.band1}
                  priority
                />
              </div>

              <div className="rf-band rf-band--two">
                <Panel chapter={DAILY_TREAT} variant="row" sizes={SIZES.band2} />
                {plate ? (
                  <div className="rf-cell rf-cell--plate">
                    <Photo photo={plate} sizes={SIZES.plate} />
                  </div>
                ) : null}
              </div>

              <div className="rf-band rf-band--three">
                <div className="rf-cell rf-cell--photo">
                  <Photo photo={issueHero} sizes={SIZES.band3} />
                </div>
                <Panel chapter={THIS_ISSUE} variant="copy" />
              </div>

              <Panel
                chapter={CHARITY}
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

      {/*
        海報本身沒有這一段。導覽與事實交代排在同一張紙的背面：
        同寬、同框、同一組藍色格線，只有直書換成橫書。
      */}
      <section
        className="rf-sheet rf-sheet--back"
        aria-labelledby="rf-backside-title"
      >
        <div className="rf-frame">
          <div className="rf-sheet__body">
            <header className="rf-masthead">
              <h2 className="rf-ribbon" id="rf-backside-title">
                <span className="rf-ribbon__text">{CLOSING.title}</span>
              </h2>
              <p className="rf-stamp">
                <span className="rf-stamp__mark">背面</span>
                <span className="rf-stamp__note">{MASTHEAD.category}</span>
              </p>
            </header>

            <div className="rf-backside">
              <div className="rf-cell rf-backside__lede">
                <p className="rf-backside__lede-text">{OPENING.lede}</p>
              </div>

              <dl className="rf-specs">
                {OPENING.specs.map((spec) => (
                  <div className="rf-specs__row" key={spec.label}>
                    <dt className="rf-specs__label">{spec.label}</dt>
                    <dd className="rf-specs__value">{spec.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="rf-cell rf-backside__act">
                <p className="rf-backside__body">{CLOSING.body}</p>

                <a
                  className="rf-cta"
                  href={SHOP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {CLOSING.cta}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>

              {/* 報尾沿用書脊那個裝置：紙格裡壓一條藍底墨條。 */}
              <footer className="rf-footer">
                <div className="rf-footer__inner">
                  <p className="rf-footer__brand">
                    <Wordmark className="rf-footer__word" />
                    <span>{MASTHEAD.category}</span>
                  </p>
                  <nav className="rf-footer__nav" aria-label="其他頁面">
                    <Link href="/">凍乾目錄</Link>
                    <Link href="/paper">市場報</Link>
                    <Link href="/mooncake">中秋公益</Link>
                    <a
                      href={CHARITY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      浪浪尋家 ↗
                    </a>
                    <a
                      href={SHOP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      商店 ↗
                    </a>
                  </nav>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </section>

      <RegisterOnScroll />
    </div>
  );
}
