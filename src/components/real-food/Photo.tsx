import Image from "next/image";

import type { ChapterPhoto } from "@/data/real-food";

type PhotoProps = {
  photo: ChapterPhoto;
  /** 版面寬度提示，交給 next/image 挑尺寸。 */
  sizes: string;
  className?: string;
  priority?: boolean;
};

/**
 * 海報上的照片都被裁進固定的格位，而不是依原比例流動——
 * 這正是整張紙看起來緊實的原因。所以照片一律填滿格高並裁切。
 */
export default function Photo({
  photo,
  sizes,
  className,
  priority = false,
}: PhotoProps) {
  return (
    <figure className={className ? `rf-photo ${className}` : "rf-photo"}>
      <Image
        className="rf-photo__img"
        src={photo.image}
        alt={photo.alt}
        sizes={sizes}
        placeholder="blur"
        priority={priority}
      />
    </figure>
  );
}
