import { Fragment } from "react";

import Photo from "@/components/real-food/Photo";
import type { Chapter } from "@/data/real-food";

/**
 * 海報上的格位編排，名稱對應它在紙上的形狀：
 * - stack：照片與黃標籤並排，直書本文落在照片下方（第一帶的兩格）
 * - row：照片｜本文｜標籤 由左而右並置（第二帶左格）
 * - copy：只有本文與標籤，照片是同一帶裡的另一格（第三帶右格）
 * - wide：照片｜本文｜標籤｜小照片，吃掉整條帶（第四帶）
 * - trio：三張同寬的照片｜本文｜標籤，用在製程這種有順序的圖
 * - duo：兩張同寬的照片｜本文｜標籤，用在公益帶之後往下接的七帶
 */
export type PanelVariant = "stack" | "row" | "copy" | "wide" | "trio" | "duo";

type PanelProps = {
  chapter: Chapter;
  variant: PanelVariant;
  /** 版面寬度提示；copy 變體沒有照片，可以不給。 */
  sizes?: string;
  asideSizes?: string;
  className?: string;
  priority?: boolean;
};

export default function Panel({
  chapter,
  variant,
  sizes,
  asideSizes,
  className,
  priority = false,
}: PanelProps) {
  const [lead, aside, third] = chapter.photos;
  const headingId = `rf-panel-${chapter.id}`;
  const classes = ["rf-panel", `rf-panel--${variant}`];
  if (className) classes.push(className);

  const columns = chapter.tag.map((column, index) => (
    <span key={column} className={index === 0 ? "rf-tag__main" : "rf-tag__sub"}>
      {column}
    </span>
  ));

  return (
    <article
      className={classes.join(" ")}
      aria-labelledby={headingId}
      data-rf-reveal="out"
    >
      {variant !== "copy" && sizes ? (
        <Photo
          photo={lead}
          className="rf-photo--lead"
          sizes={sizes}
          priority={priority}
        />
      ) : null}

      {/*
        黃色直書標籤同時是這一格的標題。照報紙的標題分級：第一欄是主標，
        後面的欄是副標，字級小一號。一欄就是一個色塊，所以長短欄各自斷開，
        欄距也由版面決定——擠在一起的話，相鄰兩欄的色塊會疊到彼此的字上。
      */}
      <h2 className="rf-tag" id={headingId}>
        {chapter.href ? (
          <a
            className="rf-tag__link"
            href={chapter.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {columns}
          </a>
        ) : (
          columns
        )}
      </h2>

      <p className="rf-lines">
        {chapter.lines.map((line, index) => (
          <Fragment key={line}>
            {index > 0 ? <br /> : null}
            {line}
          </Fragment>
        ))}
      </p>

      {(variant === "wide" || variant === "trio" || variant === "duo") &&
      aside ? (
        <Photo
          photo={aside}
          className="rf-photo--aside"
          sizes={asideSizes ?? sizes ?? "33vw"}
        />
      ) : null}

      {variant === "trio" && third ? (
        <Photo
          photo={third}
          className="rf-photo--third"
          sizes={asideSizes ?? sizes ?? "33vw"}
        />
      ) : null}
    </article>
  );
}
