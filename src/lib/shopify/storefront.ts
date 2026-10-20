/**
 * Shopify Storefront API 的唯一出入口。只在 server 上跑（route handler 裡），
 * token 不會進瀏覽器的 bundle。
 *
 * 為什麼是 Storefront API 而不是 Ajax Cart API（/cart/add.js）：
 * Ajax Cart 只能同網域用。實測 `https://furmosa.com/cart.js` 一個
 * access-control-allow-origin 都沒回，所以從這個站（另一個網域）打過去會被
 * 瀏覽器擋掉；就算擋得過，`*` 也不能帶 cookie，車會變成每次都是新的。
 * Storefront API 回 `access-control-allow-origin: *`、cart 用 cartId 認，
 * 跨網域是它設計上支援的，而且 cartCreate 出來的 checkoutUrl 就是店上
 * 真的結帳頁——整頁只有這一個車，不會多生一個。
 */

const API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2026-10";
const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN ?? "furmosa.com";

/**
 * 這是店上現用的那一把 Storefront 公開 token，從 furmosa.com 的 theme HTML 裡
 * 讀出來的（`"accessToken":"..."`）。Shopify 的 storefront token 本來就是公開的，
 * 每個逛店的人瀏覽器裡都有一份，所以寫在這裡不是把祕密洩出去；它只能讀商品與
 * 操作自己的車，不能動後台。沿用同一把就是沿用店上現有的設定，不會多一個車。
 * 要換把（例如之後開一把專用的）就設 SHOPIFY_STOREFRONT_TOKEN，env 優先。
 */
const PUBLIC_TOKEN = "65c02085eade4f1a54f293b392dd25dc";
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN || PUBLIC_TOKEN;

export const STOREFRONT_ENDPOINT = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;

export class StorefrontError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "StorefrontError";
  }
}

/** 沒有 token 就不要悄悄回空資料——呼叫端要知道是設定沒給。 */
export function isConfigured(): boolean {
  return TOKEN.length > 0;
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  if (!isConfigured()) {
    throw new StorefrontError(
      "SHOPIFY_STOREFRONT_TOKEN 沒有設定，無法連店上的 Storefront API",
      503,
    );
  }

  const res = await fetch(STOREFRONT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    // 車的狀態一定要即時，商品那邊由呼叫端自己決定要不要快取。
    cache: "no-store",
  });

  if (!res.ok) {
    throw new StorefrontError(
      `Storefront API 回了 ${res.status}`,
      res.status === 429 ? 429 : 502,
    );
  }

  const body = (await res.json()) as GraphQLResponse<T>;
  if (body.errors?.length) {
    throw new StorefrontError(
      body.errors.map((e) => e.message).join("; "),
      502,
    );
  }
  if (!body.data) {
    throw new StorefrontError("Storefront API 沒有回 data", 502);
  }
  return body.data;
}
