import { NextResponse } from "next/server";

import {
  addLines,
  createCart,
  getCart,
  removeLine,
  updateLine,
} from "@/lib/shopify/cart";
import { StorefrontError, isConfigured } from "@/lib/shopify/storefront";

/**
 * 購物車的唯一通道。瀏覽器只送「要做什麼」，cartId 由瀏覽器保管
 * （localStorage），token 留在這裡。
 *
 * 車永遠是 Shopify 那一個：回傳的小計、件數與 checkoutUrl 全部是
 * Shopify 算的，這一層不加總、不暫存、不自己記商品。
 */

export const dynamic = "force-dynamic";

type Action =
  | { action: "get"; cartId: string }
  | { action: "create"; variantId?: string; quantity?: number }
  | { action: "add"; cartId: string; variantId: string; quantity?: number }
  | { action: "update"; cartId: string; lineId: string; quantity: number }
  | { action: "remove"; cartId: string; lineId: string };

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  if (!isConfigured()) {
    return bad("SHOPIFY_STOREFRONT_TOKEN 沒有設定", 503);
  }

  let body: Action;
  try {
    body = (await request.json()) as Action;
  } catch {
    return bad("送來的不是 JSON");
  }

  try {
    switch (body.action) {
      case "get": {
        if (!body.cartId) return bad("少了 cartId");
        const cart = await getCart(body.cartId);
        // null 表示車已經過期或結掉了，前端要丟掉舊的 cartId。
        return NextResponse.json({ cart });
      }
      case "create": {
        const lines = body.variantId
          ? [
              {
                merchandiseId: body.variantId,
                quantity: Math.max(1, body.quantity ?? 1),
              },
            ]
          : [];
        return NextResponse.json({ cart: await createCart(lines) });
      }
      case "add": {
        if (!body.cartId || !body.variantId) return bad("少了 cartId 或 variantId");
        const cart = await addLines(body.cartId, [
          {
            merchandiseId: body.variantId,
            quantity: Math.max(1, body.quantity ?? 1),
          },
        ]);
        return NextResponse.json({ cart });
      }
      case "update": {
        if (!body.cartId || !body.lineId) return bad("少了 cartId 或 lineId");
        // 數量砍到 0 就是移除，Shopify 的 cartLinesUpdate 吃得下 0。
        const qty = Math.max(0, body.quantity);
        return NextResponse.json({
          cart: await updateLine(body.cartId, body.lineId, qty),
        });
      }
      case "remove": {
        if (!body.cartId || !body.lineId) return bad("少了 cartId 或 lineId");
        return NextResponse.json({
          cart: await removeLine(body.cartId, body.lineId),
        });
      }
      default:
        return bad("不認得這個 action");
    }
  } catch (err) {
    const status = err instanceof StorefrontError ? err.status : 502;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "購物車操作失敗" },
      { status },
    );
  }
}
