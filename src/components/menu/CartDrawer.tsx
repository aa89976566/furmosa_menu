"use client";

import { useEffect, useRef } from "react";

import {
  freeShippingProgress,
  remainingForFreeShipping,
  shippingRules,
} from "@/config/shipping";
import { formatAmount, formatMoney } from "@/lib/money";
import { SHOP_ALL_URL } from "@/lib/shopify/cart";

import { useCart } from "./CartProvider";

/**
 * 右側滑出的購物車。
 *
 * 裡面每一行都是 Shopify 的 cart line：改數量走 cartLinesUpdate、
 * 移除走 cartLinesRemove，小計由 Shopify 重算。結帳按鈕連的是
 * cart.checkoutUrl，也就是店上那一個車的結帳頁——不會另外生一個車。
 */
export function CartDrawer() {
  const {
    cart,
    drawerOpen,
    closeDrawer,
    setQuantity,
    removeItem,
    busy,
    error,
    subtotal,
    currency,
  } = useCart();

  const panel = useRef<HTMLDivElement>(null);

  /* Esc 關掉，開著的時候底下不要跟著滾。 */
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [closeDrawer, drawerOpen]);

  const lines = cart?.lines ?? [];
  const remaining = remainingForFreeShipping(subtotal);
  const reached = remaining === 0 && subtotal > 0;

  return (
    <div className="mn-drawer" data-open={drawerOpen ? "" : undefined}>
      <button
        type="button"
        className="mn-drawer__veil"
        onClick={closeDrawer}
        tabIndex={drawerOpen ? 0 : -1}
        aria-label="關閉購物車"
      />
      <div
        className="mn-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label="購物車"
        ref={panel}
        tabIndex={-1}
      >
        <header className="mn-drawer__head">
          <h2 className="mn-drawer__title">購物車</h2>
          <button
            type="button"
            className="mn-drawer__close"
            onClick={closeDrawer}
          >
            關閉
          </button>
        </header>

        <div className="mn-drawer__ship">
          <p className="mn-drawer__shipText">
            {reached
              ? shippingRules.freeShipping.reached
              : shippingRules.freeShipping.away(
                  formatAmount(remaining, currency),
                )}
          </p>
          <span className="mn-drawer__meter">
            <span
              className="mn-drawer__fill"
              data-full={reached ? "" : undefined}
              style={{
                transform: `scaleX(${freeShippingProgress(subtotal)})`,
              }}
            />
          </span>
        </div>

        {error && <p className="mn-drawer__error">{error}</p>}

        {lines.length === 0 ? (
          <div className="mn-drawer__empty">
            <p>車上還沒有東西。</p>
            <a href={SHOP_ALL_URL} target="_blank" rel="noopener noreferrer">
              去店上看全部商品
            </a>
          </div>
        ) : (
          <ul className="mn-drawer__list">
            {lines.map((line) => (
              <li className="mn-line" key={line.id}>
                <span className="mn-line__disc">
                  {line.image ? (
                    /* 這是 Shopify CDN 上的圖，尺寸由 CDN 參數決定，
                       所以用 img 不用 next/image。 */
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${line.image.url}${line.image.url.includes("?") ? "&" : "?"}width=200`}
                      alt={line.image.altText ?? line.title}
                      width={200}
                      height={200}
                      loading="lazy"
                    />
                  ) : null}
                </span>

                <div className="mn-line__body">
                  <p className="mn-line__name">{line.title}</p>
                  {line.variantTitle && (
                    <p className="mn-line__variant">{line.variantTitle}</p>
                  )}
                  <p className="mn-line__unit">
                    單價 {formatMoney(line.unitPrice)}
                  </p>

                  <div className="mn-line__foot">
                    <div className="mn-step">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(line.id, line.quantity - 1)
                        }
                        disabled={busy}
                        aria-label={`減少 ${line.title} 的數量`}
                      >
                        −
                      </button>
                      <span aria-live="polite">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(line.id, line.quantity + 1)
                        }
                        disabled={busy}
                        aria-label={`增加 ${line.title} 的數量`}
                      >
                        ＋
                      </button>
                    </div>
                    <p className="mn-line__total">
                      {formatMoney(line.lineTotal)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mn-line__remove"
                  onClick={() => removeItem(line.id)}
                  disabled={busy}
                  aria-label={`移除 ${line.title}`}
                >
                  移除
                </button>
              </li>
            ))}
          </ul>
        )}

        {cart && lines.length > 0 && (
          <footer className="mn-drawer__foot">
            <p className="mn-drawer__sum">
              <span>小計</span>
              <strong>{formatMoney(cart.subtotal)}</strong>
            </p>
            <p className="mn-drawer__note">運費與折扣在結帳頁計算。</p>
            <a className="mn-drawer__checkout" href={cart.checkoutUrl}>
              前往結帳
            </a>
          </footer>
        )}
      </div>
    </div>
  );
}
