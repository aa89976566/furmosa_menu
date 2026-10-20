"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { shippingRules } from "@/config/shipping";
import { toNumber } from "@/lib/money";
import type { Cart } from "@/lib/shopify/types";

/**
 * 全站唯一的購物車狀態。
 *
 * 這裡不存商品、不自己加總。小計、件數與 checkoutUrl 都是 Shopify 回的，
 * 這一層只保管 cartId（放 localStorage，所以重新整理還在同一個車）
 * 並把 Shopify 回來的最新狀態廣播出去。
 */

const CART_ID_KEY = "furmosa.cartId";

type CartRequest =
  | { action: "get"; cartId: string }
  | { action: "create"; variantId?: string; quantity?: number }
  | { action: "add"; cartId: string; variantId: string; quantity?: number }
  | { action: "update"; cartId: string; lineId: string; quantity: number }
  | { action: "remove"; cartId: string; lineId: string };

type CartContextValue = {
  cart: Cart | null;
  /** 第一次讀車還沒回來。 */
  loading: boolean;
  /** 有一個寫入動作正在跑（加入、改量、移除）。 */
  busy: boolean;
  error: string | null;
  /** 剛加入成功的商品名，用來跳那個小提示。 */
  toast: string | null;
  dismissToast: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (variantId: string, title: string, quantity?: number) => Promise<void>;
  setQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  /** 小計（數字），給免運進度用。 */
  subtotal: number;
  totalQuantity: number;
  currency: string;
  /** 購物車裡雞霸的總件數，給那條滿件免運的提示用。 */
  cutletQuantity: number;
  /** 購物車裡有沒有 KALI，給那條另行出貨的提示用。 */
  hasKali: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart 必須放在 CartProvider 裡面");
  return ctx;
}

async function callCart(body: CartRequest): Promise<{ cart: Cart | null }> {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { cart?: Cart | null; error?: string };
  if (!res.ok) throw new Error(data.error ?? `購物車回了 ${res.status}`);
  return { cart: data.cart ?? null };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const remember = useCallback((next: Cart | null) => {
    setCart(next);
    if (typeof window === "undefined") return;
    if (next) window.localStorage.setItem(CART_ID_KEY, next.id);
    else window.localStorage.removeItem(CART_ID_KEY);
  }, []);

  /* 開頁先把上次的車接回來。接不回來（過期、結掉了）就讓它維持空的，
     等使用者真的加第一件再建新的——不要一開頁就在店上建一堆空車。 */
  useEffect(() => {
    let alive = true;
    const saved = window.localStorage.getItem(CART_ID_KEY);
    /* 沒存過 id 時也走同一條 promise，收尾只有一處，而且不會在 effect 裡
       同步 setState（同步設會多跑一輪 render，lint 也會擋）。 */
    const read = saved
      ? callCart({ action: "get", cartId: saved })
      : Promise.resolve({ cart: null });
    read
      .then(({ cart: got }) => {
        if (!alive) return;
        if (got) setCart(got);
        else if (saved) window.localStorage.removeItem(CART_ID_KEY);
      })
      .catch(() => {
        if (alive) window.localStorage.removeItem(CART_ID_KEY);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const flash = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  /** 寫入動作統一走這裡：同一時間只跑一個，錯誤統一收。 */
  const run = useCallback(
    async (job: () => Promise<Cart | null>) => {
      setBusy(true);
      setError(null);
      try {
        remember(await job());
      } catch (err) {
        setError(err instanceof Error ? err.message : "操作失敗，請再試一次");
      } finally {
        setBusy(false);
      }
    },
    [remember],
  );

  const addItem = useCallback(
    async (variantId: string, title: string, quantity = 1) => {
      await run(async () => {
        // 還沒有車就連著第一件一起建，省一趟往返。
        if (!cart) {
          const { cart: made } = await callCart({
            action: "create",
            variantId,
            quantity,
          });
          return made;
        }
        const { cart: next } = await callCart({
          action: "add",
          cartId: cart.id,
          variantId,
          quantity,
        });
        return next;
      });
      flash(`已加入 ${title}`);
    },
    [cart, flash, run],
  );

  const setQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      await run(async () => {
        const { cart: next } = await callCart({
          action: "update",
          cartId: cart.id,
          lineId,
          quantity,
        });
        return next;
      });
    },
    [cart, run],
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      await run(async () => {
        const { cart: next } = await callCart({
          action: "remove",
          cartId: cart.id,
          lineId,
        });
        return next;
      });
    },
    [cart, run],
  );

  const value = useMemo<CartContextValue>(() => {
    const lines = cart?.lines ?? [];
    const cutletQuantity = lines
      .filter((l) => l.title.includes(shippingRules.cutletFreeShipping.keyword))
      .reduce((sum, l) => sum + l.quantity, 0);

    return {
      cart,
      loading,
      busy,
      error,
      toast,
      dismissToast: () => setToast(null),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addItem,
      setQuantity,
      removeItem,
      subtotal: toNumber(cart?.subtotal),
      totalQuantity: cart?.totalQuantity ?? 0,
      currency: cart?.subtotal.currencyCode ?? shippingRules.freeShipping.currency,
      cutletQuantity,
      hasKali: lines.some((l) =>
        l.title.includes(shippingRules.kaliSeparate.keyword),
      ),
    };
  }, [
    addItem,
    busy,
    cart,
    drawerOpen,
    error,
    loading,
    removeItem,
    setQuantity,
    toast,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
