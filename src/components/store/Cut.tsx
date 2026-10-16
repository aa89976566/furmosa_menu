import Image, { type StaticImageData } from "next/image";

type CutProps = {
  art: StaticImageData;
  alt: string;
  /** 這一格佔版面的寬度，交給 next/image 挑檔。 */
  sizes: string;
  className?: string;
  priority?: boolean;
};

/**
 * 一塊雕版。圖檔本身就是單色墨＋透明底，所以不鋪底色、不裁切：
 * 整張依比例縮進格子裡，空白處透出紙色與紙紋，像直接印在這張紙上。
 */
export default function Cut({
  art,
  alt,
  sizes,
  className,
  priority,
}: CutProps) {
  const classes = className ? `st-cut ${className}` : "st-cut";

  return (
    <Image
      className={classes}
      src={art}
      alt={alt}
      sizes={sizes}
      priority={priority}
    />
  );
}
