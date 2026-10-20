import { SHOP_ORIGIN } from "@/config/shop";

import { StorefrontError, storefront } from "./storefront";
import type { Cart } from "./types";

/**
 * 購物車。整個站只有這一個車，而且它就是 Shopify 的車——
 * cartCreate 建的那一個，checkoutUrl 直接是店上的結帳頁。
 * 這裡不自己算小計、不自己存商品，數字全部由 Shopify 回。
 */

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost { subtotalAmount { amount currencyCode } }
  lines(first: 100) {
    nodes {
      id
      quantity
      cost { totalAmount { amount currencyCode } }
      merchandise {
        ... on ProductVariant {
          id
          title
          price { amount currencyCode }
          image { url altText }
          product { handle title featuredImage { url altText } }
        }
      }
    }
  }
`;

type RawCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: { amount: string; currencyCode: string } };
  lines: {
    nodes: {
      id: string;
      quantity: number;
      cost: { totalAmount: { amount: string; currencyCode: string } };
      merchandise: {
        id: string;
        title: string | null;
        price: { amount: string; currencyCode: string };
        image: { url: string; altText: string | null } | null;
        product: {
          handle: string;
          title: string;
          featuredImage: { url: string; altText: string | null } | null;
        };
      } | null;
    }[];
  };
};

type MutationResult = {
  cart: RawCart | null;
  userErrors: { field: string[] | null; message: string }[];
};

function normalise(raw: RawCart): Cart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    subtotal: raw.cost.subtotalAmount,
    lines: raw.lines.nodes.flatMap((line) => {
      const m = line.merchandise;
      // merchandise 可能是別的型別（禮卡之類），那種這裡不處理。
      if (!m) return [];
      return [
        {
          id: line.id,
          quantity: line.quantity,
          variantId: m.id,
          title: m.product.title,
          variantTitle: m.title,
          productHandle: m.product.handle,
          image: m.image ?? m.product.featuredImage,
          unitPrice: m.price,
          lineTotal: line.cost.totalAmount,
        },
      ];
    }),
  };
}

/** userErrors 是 Shopify 的「這件事做不到」，要當成錯誤往上丟。 */
function unwrap(result: MutationResult | undefined, what: string): Cart {
  if (!result) throw new StorefrontError(`${what}：Shopify 沒有回結果`, 502);
  if (result.userErrors.length) {
    throw new StorefrontError(
      result.userErrors.map((e) => e.message).join("; "),
      400,
    );
  }
  if (!result.cart) throw new StorefrontError(`${what}：Shopify 沒有回 cart`, 502);
  return normalise(result.cart);
}

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[] = [],
): Promise<Cart> {
  const data = await storefront<{ cartCreate: MutationResult }>(
    `mutation CartCreate($lines: [CartLineInput!]) {
       cartCreate(input: { lines: $lines }) {
         cart { ${CART_FIELDS} }
         userErrors { field message }
       }
     }`,
    { lines },
  );
  return unwrap(data.cartCreate, "建立購物車");
}

/**
 * 讀車。車過期或被結掉時 Shopify 回 null——那不是錯誤，
 * 呼叫端要據此丟掉舊的 cartId 重新開一個。
 */
export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await storefront<{ cart: RawCart | null }>(
    `query CartGet($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`,
    { id: cartId },
  );
  return data.cart ? normalise(data.cart) : null;
}

export async function addLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const data = await storefront<{ cartLinesAdd: MutationResult }>(
    `mutation CartAdd($id: ID!, $lines: [CartLineInput!]!) {
       cartLinesAdd(cartId: $id, lines: $lines) {
         cart { ${CART_FIELDS} }
         userErrors { field message }
       }
     }`,
    { id: cartId, lines },
  );
  return unwrap(data.cartLinesAdd, "加入購物車");
}

export async function updateLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart> {
  const data = await storefront<{ cartLinesUpdate: MutationResult }>(
    `mutation CartUpdate($id: ID!, $lines: [CartLineUpdateInput!]!) {
       cartLinesUpdate(cartId: $id, lines: $lines) {
         cart { ${CART_FIELDS} }
         userErrors { field message }
       }
     }`,
    { id: cartId, lines: [{ id: lineId, quantity }] },
  );
  return unwrap(data.cartLinesUpdate, "更新數量");
}

export async function removeLine(cartId: string, lineId: string): Promise<Cart> {
  const data = await storefront<{ cartLinesRemove: MutationResult }>(
    `mutation CartRemove($id: ID!, $lineIds: [ID!]!) {
       cartLinesRemove(cartId: $id, lineIds: $lineIds) {
         cart { ${CART_FIELDS} }
         userErrors { field message }
       }
     }`,
    { id: cartId, lineIds: [lineId] },
  );
  return unwrap(data.cartLinesRemove, "移除商品");
}

/** 車空的時候 Drawer 上那個「去店上逛」要連哪。 */
export const SHOP_ALL_URL = `${SHOP_ORIGIN}/collections/all`;
