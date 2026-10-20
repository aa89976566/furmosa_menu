import { NextResponse } from "next/server";

import { loadMenu } from "@/lib/shopify/menu";
import { StorefrontError, isConfigured } from "@/lib/shopify/storefront";

/**
 * 八只盤子的商品。走 server 是為了讓 token 留在 server——
 * Storefront 的 public token 本來就能放瀏覽器，但集中在這裡比較好管，
 * 而且商品可以在這一層快取，不用每個訪客都去打店上。
 */
export const revalidate = 300;

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "SHOPIFY_STOREFRONT_TOKEN 沒有設定" },
      { status: 503 },
    );
  }
  try {
    return NextResponse.json(await loadMenu(), {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
    });
  } catch (err) {
    const status = err instanceof StorefrontError ? err.status : 502;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "讀商品失敗" },
      { status },
    );
  }
}
