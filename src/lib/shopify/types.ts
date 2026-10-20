/** 從 Shopify 拿回來、要送到瀏覽器的形狀。只留畫面真的用到的欄位。 */

export type Money = {
  /** 原字串，不做四捨五入。店上有商品的售價是 0.89，進位會寫錯價。 */
  amount: string;
  currencyCode: string;
};

export type MenuProduct = {
  /** 加入購物車用的 variant ID。不是 product ID。 */
  variantId: string;
  productHandle: string;
  title: string;
  /** 有多個規格時顯示，單一規格的 Shopify 會給「單一規格」之類的字。 */
  variantTitle: string | null;
  price: Money;
  /** 有原價才給，用來顯示劃掉的價。 */
  compareAtPrice: Money | null;
  image: { url: string; altText: string | null; width: number; height: number } | null;
  availableForSale: boolean;
  url: string;
};

export type MenuSection = {
  id: string;
  /** collection 是 null 的那一只盤子會是 true：店上還沒有這一類的商品。 */
  empty: boolean;
  products: MenuProduct[];
  /** 這一類在店上實際有幾件（濾過之後）。 */
  total: number;
};

export type MenuPayload = {
  sections: Record<string, MenuSection>;
  shopCurrency: string;
};

export type CartLine = {
  id: string;
  quantity: number;
  variantId: string;
  title: string;
  variantTitle: string | null;
  productHandle: string;
  image: { url: string; altText: string | null } | null;
  unitPrice: Money;
  lineTotal: Money;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: Money;
  lines: CartLine[];
};
