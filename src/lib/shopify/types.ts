/** 從 Shopify 拿回來、要送到瀏覽器的形狀。只留畫面真的用到的欄位。 */

export type Money = {
  /** 原字串，不做四捨五入。店上有商品的售價是 0.89，進位會寫錯價。 */
  amount: string;
  currencyCode: string;
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
