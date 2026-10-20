"use client";

import Image from "next/image";

import type { MenuCategory } from "@/config/menu";

/**
 * 一只分類菜盤。整只是一顆按鈕——點了換中央大盤，不跳頁。
 *
 * 盤面是 CSS 畫的圓（底色＋一圈白鍋緣），商品照放在圓形容器裡
 * 用 object-fit: cover 裁。選中的那一只有紅外框、而且會放大。
 */
export function CategoryPlate({
  category,
  selected,
  onSelect,
  style,
}: {
  category: MenuCategory;
  selected: boolean;
  onSelect: (id: string) => void;
  style?: React.CSSProperties;
}) {
  return (
    <li className="mn-plate" style={style}>
      <button
        type="button"
        className="mn-plate__btn"
        data-on={selected ? "" : undefined}
        data-fit={category.fit}
        onClick={() => onSelect(category.id)}
        aria-pressed={selected}
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
            src={category.art}
            alt={category.alt}
            sizes="(max-width: 860px) 120px, 260px"
            placeholder="blur"
          />
        </span>
        <span className="mn-plate__tag">{category.label}</span>
      </button>
    </li>
  );
}
