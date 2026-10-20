"use client";

import { useEffect, useMemo, useState } from "react";

import { ALL_PRODUCTS, MENU_CATEGORIES } from "@/config/menu";
import { shippingRules } from "@/config/shipping";
import type { MenuPayload } from "@/lib/shopify/types";

import { BottomTabs } from "./BottomTabs";
import { CategoryPlate } from "./CategoryPlate";
import { CenterPlate } from "./CenterPlate";
import { useCart } from "./CartProvider";
import { ShippingRow } from "./ShippingRow";

/**
 * 餐桌。中央一只大盤，周圍八只菜盤。
 *
 * 盤子的座標是算出來的，不是一只一只寫死：每一只給一個角度（12 點鐘為 0、
 * 順時針為正），位置就是那個角度在橢圓上的點。四只在左、四只在右，左右對稱。
 *
 * 水平半徑 46、垂直半徑 41，單位都是「盤面寬度的百分之一」。垂直也用寬度當
 * 單位是刻意的——.mn-ring 開了 container-type: inline-size，所以 1cqw 就是
 * 盤面寬度的 1%，橫豎同一把尺，整桌縮放時橢圓不會被拉歪。
 *
 * 角度不是平均分八等份。中央大盤半徑 28%、菜盤半徑 6.75%，所以不相撞的條件
 * 是圓心距大於 34.75%；同時最外側那兩只不能超出盤面，也就是 |dx| + 6.75 要
 * 小於 50。兩個條件一起夾出來的角度是 ±38 / ±70 / ±110 / ±150：
 *
 *   角度    圓心距   左右最遠
 *   ±38     42.9     35.1
 *   ±70     45.4     49.9   ← 貼著邊，再往外就溢出去了
 *   ±110    45.4     49.9
 *   ±150    42.3     29.8
 *
 * 最窄的一組（±150）還留 7.5% 的空隙，換算約 87px。
 */
const RING = { rx: 46, ry: 41 } as const;

/** 跟 MENU_CATEGORIES 同順序。左右交錯往下排，所以左邊四只、右邊四只。 */
const ANGLES = [322, 38, 70, 290, 110, 250, 150, 210];

function seat(angle: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    "--dx": (RING.rx * Math.sin(rad)).toFixed(2),
    "--dy": (-RING.ry * Math.cos(rad)).toFixed(2),
  } as React.CSSProperties;
}

export function MenuTable() {
  const [menu, setMenu] = useState<MenuPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const { toast, dismissToast, error: cartError } = useCart();

  /* 商品一律即時從店上讀，不在 build 時凍起來——價格與庫存會變。 */
  useEffect(() => {
    let alive = true;
    fetch("/api/menu")
      .then(async (res) => {
        const data = (await res.json()) as MenuPayload & { error?: string };
        if (!res.ok) throw new Error(data.error ?? `讀商品回了 ${res.status}`);
        return data;
      })
      .then((data) => {
        if (alive) setMenu(data);
      })
      .catch((err: unknown) => {
        if (alive) {
          setError(err instanceof Error ? err.message : "讀不到店上的商品");
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const category = useMemo(
    () => MENU_CATEGORIES.find((c) => c.id === selected) ?? null,
    [selected],
  );

  const sectionId = selected ?? ALL_PRODUCTS.id;
  const section = menu?.sections[sectionId];

  /*
   * 現在這一盤上有沒有 KALI。照品名認，不是認分類代號——
   * KALI 哪天換到別的 collection，這裡還是會對。
   */
  const browsingKali = useMemo(
    () =>
      (section?.products ?? []).some((p) =>
        p.title.includes(shippingRules.kaliSeparate.keyword),
      ),
    [section],
  );

  return (
    <div className="mn-table">
      <div className="mn-ring">
        <CenterPlate
          category={category}
          section={section}
          loading={loading}
          error={error}
        />

        {/* 看不見，但讀螢幕的人要知道這一圈盤子是什麼。 */}
        <h2 className="mn-vh" id="mn-plates-title">
          商品分類
        </h2>
        <ul aria-labelledby="mn-plates-title" className="mn-plates">
          {MENU_CATEGORIES.map((cat, i) => (
            <CategoryPlate
              category={cat}
              key={cat.id}
              selected={selected === cat.id}
              onSelect={(id) => setSelected((prev) => (prev === id ? null : id))}
              style={seat(ANGLES[i])}
            />
          ))}
        </ul>
      </div>

      <ShippingRow browsingKali={browsingKali} />
      <BottomTabs />

      {/* 加入成功的小提示。role=status 才會被讀出來，又不會搶走焦點。 */}
      <div className="mn-toast" data-on={toast ? "" : undefined} role="status">
        {toast && (
          <button type="button" onClick={dismissToast}>
            {toast}
          </button>
        )}
      </div>

      {cartError && (
        <p className="mn-toast mn-toast--bad" data-on="" role="alert">
          {cartError}
        </p>
      )}
    </div>
  );
}
