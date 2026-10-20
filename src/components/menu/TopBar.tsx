"use client";

import {
  freeShippingProgress,
  remainingForFreeShipping,
  shippingRules,
} from "@/config/shipping";
import { formatAmount } from "@/lib/money";

import { useCart } from "./CartProvider";

/**
 * 最上面那條固定的細長條。
 *
 * 左邊是免運進度。數字不是寫死的——小計來自 Shopify 的
 * cart.cost.subtotalAmount，門檻來自 shippingRules，還差多少就是需求寫的
 * max(0, 門檻 − 小計)。滿了就換成「已達宅配免運」。
 *
 * 右邊是購物車，件數與金額也都是 Shopify 回的。
 */
export function TopBar() {
  const {
    subtotal,
    totalQuantity,
    currency,
    cart,
    openDrawer,
    loading,
    drawerOpen,
  } = useCart();

  const remaining = remainingForFreeShipping(subtotal);
  const reached = remaining === 0 && subtotal > 0;
  const progress = freeShippingProgress(subtotal);

  return (
    <div className="mn-bar">
      <div className="mn-bar__inner">
        <p className="mn-bar__ship">
          <span className="mn-bar__text">
            {reached
              ? shippingRules.freeShipping.reached
              : shippingRules.freeShipping.away(
                  formatAmount(remaining, currency),
                )}
          </span>
          {/*
            進度槽。參考圖上緣就有一條金色的槽，這一版讓它真的動。
            aria 讓讀螢幕的人也拿得到同一組數字。
          */}
          <span
            className="mn-bar__meter"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={shippingRules.freeShipping.threshold}
            aria-valuenow={Math.min(
              subtotal,
              shippingRules.freeShipping.threshold,
            )}
            aria-label="宅配免運進度"
          >
            <span
              className="mn-bar__fill"
              data-full={reached ? "" : undefined}
              style={{ transform: `scaleX(${progress})` }}
            />
          </span>
        </p>

        <button
          type="button"
          className="mn-bar__cart"
          onClick={openDrawer}
          aria-haspopup="dialog"
          aria-expanded={drawerOpen}
        >
          <CartGlyph />
          <span>購物車</span>
          {totalQuantity > 0 && (
            <>
              <span className="mn-bar__count">{totalQuantity} 件</span>
              <span className="mn-bar__sep" aria-hidden="true">
                ｜
              </span>
              <span>{formatAmount(subtotal, currency)}</span>
            </>
          )}
          {totalQuantity === 0 && !loading && !cart && (
            <span className="mn-bar__count mn-bar__count--empty">空的</span>
          )}
        </button>
      </div>
    </div>
  );
}

function CartGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="mn-bar__icon" aria-hidden="true">
      <path
        d="M2 3h3.2l1 3.4M7.6 9.8h11.1l1.6-5.1H6.2M7.6 9.8 6.2 4.7M7.6 9.8l1.2 4.1h9.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.6" cy="19" r="1.8" fill="currentColor" />
      <circle cx="17.6" cy="19" r="1.8" fill="currentColor" />
    </svg>
  );
}
