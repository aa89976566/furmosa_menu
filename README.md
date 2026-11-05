# Earth Painting Project

Single-page portfolio and postcard edition site for Jieshin Tseng. The page is a visual skeleton: copy, prices, stockist terms, and images are unfinished placeholders.

## Preview

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Where to edit

All visitor-facing text, prices, and stockist terms live in one file:

`src/content/site.ts`

Anything in square brackets — `[Replace: …]` — is waiting for real copy. Do not publish invented biography, prices, edition sizes, or shop names.

| What | Where |
| --- | --- |
| Site title, navigation, hero lines, medium | `src/content/site.ts` → `title`, `nav`, `hero` (`hero.medium` is the line on the pigment field) |
| Project text | `src/content/site.ts` → `project` |
| Work titles and captions | `src/content/site.ts` → `works.items` |
| Postcard titles, price, paper, size, edition size | `src/content/site.ts` → `editions` |
| Stockist terms and the shops line | `src/content/site.ts` → `stockists` |
| Artist biography | `src/content/site.ts` → `artist.paragraphs` |
| Enquiry address | `src/content/site.ts` → `enquiryEmail` |

The enquiry form does not save anything. It opens a mail draft to `enquiryEmail`. Until that address is changed, the draft goes to `replace-this@example.invalid`.

## Images

Frames stay empty until a file exists **and** `src` is set in `src/content/site.ts`. `src` is the public URL (starts with `/images/...`). `file` is the matching path inside this repo, shown on the placeholder.

| Frame | Save the file as | Then set `src` to |
| --- | --- | --- |
| Work 01 | `public/images/works/work-01.jpg` | `/images/works/work-01.jpg` |
| Work 02 | `public/images/works/work-02.jpg` | `/images/works/work-02.jpg` |
| Work 03 | `public/images/works/work-03.jpg` | `/images/works/work-03.jpg` |
| Work 04 | `public/images/works/work-04.jpg` | `/images/works/work-04.jpg` |
| Postcard 01 | `public/images/editions/postcard-01.jpg` | `/images/editions/postcard-01.jpg` |
| Postcard 02 | `public/images/editions/postcard-02.jpg` | `/images/editions/postcard-02.jpg` |
| Postcard 03 | `public/images/editions/postcard-03.jpg` | `/images/editions/postcard-03.jpg` |
| Postcard 04 | `public/images/editions/postcard-04.jpg` | `/images/editions/postcard-04.jpg` |
| Portrait | `public/images/artist/portrait.jpg` | `/images/artist/portrait.jpg` |

JPG, PNG, or WebP are fine. If you change a filename, change both `file` and `src`. To change a frame’s shape, edit its `ratio` (for example `"4 / 5"`).

The hero is drawn in code (`src/components/pigment-field.tsx`). It is not a photograph.

Alt text for each picture is the `alt` field next to its `src`. Replace those when the images go in.

## Layout

- Page structure and sections: `src/app/page.tsx`
- Colour, type, and spacing: `src/app/globals.css` and `src/app/home.module.css`
