import Image from "next/image";
import { Fragment } from "react";

import type { Chapter as ChapterData } from "@/data/real-food";

const LEAD_SIZES = "(max-width: 640px) 92vw, (max-width: 1024px) 62vw, 40vw";
const ASIDE_SIZES = "(max-width: 640px) 44vw, (max-width: 1024px) 26vw, 15vw";

export default function Chapter({ chapter }: { chapter: ChapterData }) {
  const [lead, aside] = chapter.photos;
  const headingId = `rf-chapter-${chapter.id}`;

  return (
    <article
      className={`rf-chapter rf-chapter--${chapter.media}`}
      aria-labelledby={headingId}
      data-rf-reveal="out"
    >
      <p className="rf-chapter__index" aria-hidden="true">
        #{chapter.index}
      </p>

      <h2 className="rf-chapter__tag" id={headingId}>
        <span className="rf-chapter__tag-inner">{chapter.tag}</span>
      </h2>

      <div className="rf-chapter__copy">
        <p className="rf-chapter__lines">
          {chapter.lines.map((line, index) => (
            <Fragment key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </Fragment>
          ))}
        </p>
      </div>

      <figure className="rf-chapter__media rf-chapter__media--lead">
        <span className="rf-photo">
          <Image
            className="rf-photo__img"
            src={lead.image}
            alt={lead.alt}
            sizes={LEAD_SIZES}
            placeholder="blur"
          />
        </span>
        {lead.caption ? (
          <figcaption className="rf-photo__caption">{lead.caption}</figcaption>
        ) : null}
      </figure>

      {aside ? (
        <figure className="rf-chapter__media rf-chapter__media--aside">
          <span className="rf-photo">
            <Image
              className="rf-photo__img"
              src={aside.image}
              alt={aside.alt}
              sizes={ASIDE_SIZES}
              placeholder="blur"
            />
          </span>
        </figure>
      ) : null}
    </article>
  );
}
