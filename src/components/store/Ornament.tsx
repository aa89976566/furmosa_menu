type OrnamentProps = {
  className?: string;
};

/**
 * 報頭左邊那條花邊：兩股互繞的麻花繩，兩側各壓一條細線。
 * 一個 26px 高的單元做成 SVG pattern，刻意不設 viewBox，讓單元的尺寸等於
 * CSS 像素而不是被整條拉伸——strip 多高，繩子就繞幾圈。
 */
export default function Ornament({ className }: OrnamentProps) {
  const classes = className ? `st-ornament ${className}` : "st-ornament";

  return (
    <svg className={classes} aria-hidden="true" focusable="false">
      <defs>
        <pattern
          id="st-ornament-braid"
          width="22"
          height="26"
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 -1C5 7 17 10 17 13s-12 6-12 14" />
            <path d="M17 -1C17 7 5 10 5 13s12 6 12 14" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#st-ornament-braid)" />
      <g stroke="currentColor" strokeWidth="1">
        <line x1="0.5" y1="0" x2="0.5" y2="100%" />
        <line x1="21.5" y1="0" x2="21.5" y2="100%" />
      </g>
    </svg>
  );
}
