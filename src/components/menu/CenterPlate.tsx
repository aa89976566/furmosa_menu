"use client";

import { ALL_PRODUCTS, FEATURED_LIMIT, type MenuCategory } from "@/config/menu";
import { formatMoney } from "@/lib/money";
import type { MenuProduct, MenuSection } from "@/lib/shopify/types";

import { useCart } from "./CartProvider";

/**
 * 中央那只大盤。目前選中的分類的商品就擺在這裡。
 *
 * 盤上最多三份（FEATURED_LIMIT）。每一份是一個圓形容器，裡面是 Shopify CDN
 * 上的商品照、用 object-fit: cover 裁，下面接品名、售價與一顆加入購物車。
 * 加入時不離開這一頁，按完頂端那條免運進度就會跟著動。
 *
 * 切換分類時標題與三份一起做 200–300ms 的淡入；key 用 sectionId，
 * 所以 React 會重建這一塊、動畫才會重跑。
 */
export function CenterPlate({
  category,
  section,
  loading,
  error,
}: {
  category: MenuCategory | null;
  section: MenuSection | undefined;
  loading: boolean;
  error: string | null;
}) {
  const title = category?.label ?? ALL_PRODUCTS.label;
  const blurb = category?.blurb ?? ALL_PRODUCTS.blurb;
  const href = category?.href ?? ALL_PRODUCTS.href;
  const id = category?.id ?? ALL_PRODUCTS.id;

  return (
    <div className="mn-center">
      <div className="mn-center__rim" aria-hidden="true" />
      <div className="mn-center__ticks" aria-hidden="true" />

      <div className="mn-dish" key={id}>
        <div className="mn-dish__head">
          <h2 className="mn-dish__title">{title}</h2>
          <p className="mn-dish__blurb">{blurb}</p>
        </div>

        <div className="mn-dish__row" data-count={section?.products.length ?? 0}>
          {error && <p className="mn-dish__state">{error}</p>}

          {!error && loading && (
            <>
              {Array.from({ length: FEATURED_LIMIT }, (_, i) => (
                <div className="mn-item mn-item--skeleton" key={i}>
                  <span className="mn-item__disc" />
                  <span className="mn-item__bar" />
                  <span className="mn-item__bar mn-item__bar--short" />
                </div>
              ))}
            </>
          )}

          {!error && !loading && section?.empty && (
            <p className="mn-dish__state">
              {category && category.collection === null
                ? "店上還沒有標成這一類的商品。按下面的連結看計畫怎麼運作。"
                : "這一類目前沒有可販售的商品。"}
            </p>
          )}

          {!error &&
            !loading &&
            section?.products.map((product) => (
              <Dish product={product} key={product.variantId} />
            ))}
        </div>

        <a
          className="mn-dish__more"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          查看全部
          {section && section.total > 0 ? `（${section.total}）` : ""}
        </a>
      </div>
    </div>
  );
}

/** 盤上的一份。圖是真的商品圖，價是 Shopify 給的，按鈕真的會加進車裡。 */
function Dish({ product }: { product: MenuProduct }) {
  const { addItem, busy } = useCart();

  return (
    <div className="mn-item">
      <a
        className="mn-item__disc"
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {product.image ? (
          /* Shopify CDN 自己會依 width 參數出圖，所以不過 next/image。 */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${product.image.url}${product.image.url.includes("?") ? "&" : "?"}width=420`}
            alt={product.image.altText ?? product.title}
            width={420}
            height={420}
            loading="lazy"
          />
        ) : (
          <span className="mn-item__blank">照片待補</span>
        )}
      </a>

      <p className="mn-item__name">{product.title}</p>
      <p className="mn-item__price">
        {formatMoney(product.price)}
        {product.compareAtPrice && (
          <s className="mn-item__was">{formatMoney(product.compareAtPrice)}</s>
        )}
      </p>

      <button
        type="button"
        className="mn-item__add"
        disabled={!product.availableForSale || busy}
        onClick={() => addItem(product.variantId, product.title)}
      >
        {product.availableForSale ? "加入購物車" : "補貨中"}
      </button>
    </div>
  );
}
