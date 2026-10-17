import type { Burst as BurstData } from "@/data/store";

type BurstProps = {
  burst: BurstData;
  href?: string;
  className?: string;
};

/*
 * 稿子上的價格是蓋在一顆紅色爆炸星上的。星是手裁的：每個尖角的長短都不一樣，
 * 所以這裡把半徑乘上一組固定的擾動值——固定是為了伺服器與瀏覽器畫出同一顆星，
 * 隨機的話兩邊的點對不起來，會被 React 判成不一致。
 */
const SPIKES = 22;
const JITTER = [1, 0.94, 1.03, 0.97, 1.06, 0.92, 1.01, 0.98, 1.05, 0.95, 1.02];

function starPoints(): string {
  const points: string[] = [];

  for (let i = 0; i < SPIKES * 2; i += 1) {
    /* 偶數是尖、奇數是谷。 */
    const base = i % 2 === 0 ? 50 : 36;
    const radius = base * JITTER[i % JITTER.length];
    const angle = (Math.PI * i) / SPIKES - Math.PI / 2;

    points.push(
      `${(50 + radius * Math.cos(angle)).toFixed(2)},${(
        50 + radius * Math.sin(angle)
      ).toFixed(2)}`,
    );
  }

  return points.join(" ");
}

const POINTS = starPoints();

/**
 * 一顆爆炸星：上面一圈小字，中間是很大的數字，右下角跟一個小單位。
 * 字是 HTML 不是 SVG text，所以中文用的是這一頁的明體，級數也跟著版面縮。
 */
export default function Burst({ burst, href, className }: BurstProps) {
  const classes = className ? `st-burst ${className}` : "st-burst";

  const body = (
    <>
      <svg
        className="st-burst__star"
        viewBox="0 0 100 100"
        aria-hidden="true"
        focusable="false"
      >
        <polygon points={POINTS} />
      </svg>
      <span className="st-burst__note">{burst.note}</span>
      <span className="st-burst__price">
        <span className="st-burst__figure">{burst.figure}</span>
        <span className="st-burst__unit">{burst.unit}</span>
      </span>
    </>
  );

  if (!href) {
    return <span className={classes}>{body}</span>;
  }

  return (
    <a className={classes} href={href} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  );
}
