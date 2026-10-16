type OrnamentProps = {
  className?: string;
};

/**
 * 報頭左邊那條編織紋花邊。一個 24px 的單元做成 SVG pattern，刻意不設 viewBox，
 * 讓單元的尺寸等於 CSS 像素而不是被拉伸——高度由容器決定，紋樣自己重複。
 */
export default function Ornament({ className }: OrnamentProps) {
  const classes = className ? `st-ornament ${className}` : "st-ornament";

  return (
    <svg className={classes} aria-hidden="true" focusable="false">
      <defs>
        <pattern
          id="st-ornament-weave"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          >
            <path d="M3 -3v12h9V3H6v18" />
            <path d="M21 27V15h-9v6h6V3" />
            <path d="M-1 12h7M18 12h7" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#st-ornament-weave)" />
    </svg>
  );
}
