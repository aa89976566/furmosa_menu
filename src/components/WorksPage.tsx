"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import AboutModal from "@/components/AboutModal";
import { SHOP_URL, WORKS_ROWS } from "@/data/works";

export default function WorksPage() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [tappedRow, setTappedRow] = useState<number | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const trackCursor = (event: MouseEvent<HTMLElement>) => {
    setCursor({ x: event.clientX, y: event.clientY });
  };

  const hoverStyle: CSSProperties = {
    left: `${cursor.x}px`,
    top: `${cursor.y}px`,
  };

  return (
    <div className="works-page">
      <header className="works-header">
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
            Shop↗
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
          Shop↗
        </a>
      </footer>

      <main className="works-index">
        <div className="works-index__list" role="list">
          {WORKS_ROWS.map((row) => {
            const latestClass =
              row.kind === "link" && row.latest ? " works-row--latest" : "";
            const highlightClass =
              row.kind === "link" && row.highlight
                ? " works-row--highlight"
                : "";
            const nextClass =
              row.kind === "upcoming" && row.next ? " works-row--next" : "";
            const projectClass =
              row.kind === "link"
                ? " works-row--project works-row--campaign"
                : " works-row--upcoming";
            const tappedClass = tappedRow === row.index ? " is-tapped" : "";
            const tracksCursor =
              (row.kind === "link" && row.latest) ||
              (row.kind === "upcoming" && row.next);
            const latestLabel =
              row.kind === "link" && row.latest ? `${row.label}↗` : row.kind === "link" ? row.label : "";

            return (
              <div
                key={row.index}
                className={`works-row${projectClass}${latestClass}${highlightClass}${nextClass}${tappedClass}`}
                data-works-row="true"
                role="listitem"
                onMouseMove={tracksCursor ? trackCursor : undefined}
                onClick={() => {
                  if (row.kind === "upcoming" && row.next) {
                    setTappedRow((current) =>
                      current === row.index ? null : row.index,
                    );
                  }
                }}
              >
                <div className="works-row__left" aria-hidden="true">
                  #<br />
                  {row.index}
                </div>
                <div className="works-row__right">
                  {row.kind === "link" ? (
                    row.external ? (
                      <a
                        href={row.href}
                        className={`works-row__link${row.latest ? " latest" : ""}`}
                        title={row.label}
                        target={row.href.startsWith("http") ? "_blank" : undefined}
                        rel={
                          row.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        <MarqueeText>{latestLabel}</MarqueeText>
                      </a>
                    ) : (
                      <Link
                        href={row.href}
                        className="works-row__link"
                        title={row.label}
                      >
                        <MarqueeText>{row.label}</MarqueeText>
                      </Link>
                    )
                  ) : (
                    <span className="works-row__mystery">
                      <MarqueeText>{row.mystery}</MarqueeText>
                    </span>
                  )}
                </div>
                <span className="works-row__tile-overlay" aria-hidden="true" />
                {row.kind === "link" && row.latest && (
                  <span
                    className="works-hover-text works-hover-text--label"
                    style={hoverStyle}
                  >
                    Latest↗
                  </span>
                )}
                {row.kind === "upcoming" && row.next && (
                  <span
                    className="works-hover-text works-hover-text--next"
                    style={hoverStyle}
                  >
                    {row.hoverText ?? "下一包"}
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

function MarqueeText({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const apply = () => {
      const sample = document.createElement("span");
      sample.textContent = "0";
      sample.style.font = getComputedStyle(el).font;
      sample.style.position = "absolute";
      sample.style.visibility = "hidden";
      sample.style.whiteSpace = "nowrap";
      document.body.appendChild(sample);
      const ch = sample.getBoundingClientRect().width || 1;
      sample.remove();

      const overflowPx = Math.max(0, el.scrollWidth - parent.clientWidth);
      const overflowCh = Math.ceil(overflowPx / ch);
      el.style.setProperty("--overflow-amount", String(overflowCh));
      el.style.setProperty(
        "--animation-duration",
        overflowCh > 0 ? `${Math.max(overflowCh * 0.18, 1.2)}s` : "0s",
      );
      el.classList.toggle("works-row__marquee", overflowCh > 0);
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(parent);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [children]);

  return <span ref={ref}>{children}</span>;
}
