import Link from "next/link";

import Chapter from "@/components/real-food/Chapter";
import RegisterOnScroll from "@/components/real-food/RegisterOnScroll";
import Wordmark from "@/components/real-food/Wordmark";
import {
  CHAPTERS,
  CLOSING,
  MASTHEAD,
  OPENING,
  RAIL_SLOGAN,
  SHOP_URL,
} from "@/data/real-food";

/** 無 JS 時直接還原所有待揭露的元素，避免內容被樣式鎖在不可見狀態。 */
const NOSCRIPT_FALLBACK = `<style>[data-rf-reveal]{opacity:1;transform:none;clip-path:none}</style>`;

export default function RealFoodPage() {
  return (
    <div className="rf-page">
      <noscript dangerouslySetInnerHTML={{ __html: NOSCRIPT_FALLBACK }} />

      <span className="rf-grain" aria-hidden="true" />
      <span className="rf-frame" aria-hidden="true" />
      <span className="rf-rail" aria-hidden="true">
        <span className="rf-rail__text">{RAIL_SLOGAN}</span>
      </span>

      <div className="rf-sheet">
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

        <section className="rf-opening" aria-labelledby="rf-opening-title">
          <div className="rf-opening__intro">
            <p className="rf-opening__lede">{OPENING.lede}</p>
            <p className="rf-opening__cue" aria-hidden="true">
              往下讀 ↓
            </p>
          </div>

          <div className="rf-opening__band">
            <h1 className="rf-opening__title" id="rf-opening-title">
              <span className="rf-spine">{OPENING.spine}</span>
            </h1>
            <p className="rf-opening__claim">
              <span className="rf-opening__claim-text">{OPENING.claim}</span>
            </p>
          </div>
        </section>

        <main className="rf-chapters">
          {CHAPTERS.map((chapter) => (
            <Chapter key={chapter.id} chapter={chapter} />
          ))}
        </main>

        <section className="rf-closing" data-rf-reveal="out">
          <h2 className="rf-closing__slogan">
            <span className="rf-closing__slogan-text">{CLOSING.slogan}</span>
          </h2>
          <div className="rf-closing__aside">
            <p className="rf-closing__body">{CLOSING.body}</p>
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
        </section>

        <footer className="rf-footer">
          <p className="rf-footer__brand">
            <Wordmark className="rf-footer__word" />
            <span>{MASTHEAD.category}</span>
          </p>
          <nav className="rf-footer__nav" aria-label="其他頁面">
            <Link href="/">凍乾目錄</Link>
            <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
              商店 ↗
            </a>
          </nav>
        </footer>
      </div>

      <RegisterOnScroll />
    </div>
  );
}
