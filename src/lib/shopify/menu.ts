import {
  ALL_PRODUCTS,
  FEATURED_LIMIT,
  MENU_CATEGORIES,
  SHOP_ORIGIN,
  type MenuCategory,
} from "@/config/menu";

import { storefront } from "./storefront";
import type { MenuPayload, MenuProduct, MenuSection } from "./types";

/**
 * 一次把八只盤子要的商品全部抓回來。
 *
 * 八只盤子只對到六個 collection（肉乾與凍乾共用「寵物零食與凍乾」，
 * 換罐補給沒有 collection），所以查詢是六個 alias 加一個全店，一趟打完，
 * 不是一只盤子打一次。
 *
 * 每一個 collection 都抓 60 筆再在這裡濾。店上最大的 collection 是 33 件，
 * 60 筆一定蓋得完——分頁的話濾出來的結果會缺東西。
 *
 * 排序一律用 BEST_SELLING。中央大盤只擺三份，哪三份不該由我挑，交給店上
 * 真實的銷售資料決定；collection 自己的手動排序不一定有在維護。
 */

const PRODUCT_FIELDS = `
  handle
  title
  availableForSale
  featuredImage { url altText width height }
  variants(first: 1) {
    nodes {
      id
      title
      availableForSale
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
    }
  }
`;

type RawVariant = {
  id: string;
  title: string | null;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string; currencyCode: string } | null;
};

type RawProduct = {
  handle: string;
  title: string;
  availableForSale: boolean;
  featuredImage: {
    url: string;
    altText: string | null;
    width: number;
    height: number;
  } | null;
  variants: { nodes: RawVariant[] };
};

type RawBucket = { products: { nodes: RawProduct[] } } | null;

/** 盤子共用 collection，所以先去重，不要同一個 handle 查兩次。 */
function distinctHandles(): string[] {
  const seen = new Set<string>();
  for (const cat of MENU_CATEGORIES) {
    if (cat.collection) seen.add(cat.collection);
  }
  return [...seen];
}

function buildQuery(handles: string[]): string {
  const buckets = handles
    .map(
      (_, i) => `
      c${i}: collection(handle: $h${i}) {
        products(first: 60, sortKey: BEST_SELLING) {
          nodes { ${PRODUCT_FIELDS} }
        }
      }`,
    )
    .join("\n");

  const args = handles.map((_, i) => `$h${i}: String!`).join(", ");

  return `
    query MenuProducts(${args}) {
      shop { paymentSettings { currencyCode } }
      all: products(first: 60, sortKey: BEST_SELLING) {
        nodes { ${PRODUCT_FIELDS} }
      }
      ${buckets}
    }
  `;
}

function toMenuProduct(p: RawProduct): MenuProduct | null {
  const variant = p.variants.nodes[0];
  // 沒有 variant 就加不進購物車，寧可不顯示也不要給一顆按不動的按鈕。
  if (!variant) return null;
  return {
    variantId: variant.id,
    productHandle: p.handle,
    title: p.title,
    variantTitle: variant.title,
    price: variant.price,
    compareAtPrice: variant.compareAtPrice,
    image: p.featuredImage,
    availableForSale: p.availableForSale && variant.availableForSale,
    url: `${SHOP_ORIGIN}/products/${p.handle}`,
  };
}

function matchesFilter(p: MenuProduct, cat: MenuCategory): boolean {
  const f = cat.filter;
  if (!f) return true;
  if (f.titleIncludes && !p.title.includes(f.titleIncludes)) return false;
  if (f.titleExcludes && p.title.includes(f.titleExcludes)) return false;
  return true;
}

/** 有貨的排前面。缺貨的還是留著，但會排在後面、按鈕是停用的。 */
function featured(products: MenuProduct[]): MenuProduct[] {
  return [...products]
    .sort((a, b) => Number(b.availableForSale) - Number(a.availableForSale))
    .slice(0, FEATURED_LIMIT);
}

export async function loadMenu(): Promise<MenuPayload> {
  const handles = distinctHandles();
  const variables = Object.fromEntries(
    handles.map((h, i) => [`h${i}`, h]),
  ) as Record<string, string>;

  const data = await storefront<
    Record<string, RawBucket | { nodes: RawProduct[] } | unknown> & {
      shop: { paymentSettings: { currencyCode: string } };
      all: { nodes: RawProduct[] };
    }
  >(buildQuery(handles), variables);

  const byHandle = new Map<string, MenuProduct[]>();
  handles.forEach((h, i) => {
    const bucket = data[`c${i}`] as RawBucket;
    const list = (bucket?.products.nodes ?? [])
      .map(toMenuProduct)
      .filter((p): p is MenuProduct => p !== null);
    byHandle.set(h, list);
  });

  const sections: Record<string, MenuSection> = {};

  for (const cat of MENU_CATEGORIES) {
    if (!cat.collection) {
      // 店上沒有這一類的商品。照實回空的，不要拿別類的填。
      sections[cat.id] = { id: cat.id, empty: true, products: [], total: 0 };
      continue;
    }
    const pool = (byHandle.get(cat.collection) ?? []).filter((p) =>
      matchesFilter(p, cat),
    );
    sections[cat.id] = {
      id: cat.id,
      empty: pool.length === 0,
      products: featured(pool),
      total: pool.length,
    };
  }

  const allList = data.all.nodes
    .map(toMenuProduct)
    .filter((p): p is MenuProduct => p !== null);
  sections[ALL_PRODUCTS.id] = {
    id: ALL_PRODUCTS.id,
    empty: allList.length === 0,
    products: featured(allList),
    total: allList.length,
  };

  return {
    sections,
    shopCurrency: data.shop.paymentSettings.currencyCode,
  };
}
