type OrnamentProps = {
  className?: string;
};

/**
 * 報頭左邊那條花邊：稿子上是一條很密的斜格編織帶，格眼中央各嵌一顆菱形。
 * 一個 14px 的單元做成 SVG pattern，刻意不設 viewBox，讓單元的尺寸等於
 * CSS 像素而不是被整條拉伸——strip 多寬多高，格子就排幾個。
 * 兩側的細線由 CSS border 畫，pattern 只管填滿。
 */
export default function Ornament({ className }: OrnamentProps) {
  const classes = className ? `st-ornament ${className}` : "st-ornament";

  return (
    <svg className={classes} aria-hidden="true" focusable="false">
      <defs>
        <pattern
          id="st-ornament-braid"
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M-1 -1 15 15M15 -1-1 15" />
            <path d="M7 3.6 10.4 7 7 10.4 3.6 7Z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#st-ornament-braid)" />
    </svg>
  );
}
