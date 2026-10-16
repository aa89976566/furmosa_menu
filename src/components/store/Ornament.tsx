type OrnamentProps = {
  className?: string;
};

/**
 * 報頭左邊那條花邊：稿子上是一條雷紋，一圈圈方折的回紋上下相扣成迷宮，
 * 不是斜格編織。稿子上這條很密——三十幾個像素的帶寬裡排了四五列回紋，
 * 所以單元只有 10px。做成 SVG pattern，刻意不設 viewBox，讓單元
 * 的尺寸等於 CSS 像素而不是被整條拉伸——strip 多寬多高，回紋就排幾個。
 * 兩側的細線由 CSS border 畫，pattern 只管填滿。
 */
export default function Ornament({ className }: OrnamentProps) {
  const classes = className ? `st-ornament ${className}` : "st-ornament";

  return (
    <svg className={classes} aria-hidden="true" focusable="false">
      <defs>
        <pattern
          id="st-ornament-fret"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeLinecap="square"
          >
            {/* 上下兩圈回紋反向相扣，接縫落在單元邊上，所以上下左右都接得起來。 */}
            <path d="M-1 1H7V4.5H3V2.5H5" />
            <path d="M11 6H3V9.5H7V7.5H5" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#st-ornament-fret)" />
    </svg>
  );
}
