"use client";

import type { ShowcaseCategory } from "@/config/categories";

/**
 * 中央那只灰色的圓台。
 *
 * 這裡刻意是一個抽象的台子，不是碗、不是盤子裡裝了什麼——上面只放三件事：
 * 分類名、那一句狗的內心話、還有一個很淡的「查看商品 →」。沒有別的。
 *
 * 換分類時整塊用 key 重建，所以那一下淡入上移會重跑。字短、行高鬆，
 * 遠一點看也讀得完。
 */
export function CenterStage({ category }: { category: ShowcaseCategory }) {
  return (
    <div className="mn-center">
      <div className="mn-center__rim" aria-hidden="true" />
      <div className="mn-center__ticks" aria-hidden="true" />

      {/*
        aria-live 是給鍵盤與讀螢幕的人用的：focus 在盤子上移動時中央會換字，
        但焦點沒有跑過來，不播一次就不知道換了什麼。
      */}
      <div className="mn-stage" aria-live="polite">
        <div className="mn-stage__slide" key={category.id}>
          <p className="mn-stage__label">{category.label}</p>
          <p className="mn-stage__os" id="mn-stage-os">
            {category.osText}
          </p>
          <a
            className="mn-stage__cta"
            href={category.productUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            查看商品
            <span aria-hidden="true"> →</span>
          </a>
        </div>
      </div>
    </div>
  );
}
