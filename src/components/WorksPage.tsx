"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AboutModal from "@/components/AboutModal";
import { SHOP_URL, WORKS_ROWS } from "@/data/works";

export default function WorksPage() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [tappedRow, setTappedRow] = useState<number | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="works-page">
      <header className="works-header">
        <p className="works-header__catalog">匠寵凍乾目錄</p>
        <div className="works-header__actions">
          <button
            type="button"
            className="works-header__about"
            onClick={() => setAboutOpen(true)}
          >
            關於匠寵
          </button>
          <a
            href={SHOP_URL}
            className="works-header__shop"
            target="_blank"
            rel="noopener noreferrer"
          >
            SHOP↗
          </a>
          <button
            type="button"
            className="works-header__logo-btn"
            aria-label="Scroll to top"
            onClick={scrollToTop}
          >
            <Image
              src="/brand/furmosa-mark.svg"
              alt=""
              width={48}
              height={48}
              className="works-header__logo-mark"
              priority
            />
          </button>
        </div>
      </header>

      <footer className="works-mobile-shop">
        <a
          href={SHOP_URL}
          className="works-mobile-shop__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          SHOP↗
        </a>
      </footer>

      <main className="works-index">
        <div className="works-index__list" role="list">
          {WORKS_ROWS.map((row) => {
            const colorClass =
              row.kind === "link"
                ? ` works-row--link-${row.color}`
                : "";
            const latestClass = row.kind === "link" && row.latest
              ? " works-row--latest"
              : "";
            const nextClass =
              row.kind === "upcoming" && row.next ? " works-row--next" : "";
            const projectClass =
              row.kind === "link"
                ? " works-row--project works-row--campaign"
                : " works-row--upcoming";
            const tappedClass =
              tappedRow === row.index ? " is-tapped" : "";

            return (
              <div
                key={row.index}
                className={`works-row${projectClass}${colorClass}${latestClass}${nextClass}${tappedClass}`}
                data-works-row="true"
                role="listitem"
                onClick={() => {
                  if (
                    (row.kind === "link" && row.latest) ||
                    (row.kind === "upcoming" && row.next)
                  ) {
                    setTappedRow((current) =>
                      current === row.index ? null : row.index,
                    );
                  }
                }}
              >
                <div className="works-row__inner">
                  <div className="works-row__left" aria-hidden="true">
                    <span className="works-row__index"># {row.index}</span>
                  </div>
                  <div className="works-row__right">
                    {row.kind === "link" ? (
                      row.href.startsWith("http") ? (
                        <a
                          href={row.href}
                          className="works-row__link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {row.label}
                        </a>
                      ) : (
                        <Link href={row.href} className="works-row__link">
                          {row.label}
                        </Link>
                      )
                    ) : (
                      <span className="works-row__mystery">{row.mystery}</span>
                    )}
                  </div>
                </div>
                <span className="works-row__tile-overlay" aria-hidden="true" />
                {row.hoverText && row.kind === "link" && row.latest && (
                  <span className="works-hover-text works-hover-text--latest">
                    {row.hoverText}
                  </span>
                )}
                {row.hoverText && row.kind === "upcoming" && row.next && (
                  <span className="works-hover-text works-hover-text--next">
                    {row.hoverText}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
}
