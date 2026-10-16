import Image from "next/image";

import type { PaperPhoto } from "@/data/paper";

type PlateProps = {
  photo: PaperPhoto;
  /** 版面寬度提示，交給 next/image 挑尺寸。 */
  sizes: string;
  className?: string;
  priority?: boolean;
};

/**
 * 照片版塊。DM 上的照片都是硬邊直角，再壓一張黑色小標籤註明產地或現場。
 */
export default function Plate({
  photo,
  sizes,
  className,
  priority = false,
}: PlateProps) {
  return (
    <figure className={className ? `pp-plate ${className}` : "pp-plate"}>
      <Image
        className="pp-plate__img"
        src={photo.image}
        alt={photo.alt}
        sizes={sizes}
        placeholder="blur"
        priority={priority}
      />
      {photo.tag ? (
        <figcaption className="pp-plate__tag">{photo.tag}</figcaption>
      ) : null}
    </figure>
  );
}
