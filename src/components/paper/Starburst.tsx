import type { ReactNode } from "react";

/**
 * 市場 DM 的爆炸章。
 *
 * 星形只是背景，文字仍是 HTML，所以價格／數字可以被選取、被搜尋、被朗讀。
 * 鋸齒以多邊形算出來而不是貼圖，縮放到任何尺寸都不會糊掉。
 */
function spikes(count: number, outer: number, inner: number) {
  const step = Math.PI / count;
  const points: string[] = [];

  for (let i = 0; i < count * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    /* 從正上方起算，第一個尖端才會落在十二點鐘方向。 */
    const angle = i * step - Math.PI / 2;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return points.join(" ");
}

type StarburstProps = {
  children: ReactNode;
  /** 尖端數，越多越像油墨印上去的鋸齒章。 */
  count?: number;
  className?: string;
};

export default function Starburst({
  children,
  count = 22,
  className,
}: StarburstProps) {
  return (
    <span className={className ? `pp-burst ${className}` : "pp-burst"}>
      <svg
        className="pp-burst__shape"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon className="pp-burst__edge" points={spikes(count, 50, 39)} />
        <polygon className="pp-burst__face" points={spikes(count, 47, 36)} />
      </svg>
      <span className="pp-burst__body">{children}</span>
    </span>
  );
}
