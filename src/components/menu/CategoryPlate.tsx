"use client";

import Image from "next/image";

import type { ShowcaseCategory } from "@/config/categories";

/**
 * 一只分類菜盤。
 *
 * 是一個 <a>，不是 button——按下去真的會去商品頁，所以要讓人能在新分頁開、
 * 能複製連結、能被搜尋引擎看到。
 *
 * 亮起來的方式分三種，但結果只有一個「現在是這一只」：
 *   - 滑鼠移過去（只有真的能 hover 的裝置算）
 *   - 鍵盤 focus 過來
 *   - 手指點一下
 *
 * 手指那一下不會直接跳頁。沒有 hover 的裝置上，第一下是「選這一只」，
 * 選中後再點才去商品頁；不然手機上永遠看不到中央那句話。這也是為什麼
 * canHover 要從 matchMedia 真的問，而不是看螢幕寬度——平板接了滑鼠一樣能 hover。
 */
export function CategoryPlate({
  category,
  active,
  canHover,
  onActivate,
  style,
}: {
  category: ShowcaseCategory;
  active: boolean;
  canHover: boolean;
  onActivate: (id: string) => void;
  style?: React.CSSProperties;
}) {
  return (
    <li className="mn-plate" style={style}>
      <a
        className="mn-plate__btn"
        href={category.productUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-on={active ? "" : undefined}
        data-fit={category.fit}
        /* 中央那塊的內容是這只盤子描述的，所以兩邊用 aria 綁起來。 */
        aria-describedby={active ? "mn-stage-os" : undefined}
        onMouseEnter={canHover ? () => onActivate(category.id) : undefined}
        onFocus={() => onActivate(category.id)}
        onClick={(e) => {
          if (!canHover && !active) {
            e.preventDefault();
            onActivate(category.id);
          }
        }}
      >
        <span
          className="mn-plate__disc"
          data-tone={category.tone}
          style={
            category.cut
              ? ({ "--cut": category.cut } as React.CSSProperties)
              : undefined
          }
        >
          <Image
            src={category.image}
            alt={category.alt}
            sizes="(max-width: 860px) 130px, 260px"
            placeholder="blur"
          />
        </span>
        <span className="mn-plate__tag">{category.label}</span>
      </a>
    </li>
  );
}
