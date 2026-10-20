import type { Metadata } from "next";

import "./menu.css";

import { CartDrawer } from "@/components/menu/CartDrawer";
import { CartProvider } from "@/components/menu/CartProvider";
import { MenuTable } from "@/components/menu/MenuTable";
import { TopBar } from "@/components/menu/TopBar";

export const metadata: Metadata = {
  title: "匠寵 FURMOSA｜寵物餐桌",
  description:
    "一張寵物餐桌：中央大盤是現在選的分類，周圍八只菜盤是分類入口，加入購物車直接進 Shopify 的車。",
};

/**
 * 首頁。一張寵物餐桌，而且是真的能操作的——
 * 八只菜盤各自是一個 Shopify collection，點了換中央大盤的商品；
 * 中央每一份都能直接加進購物車，加完頂端那條免運進度就會動。
 *
 * 這一頁刻意只有這一件事：沒有 hero、沒有品牌長文、沒有九宮格、
 * 沒有 FAQ、沒有輪播、沒有一般電商的頁尾。
 *
 * 整頁包在 CartProvider 裡，所以頂端那條、中央的加入按鈕與右側的抽屜
 * 讀的是同一個車——不會有第二個。
 */
export default function Home() {
  return (
    <CartProvider>
      <main className="mn-page">
        <div className="mn-grain" aria-hidden="true" />
        <TopBar />
        <MenuTable />
      </main>
      <CartDrawer />
    </CartProvider>
  );
}
