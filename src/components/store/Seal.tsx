type SealProps = {
  /** 印面上的字，直書排在橢圓或方框裡。 */
  text: string;
  /** oval 是報頭那只橢圓關防，square 是欄裡蓋的小方印。 */
  shape?: "oval" | "square";
  className?: string;
};

/**
 * 紅色關防。外框與字都是文字排出來的，所以縮放到任何尺寸都不失真，
 * 也能跟著周圍的 cqw 字級一起縮。
 */
export default function Seal({ text, shape = "oval", className }: SealProps) {
  const classes = ["st-seal", `st-seal--${shape}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} role="img" aria-label={`${text}印`}>
      <span className="st-seal__text" aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
