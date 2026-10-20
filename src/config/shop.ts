/**
 * 店在哪、商品與分類的網址怎麼拼。只有這一份，不要散在各處寫死。
 */

export const SHOP_ORIGIN = "https://furmosa.com";

/** handle 有中文的（店上大半都是），一律先編碼再接上去。 */
export const productUrl = (handle: string) =>
  `${SHOP_ORIGIN}/products/${encodeURIComponent(handle)}`;

export const collectionUrl = (handle: string) =>
  `${SHOP_ORIGIN}/collections/${encodeURIComponent(handle)}`;
