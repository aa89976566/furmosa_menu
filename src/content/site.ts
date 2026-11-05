/**
 * Single content module for the Earth Painting Project site.
 * Replace the [Replace: …] strings, prices, and stockist terms here.
 * Image files live under public/images/. Set `src` to the public URL
 * (for example "/images/works/work-01.jpg") after the file is in place.
 * Leave `src` as null to keep the labelled placeholder frame.
 */

export type Picture = {
  id: string;
  title: string;
  meta: string;
  src: string | null;
  file: string;
  alt: string;
  ratio: string;
};

export type Fact = {
  label: string;
  value: string;
};

export const site = {
  title: "Earth Painting Project",
  enquiryEmail: "replace-this@example.invalid",
  nav: [
    { href: "#project", label: "Project" },
    { href: "#works", label: "Works" },
    { href: "#editions", label: "Editions" },
    { href: "#stockists", label: "Stores" },
    { href: "#artist", label: "Artist" },
  ],
  hero: {
    kicker: "Jieshin Tseng",
    title: "Earth Painting Project",
    medium: "[Replace: earth pigments from southern Andalusia]",
    note: "[Replace: one sentence under the title]",
    caption: "[Replace: place, year, or material note]",
  },
  project: {
    kicker: "01",
    heading: "Project",
    paragraphs: [
      "[Replace: opening paragraph] She gathers rocks on journeys in southern Andalusia, Spain, and grinds them into pigments.",
      "[Replace: what the paintings hold] Intimate drawings of animals, bodies, sleep, and moving landscapes.",
    ],
    facts: [
      { label: "Material", value: "[Replace: pigment and support]" },
      { label: "Place", value: "[Replace: southern Andalusia, Spain]" },
      { label: "Year", value: "[Replace: year]" },
    ] satisfies Fact[],
  },
  works: {
    kicker: "02",
    heading: "Selected works",
    intro: "[Replace: one line introducing these four works]",
    items: [
      {
        id: "01",
        title: "[Replace: work title]",
        meta: "[Replace: year · material · dimensions]",
        src: null,
        file: "public/images/works/work-01.jpg",
        alt: "[Replace: short description of work 01]",
        ratio: "3 / 4",
      },
      {
        id: "02",
        title: "[Replace: work title]",
        meta: "[Replace: year · material · dimensions]",
        src: null,
        file: "public/images/works/work-02.jpg",
        alt: "[Replace: short description of work 02]",
        ratio: "4 / 5",
      },
      {
        id: "03",
        title: "[Replace: work title]",
        meta: "[Replace: year · material · dimensions]",
        src: null,
        file: "public/images/works/work-03.jpg",
        alt: "[Replace: short description of work 03]",
        ratio: "1 / 1",
      },
      {
        id: "04",
        title: "[Replace: work title]",
        meta: "[Replace: year · material · dimensions]",
        src: null,
        file: "public/images/works/work-04.jpg",
        alt: "[Replace: short description of work 04]",
        ratio: "5 / 4",
      },
    ] satisfies Picture[],
  },
  editions: {
    kicker: "03",
    heading: "Editions",
    title: "Postcard edition",
    intro:
      "[Replace: describe the four-design postcard edition — paper, printing, and how someone obtains it.]",
    enquireLabel: "Enquire about this edition",
    enquireSubject: "Postcard edition enquiry",
    cards: [
      {
        id: "01",
        title: "[Replace: design 1 title]",
        meta: "[Replace: design 1 note]",
        src: null,
        file: "public/images/editions/postcard-01.jpg",
        alt: "[Replace: short description of postcard 1]",
        ratio: "3 / 2",
      },
      {
        id: "02",
        title: "[Replace: design 2 title]",
        meta: "[Replace: design 2 note]",
        src: null,
        file: "public/images/editions/postcard-02.jpg",
        alt: "[Replace: short description of postcard 2]",
        ratio: "3 / 2",
      },
      {
        id: "03",
        title: "[Replace: design 3 title]",
        meta: "[Replace: design 3 note]",
        src: null,
        file: "public/images/editions/postcard-03.jpg",
        alt: "[Replace: short description of postcard 3]",
        ratio: "3 / 2",
      },
      {
        id: "04",
        title: "[Replace: design 4 title]",
        meta: "[Replace: design 4 note]",
        src: null,
        file: "public/images/editions/postcard-04.jpg",
        alt: "[Replace: short description of postcard 4]",
        ratio: "3 / 2",
      },
    ] satisfies Picture[],
    facts: [
      { label: "Designs", value: "Four" },
      { label: "Paper", value: "[Replace: paper stock]" },
      { label: "Size", value: "[Replace: dimensions]" },
      { label: "Price", value: "[Replace: price]" },
      { label: "Edition", value: "[Replace: edition size]" },
    ] satisfies Fact[],
  },
  stockists: {
    kicker: "04",
    heading: "For stores",
    intro:
      "[Replace: who this note is for, and what a shop should expect. Do not invent terms.]",
    shops: "[Replace: list of stockists, or delete this line and keep the enquiry only]",
    facts: [
      { label: "Wholesale", value: "[Replace: wholesale terms]" },
      { label: "Minimum", value: "[Replace: minimum order]" },
      { label: "Territories", value: "[Replace: where you supply]" },
      { label: "Lead time", value: "[Replace: lead time]" },
    ] satisfies Fact[],
    submitLabel: "Send enquiry",
    subject: "Stockist enquiry — Earth Painting Project",
    note: "Visual placeholder. Sending opens a mail draft to [Replace: email]. Nothing is stored on this site.",
    opened:
      "If a mail app opened, the draft is addressed to the placeholder email. Replace enquiryEmail in src/content/site.ts before sharing this page.",
    fields: {
      name: "Name",
      shop: "Shop",
      email: "Email",
      message: "Message",
    },
  },
  artist: {
    kicker: "Artist",
    heading: "Jieshin Tseng",
    portrait: {
      src: null as string | null,
      file: "public/images/artist/portrait.jpg",
      alt: "[Replace: portrait description]",
      ratio: "4 / 5",
    },
    paragraphs: [
      "[Replace: biography in the artist’s own words. Leave this unfinished rather than inventing a life story.]",
      "[Replace: second paragraph, if one is needed.]",
    ],
  },
  footer: {
    note: "Placeholder site. Edit text, prices, and stockist terms in src/content/site.ts.",
    top: "Top",
    emailLabel: "[Replace: email]",
  },
};
