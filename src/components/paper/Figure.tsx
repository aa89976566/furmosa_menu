import type { PaperFigure } from "@/data/paper";

type FigureProps = {
  figure: PaperFigure;
  className?: string;
};

/**
 * 大字欄位。市場 DM 把這個位置給價格，匠寵給的是實際紀錄，
 * 所以數字後面一律跟著自己的單位與出處說明，不會被誤讀成金額。
 */
export default function Figure({ figure, className }: FigureProps) {
  return (
    <p className={className ? `pp-figure ${className}` : "pp-figure"}>
      <span className="pp-figure__value">{figure.value}</span>
      <span className="pp-figure__unit">{figure.unit}</span>
      <span className="pp-figure__label">{figure.label}</span>
    </p>
  );
}
