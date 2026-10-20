"use client";

import { shippingRules } from "@/config/shipping";

import { useCart } from "./CartProvider";

/**
 * 中央大盤下面那一行運送資訊。
 *
 * 固定那幾格來自 shippingRules.lines，verified 為 false 的不排——
 * 參考圖上的「7-11 六片雞霸免運」站上查不到，所以預設不出現。
 *
 * 另外兩條是看車的內容才出現的：
 *   - 雞霸滿件：件數與文案都在 shippingRules.cutletFreeShipping 裡。
 *     同樣因為站上查不到這個規則，verified 是 false、預設不顯示；
 *     規則真的上線時把 verified 改成 true 就會跟著動。
 *   - KALI：車上有 KALI 就提醒另行出貨。這一條站上查得到，所以是 true。
 */
export function ShippingRow({ browsingKali }: { browsingKali: boolean }) {
  const { cutletQuantity, hasKali } = useCart();

  const cutlet = shippingRules.cutletFreeShipping;
  const kali = shippingRules.kaliSeparate;

  const cutletMet = cutlet.verified && cutletQuantity >= cutlet.quantity;
  const cutletLeft = cutlet.quantity - cutletQuantity;
  const cutletPending =
    cutlet.verified && cutletQuantity > 0 && cutletLeft > 0;

  // 看到 KALI 那只盤子、或車上已經有 KALI，都要提醒。
  const showKali = kali.verified && (browsingKali || hasKali);

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
