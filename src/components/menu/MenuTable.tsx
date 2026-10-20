"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

import {
  DEFAULT_CATEGORY_ID,
  SHOWCASE_CATEGORIES,
} from "@/config/categories";

import { BottomTabs } from "./BottomTabs";
import { CategoryPlate } from "./CategoryPlate";
import { CenterStage } from "./CenterStage";
import { useCart } from "./CartProvider";
import { ShippingRow } from "./ShippingRow";

/**
 * 餐桌。中央一只灰色圓台，周圍八只菜盤。
 *
 * 盤子的座標是算出來的，不是一只一只寫死：每一只給一個角度（12 點鐘為 0、
 * 順時針為正），位置就是那個角度在橢圓上的點。四只在左、四只在右，左右對稱。
 *
 * 水平半徑 46、垂直半徑 41，單位都是「盤面寬度的百分之一」。垂直也用寬度當
 * 單位是刻意的——.mn-ring 開了 container-type: inline-size，所以 1cqw 就是
 * 盤面寬度的 1%，橫豎同一把尺，整桌縮放時橢圓不會被拉歪。
 *
 * 角度不是平均分八等份。中央圓台半徑 30%、菜盤半徑 6.75%，所以不相撞的條件
 * 是圓心距大於 36.75%；同時最外側那兩只不能超出盤面，也就是 |dx| + 6.75 要
 * 小於 50。兩個條件一起夾出來的角度是 ±38 / ±70 / ±110 / ±150：
 *
 *   角度    圓心距   左右最遠
 *   ±38     42.9     35.1
 *   ±70     45.4     49.9   ← 貼著邊，再往外就溢出去了
 *   ±110    45.4     49.9
 *   ±150    42.3     29.8
 *
 * 最窄的一組（±150）還留 5.55% 的空隙，換算約 64px。
 */
const RING = { rx: 46, ry: 41 } as const;

/** 跟 SHOWCASE_CATEGORIES 同順序。左右交錯往下排，所以左邊四只、右邊四只。 */
const ANGLES = [322, 38, 70, 290, 110, 250, 150, 210];

function seat(angle: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    "--dx": (RING.rx * Math.sin(rad)).toFixed(2),
    "--dy": (-RING.ry * Math.cos(rad)).toFixed(2),
  } as React.CSSProperties;
}

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

/**
 * 這台裝置到底能不能 hover。
 *
 * 用 useSyncExternalStore 而不是 useEffect 裡 setState：後者會多跑一輪 render
 * （lint 也會擋），而且插上滑鼠、拔掉滑鼠時這個值會變，本來就該當成外部狀態訂閱。
 * server 端一律回 true——猜能 hover 比較保險，第一次 hydrate 完就會修正，
 * 而且猜錯的代價只是手機上第一下點擊直接跳頁，不是壞掉。
 */
function useCanHover(): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(HOVER_QUERY);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(HOVER_QUERY).matches,
    () => true,
  );
}

export function MenuTable() {
  /* 一定有一只是亮的，開頁是雞霸。滑開、點別處都不會變回「沒有選」。 */
  const [activeId, setActiveId] = useState(DEFAULT_CATEGORY_ID);
  const canHover = useCanHover();

  const { toast, dismissToast, error: cartError } = useCart();

  const active = useMemo(
    () =>
      SHOWCASE_CATEGORIES.find((c) => c.id === activeId) ??
      SHOWCASE_CATEGORIES[0],
    [activeId],
  );

  const activate = useCallback((id: string) => setActiveId(id), []);

  return (
    <div className="mn-table">
      <div className="mn-ring">
        <CenterStage category={active} />

        {/* 看不見，但讀螢幕的人要知道這一圈盤子是什麼。 */}
        <h2 className="mn-vh" id="mn-plates-title">
          商品分類
        </h2>
        <ul aria-labelledby="mn-plates-title" className="mn-plates">
          {SHOWCASE_CATEGORIES.map((cat, i) => (
            <CategoryPlate
              active={cat.id === activeId}
              canHover={canHover}
              category={cat}
              key={cat.id}
              onActivate={activate}
              style={seat(ANGLES[i])}
            />
          ))}
        </ul>
      </div>

      <ShippingRow />
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
