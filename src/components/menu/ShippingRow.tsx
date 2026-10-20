"use client";

import { shippingRules } from "@/config/shipping";

import { useCart } from "./CartProvider";

/**
 * 中央大盤下面那一行運送資訊。
 *
 * 固定那幾格來自 shippingRules.lines，verified 為 false 的不排。
 *
 * 另外兩條是看車的內容才出現的，兩條的門檻與文案都在 shippingRules 裡，
 * 這裡一個數字都不寫：
 *   - 雞霸滿件：車上雞霸夠 6 片就顯示已符合，還差幾片就顯示還差幾片。
 *     件數照品名認（keyword），不是認商品 ID。
 *   - KALI：車上有 KALI 就提醒另行出貨。
 */
export function ShippingRow() {
  const { cutletQuantity, hasKali } = useCart();

  const cutlet = shippingRules.cutletFreeShipping;
  const kali = shippingRules.kaliSeparate;

  const cutletMet = cutlet.verified && cutletQuantity >= cutlet.quantity;
  const cutletLeft = cutlet.quantity - cutletQuantity;
  const cutletPending =
    cutlet.verified && cutletQuantity > 0 && cutletLeft > 0;

  const showKali = kali.verified && hasKali;

  return (
    <div className="mn-ship">
      <p className="mn-ship__row">
        {shippingRules.lines
          .filter((line) => line.verified)
          .map((line, i) => (
            <span className="mn-ship__cell" key={line.id}>
              {i > 0 && (
                <span className="mn-ship__sep" aria-hidden="true">
                  ｜
                </span>
              )}
              {line.text}
            </span>
          ))}
      </p>

      {(cutletMet || cutletPending) && (
        <p className="mn-ship__flag" data-tone={cutletMet ? "good" : "warn"}>
          {cutletMet ? cutlet.text : cutlet.pending(cutletLeft)}
        </p>
      )}

      {showKali && (
        <p className="mn-ship__flag" data-tone="warn">
          {kali.text}
        </p>
      )}
    </div>
  );
}
