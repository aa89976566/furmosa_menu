import Link from "next/link";
import { Fragment } from "react";

import Figure from "@/components/paper/Figure";
import Plate from "@/components/paper/Plate";
import Starburst from "@/components/paper/Starburst";
import {
  CHARITY,
  CLOSING_PHOTOS,
  COLOPHON,
  LEAD,
  LISTINGS,
  LISTINGS_HEADING,
  MASTHEAD,
  SECOND,
  SERVICES,
  SERVICES_HEADING,
} from "@/data/paper";

/** 直書欄位：一行一欄，由 writing-mode 把 <br> 轉成新的一列。 */
function Columns({ lines, className }: { lines: readonly string[]; className: string }) {
  return (
    <p className={className}>
      {lines.map((line, index) => (
        <Fragment key={line}>
          {index > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </p>
  );
}

export default function PaperPage() {
  return (
    <div className="pp-page">
      <span className="pp-grain" aria-hidden="true" />

      <div className="pp-sheet">
        {/* ---------- 頭版：報頭與單一成分凍乾 ---------- */}
        <section className="pp-lead" aria-labelledby="pp-masthead-title">
          <div className="pp-lead__masthead">
            <p className="pp-logo">
              <span className="pp-logo__brand">{MASTHEAD.brand}</span>
              <span className="pp-logo__latin">{MASTHEAD.latin}</span>
              <span className="pp-logo__sub">{MASTHEAD.latinSub}</span>
            </p>

            <h1 className="pp-title" id="pp-masthead-title">
              <span className="pp-title__kicker">{MASTHEAD.kicker}</span>
              <span className="pp-title__headline">{MASTHEAD.headline}</span>
            </h1>
          </div>

          <div className="pp-lead__cutout">
            <Plate
              photo={LEAD.cutout}
              className="pp-plate--cutout"
              sizes="(max-width: 680px) 44vw, 15rem"
              priority
            />
            <div className="pp-lead__label">
              <h2 className="pp-lead__product">{LEAD.label}</h2>
              <Columns lines={LEAD.points} className="pp-lead__points" />
            </div>
            <Figure figure={LEAD.figure} className="pp-figure--lead" />
          </div>

          <div className="pp-lead__plates">
            {LEAD.photos.map((photo, index) => (
              <Plate
                key={photo.alt}
                photo={photo}
                sizes="(max-width: 680px) 92vw, 22rem"
                priority={index === 0}
              />
            ))}
          </div>

          <div className="pp-lead__story">
            <Columns lines={LEAD.story} className="pp-lead__text" />
          </div>
        </section>

        {/* ---------- 二版：換罐計畫 ---------- */}
        <section className="pp-second" aria-labelledby="pp-second-title">
          <h2 className="pp-second__title" id="pp-second-title">
            <span className="pp-second__kicker">{SECOND.kicker}</span>
            <span className="pp-second__headline">
              {SECOND.headline.map((line, index) => (
                <Fragment key={line.text}>
                  {index > 0 ? <br /> : null}
                  {line.text}
                  {line.num ? (
                    <span className="pp-upright">{line.num}</span>
                  ) : null}
                </Fragment>
              ))}
            </span>
          </h2>

          <Starburst className="pp-burst--second">
            <span className="pp-burst__value">{SECOND.burst.value}</span>
            <span className="pp-burst__unit">{SECOND.burst.unit}</span>
            <span className="pp-burst__label">{SECOND.burst.label}</span>
          </Starburst>

          <div className="pp-second__editorial">
            <Columns lines={SECOND.rules} className="pp-second__rules" />
          </div>

          <div className="pp-second__plates">
            {SECOND.photos.map((photo) => (
              <Plate
                key={photo.alt}
                photo={photo}
                sizes="(max-width: 680px) 92vw, 20rem"
              />
            ))}
          </div>

          <dl className="pp-regions">
            {SECOND.regions.map((region) => (
              <div className="pp-regions__row" key={region.label}>
                <dt className="pp-regions__label">{region.label}</dt>
                <dd className="pp-regions__value">
                  <span className="pp-regions__count">{region.count}</span>
                  <span className="pp-regions__unit">家</span>
                  <span className="pp-regions__spots">{region.spots}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- 三版：中秋月餅公益 ---------- */}
        <section className="pp-charity" aria-labelledby="pp-charity-title">
          <h2 className="pp-charity__title" id="pp-charity-title">
            <span className="pp-charity__kicker">{CHARITY.kicker}</span>
            <span className="pp-charity__headline">
              {CHARITY.headline.map((line, index) => (
                <Fragment key={line.text}>
                  {index > 0 ? <br /> : null}
                  {line.text}
                </Fragment>
              ))}
            </span>
          </h2>

          <div className="pp-charity__editorial">
            <Columns lines={CHARITY.story} className="pp-charity__text" />
          </div>

          {/* 證據欄：包裝照、收據照，以及收據欄位的逐字轉錄。 */}
          <div className="pp-charity__docs">
            <div className="pp-charity__plates">
              {CHARITY.photos.map((photo) => (
                <Plate
                  key={photo.alt}
                  photo={photo}
                  sizes="(max-width: 680px) 92vw, 14rem"
                />
              ))}
              <Plate
                photo={CHARITY.receiptPhoto}
                className="pp-plate--receipt"
                sizes="(max-width: 680px) 92vw, 17rem"
              />
            </div>

            <dl className="pp-ledger">
              {CHARITY.receipt.map((row) => (
                <div className="pp-ledger__row" key={row.label}>
                  <dt className="pp-ledger__label">{row.label}</dt>
                  <dd className="pp-ledger__value">{row.value}</dd>
                </div>
              ))}
            </dl>

            <p className="pp-charity__note">{CHARITY.note}</p>
          </div>

          <Starburst className="pp-burst--charity" count={18}>
            <span className="pp-burst__shout">
              {CHARITY.burst.map((line, index) => (
                <Fragment key={line}>
                  {index > 0 ? <br /> : null}
                  {line}
                </Fragment>
              ))}
            </span>
          </Starburst>

          {/* 全報唯一的金額欄位：一張收據，不是一個價錢。 */}
          <div className="pp-donation">
            <Figure figure={CHARITY.donation} className="pp-figure--donation" />
            <p className="pp-donation__payee">{CHARITY.payee}</p>
            <a
              className="pp-donation__link"
              href={CHARITY.link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {CHARITY.link.label}↗
            </a>
          </div>
        </section>

        {/* ---------- 綠底：上架清單 ---------- */}
        <section className="pp-listings" aria-labelledby="pp-listings-title">
          <div className="pp-listings__head">
            <h2 className="pp-listings__title" id="pp-listings-title">
              <span className="pp-listings__kicker">
                {LISTINGS_HEADING.kicker}
              </span>
              {LISTINGS_HEADING.title}
            </h2>
            <p className="pp-listings__note">{LISTINGS_HEADING.note}</p>
          </div>

          <ul className="pp-listings__grid">
            {LISTINGS.map((listing) => (
              <li
                className={`pp-cell${listing.wide ? " pp-cell--wide" : ""}${
                  listing.burst ? " pp-cell--burst" : ""
                }`}
                key={listing.index}
              >
                <a
                  className="pp-cell__link"
                  href={listing.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="pp-cell__name">《{listing.name}》</span>
                  <span className="pp-cell__note">{listing.note}</span>
                  <span className="pp-cell__figure">
                    <span className="pp-cell__index">{listing.index}</span>
                    <span className="pp-cell__unit">號</span>
                  </span>
                </a>

                {listing.burst ? (
                  <Starburst className="pp-burst--cell" count={18}>
                    <span className="pp-burst__shout">{listing.burst}</span>
                  </Starburst>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- 底版：服務一覽 ---------- */}
        <section className="pp-services" aria-labelledby="pp-services-title">
          <h2 className="pp-services__title" id="pp-services-title">
            <span className="pp-services__kicker">
              {SERVICES_HEADING.kicker}
            </span>
            {SERVICES_HEADING.title}
          </h2>

          <ul className="pp-services__grid">
            {SERVICES.map((service) => (
              <li className="pp-service" key={service.code}>
                <p className="pp-service__code">{service.code}</p>
                <h3 className="pp-service__name">《{service.name}》</h3>
                <p className="pp-service__tagline">{service.tagline}</p>
                <Figure
                  figure={service.figure}
                  className="pp-figure--service"
                />
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- 報尾 ---------- */}
        <section className="pp-closing">
          <div className="pp-closing__plates">
            {CLOSING_PHOTOS.map((photo) => (
              <Plate
                key={photo.alt}
                photo={photo}
                sizes="(max-width: 680px) 92vw, 16rem"
              />
            ))}
          </div>

          <p className="pp-closing__slogan">{COLOPHON.slogan}</p>
        </section>

        <footer className="pp-colophon">
          <p className="pp-colophon__issue">
            <span>{MASTHEAD.issue}</span>
            <span>{MASTHEAD.edition}</span>
            <span>{MASTHEAD.dateline}</span>
          </p>
          <p className="pp-colophon__note">{MASTHEAD.note}</p>
          <nav className="pp-colophon__nav" aria-label="其他頁面">
            {COLOPHON.links.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}↗
                </a>
              ) : (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ),
            )}
          </nav>
          <p className="pp-colophon__publisher">{COLOPHON.publisher}</p>
        </footer>
      </div>
    </div>
  );
}
