import Image from "next/image";
import { EnquiryForm } from "@/components/enquiry-form";
import { PigmentField } from "@/components/pigment-field";
import { site, type Picture } from "@/content/site";
import styles from "./home.module.css";

function FilePath({ file }: { file: string }) {
  const parts = file.split("/");
  return (
    <code>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {index > 0 ? <wbr /> : null}
          {index > 0 ? "/" : null}
          {part}
        </span>
      ))}
    </code>
  );
}

function PictureFrame({ item, sizes }: { item: Picture; sizes: string }) {
  return (
    <figure>
      <div className={styles.frame} style={{ aspectRatio: item.ratio }}>
        {item.src ? (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes={sizes}
            className={styles.frameImage}
          />
        ) : (
          <div className={styles.frameEmpty}>
            <span>Image placeholder</span>
            <FilePath file={item.file} />
          </div>
        )}
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.index}>{item.id}</span>
        <div>
          <h3>{item.title}</h3>
          <p>{item.meta}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export default function Home() {
  const editionMailto = `mailto:${site.enquiryEmail}?subject=${encodeURIComponent(
    site.editions.enquireSubject,
  )}`;

  return (
    <div id="top">
      <a className={styles.skip} href="#content">
        Skip to content
      </a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.brand} href="#top">
            {site.title}
          </a>
          <nav aria-label="Sections">
            <div className={styles.nav}>
              {site.nav.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main id="content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroField}>
            <PigmentField />
            <p className={styles.heroMedium}>{site.hero.medium}</p>
          </div>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>{site.hero.kicker}</p>
            <h1 id="hero-title" className={styles.heroTitle}>
              {site.hero.title}
            </h1>
            <p className={styles.heroNote}>{site.hero.note}</p>
            <p className={styles.heroCaption}>{site.hero.caption}</p>
          </div>
        </section>

        <section id="project" className={styles.section} aria-labelledby="project-title">
          <div className={styles.wrap}>
            <header className={styles.sectionHead}>
              <p className={styles.kicker}>{site.project.kicker}</p>
              <h2 id="project-title" className={styles.heading}>
                {site.project.heading}
              </h2>
            </header>
            <div className={styles.split}>
              <div className={styles.prose}>
                {site.project.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <dl className={styles.facts}>
                {site.project.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="works" className={styles.section} aria-labelledby="works-title">
          <div className={styles.wrap}>
            <header className={styles.sectionHead}>
              <p className={styles.kicker}>{site.works.kicker}</p>
              <h2 id="works-title" className={styles.heading}>
                {site.works.heading}
              </h2>
            </header>
            <p className={styles.intro}>{site.works.intro}</p>
            <div className={styles.works}>
              {site.works.items.map((item) => (
                <PictureFrame
                  key={item.id}
                  item={item}
                  sizes="(max-width: 800px) 100vw, 45vw"
                />
              ))}
            </div>
          </div>
        </section>

        <section id="editions" className={styles.section} aria-labelledby="editions-title">
          <div className={styles.wrap}>
            <header className={styles.sectionHead}>
              <p className={styles.kicker}>{site.editions.kicker}</p>
              <h2 id="editions-title" className={styles.heading}>
                {site.editions.heading}
              </h2>
            </header>
            <h3 className={styles.editionTitle}>{site.editions.title}</h3>
            <p className={styles.intro}>{site.editions.intro}</p>
            <div className={styles.postcards}>
              {site.editions.cards.map((item) => (
                <PictureFrame
                  key={item.id}
                  item={item}
                  sizes="(max-width: 560px) 100vw, (max-width: 960px) 50vw, 22vw"
                />
              ))}
            </div>
            <dl className={styles.specs}>
              {site.editions.facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <a className={styles.textLink} href={editionMailto}>
              {site.editions.enquireLabel}
            </a>
          </div>
        </section>

        <section id="stockists" className={styles.section} aria-labelledby="stockists-title">
          <div className={styles.wrap}>
            <div className={styles.stock}>
              <div>
                <header className={styles.sectionHead}>
                  <p className={styles.kicker}>{site.stockists.kicker}</p>
                  <h2 id="stockists-title" className={styles.heading}>
                    {site.stockists.heading}
                  </h2>
                </header>
                <p className={styles.intro}>{site.stockists.intro}</p>
                <p className={styles.shops}>{site.stockists.shops}</p>
                <dl className={styles.facts}>
                  {site.stockists.facts.map((fact) => (
                    <div key={fact.label}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <EnquiryForm />
            </div>
          </div>
        </section>

        <section id="artist" className={styles.section} aria-labelledby="artist-title">
          <div className={styles.wrap}>
            <div className={styles.artistGrid}>
              <figure className={styles.portrait}>
                <div
                  className={styles.frame}
                  style={{ aspectRatio: site.artist.portrait.ratio }}
                >
                  {site.artist.portrait.src ? (
                    <Image
                      src={site.artist.portrait.src}
                      alt={site.artist.portrait.alt}
                      fill
                      sizes="16rem"
                      className={styles.frameImage}
                    />
                  ) : (
                    <div className={styles.frameEmpty}>
                      <span>Image placeholder</span>
                      <FilePath file={site.artist.portrait.file} />
                    </div>
                  )}
                </div>
              </figure>
              <div>
                <header className={styles.sectionHead}>
                  <p className={styles.kicker}>{site.artist.kicker}</p>
                  <h2 id="artist-title" className={styles.heading}>
                    {site.artist.heading}
                  </h2>
                </header>
                <div className={styles.prose}>
                  {site.artist.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>{site.title}</span>
          <span>{site.artist.heading}</span>
          <a href={`mailto:${site.enquiryEmail}`}>{site.footer.emailLabel}</a>
          <a href="#top">{site.footer.top}</a>
          <p className={styles.footerNote}>{site.footer.note}</p>
        </div>
      </footer>
    </div>
  );
}
