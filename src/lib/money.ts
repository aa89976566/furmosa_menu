import type { Money } from "@/lib/shopify/types";

/**
 * 顯示金額。
 *
 * 不能直接丟給 Intl 的 currency 格式：TWD 在 Intl 裡的小數位是 0，
 * 店上有八支 Earthbath 的售價是 0.89，照 TWD 格式會印成 NT$1——那是寫錯價。
 * 所以整數就不顯示小數、非整數才顯示到兩位，照店上給的數字印。
 */
export function formatMoney(money: Money): string {
  const value = Number(money.amount);
  if (!Number.isFinite(value)) return money.amount;

  const digits = Number.isInteger(value) ? 0 : 2;
  const body = new Intl.NumberFormat("zh-Hant-TW", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

  return money.currencyCode === "TWD" ? `NT$${body}` : `${body} ${money.currencyCode}`;
}

/** 只有數字、沒有 Money 物件時用（例如免運還差多少）。 */
export function formatAmount(value: number, currencyCode = "TWD"): string {
  return formatMoney({ amount: String(value), currencyCode });
}

export function toNumber(money: Money | undefined): number {
  if (!money) return 0;
  const value = Number(money.amount);
  return Number.isFinite(value) ? value : 0;
}
