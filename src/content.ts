/**
 * ─────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH FOR ALL SITE COPY — EN + DE
 *
 *  Every user-visible string lives here. To change copy, edit
 *  `en` and `de` below; no component needs touching.
 *
 *  German uses Swiss orthography: "ss" everywhere, never "ß".
 *
 *  Content marked {{PLACEHOLDER}} could not be found on
 *  https://singh-angad.ch and needs your input.
 * ─────────────────────────────────────────────────────────────
 */

export type Lang = "en" | "de";

export const LANGS: Lang[] = ["en", "de"];

export const LANG_LABELS: Record<Lang, { short: string; full: string }> = {
  en: { short: "EN", full: "English" },
  de: { short: "DE", full: "Deutsch" },
};

/* ── Language-invariant data ─────────────────────────────────
 * Links, tech names and icons are identical in both languages,
 * so they're defined once and shared.
 */

export type IconName = "github" | "linkedin" | "mail";

/** Public contact address — used by the email icon and both CTA buttons. */
export const EMAIL = "contact@singh-angad.ch";

export const socials: { label: string; href: string; icon: IconName }[] = [
  { label: "GitHub", href: "https://github.com/neppyfr", icon: "github" },
  { label: "Email", href: `mailto:${EMAIL}`, icon: "mail" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/angad-singh-3148b5347/",
    icon: "linkedin",
  },
];

const devicon = (slug: string, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg`;

export type SkillGroupKey = "programming" | "web" | "databases" | "tools";

/**
 * Tech names are proper nouns — identical in both languages, so they live
 * out here. The group *labels* are not, and are translated under
 * `skillsSection.groups`.
 *
 * Grouping follows the CV. The 15 entries here are what the "15 technologies"
 * stat counts — keep them in step. PHP, Git and GitHub are not on the CV;
 * they were added later.
 */
export const skillGroups: {
  key: SkillGroupKey;
  items: { name: string; icon: string | null }[];
}[] = [
  {
    key: "programming",
    items: [
      { name: "C++", icon: devicon("cplusplus") },
      { name: "C#", icon: devicon("csharp") },
      { name: "Java", icon: devicon("java") },
      { name: "JavaScript", icon: devicon("javascript") },
      { name: "PHP", icon: devicon("php") },
    ],
  },
  {
    key: "web",
    items: [
      { name: "HTML", icon: devicon("html5") },
      { name: "CSS", icon: devicon("css3") },
      { name: "React", icon: devicon("react") },
      {
        name: "Vite",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
      },
    ],
  },
  {
    key: "databases",
    items: [
      { name: "PostgreSQL", icon: devicon("postgresql") },
      { name: "NoSQL", icon: null },
      { name: "Access", icon: null },
    ],
  },
  {
    key: "tools",
    items: [
      { name: "Git", icon: devicon("git") },
      { name: "GitHub", icon: devicon("github") },
      { name: "Docker", icon: devicon("docker") },
    ],
  },
];

const PROJECT_LINKS = {
  gradeTracker: "https://neppyfr.github.io/gradetracker/",
  trafficMesh: "https://neppyfr.github.io/traffic-mesh/",
};

/* ── Motion constants (language-invariant) ───────────────────
 * Exact hero entrance timing. Change here to retune.
 */
export const motionSpec = {
  /** cubic-bezier ease-out used across the hero */
  ease: [0.22, 1, 0.36, 1] as const,
  line: { duration: 0.7, y: -24, blur: 4 },
  staggerChildren: 0.1,
  /** delays measured from the moment the headline starts */
  navbarDelay: 0.2,
  statusCardDelay: 0.75,
  wordmarkDelay: 1.05,
  wordmarkDuration: 1.2,

  /** Scroll-reveal tuning — consumed by Reveal.tsx. */
  reveal: {
    duration: 0.75,
    /** starting offset in px; larger = more visible travel */
    y: 44,
    /** fraction of the element that must be in view before firing */
    amount: 0.2,
    /**
     * Shrinks the detection box from the bottom, so an element must travel
     * further up the screen before it counts as visible. This is what makes
     * reveals fire *later* — without it they complete off-screen and you
     * never see them.
     */
    margin: "0px 0px -22% 0px",
    /** offset between adjacent items, giving the cascade */
    stagger: 0.14,
  },
};

/* ── ENGLISH ─────────────────────────────────────────────── */

const en = {
  site: {
    name: "Angad Singh",
    initials: "AS",
    // "in training" rather than the bare title: the CV says "angehender
    // Applikationsentwickler EFZ", and the EFZ isn't earned until 2029.
    role: "Application Developer in training",
    location: "in Adliswil, near Zurich",
    /** Oversized faint wordmark across the bottom of the hero */
    wordmark: "ANGAD",
  },

  /** Hero headline — each string is one animated line. */
  heroLines: [
    "Building",
    "thoughtful applications",
    "that solve real problems",
    "and feel effortless",
    "to use.",
  ],

  heroStatus: {
    label: "Currently",
    text: "Training as an application developer near Zurich — and looking for an internship placement for Summer 2027 to Summer 2029.",
  },

  nav: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ],

  cta: {
    label: "Let's talk",
    href: `mailto:${EMAIL}`,
  },

  highlight: {
    heading: "Shipping polished software from day one",
    sub: "From databases to interfaces — picking up new tools and languages along the way.",
    button: { label: "View projects", href: "#projects" },
    cards: [
      { title: "JavaScript", meta: "React · Vite" },
      { title: "C# / Java", meta: "Typed & OOP" },
      { title: "PostgreSQL", meta: "SQL & NoSQL" },
      { title: "Learn more", meta: "Full stack", isCta: true, href: "#skills" },
    ],
    toggle: { on: "Seeking an internship", off: "Heads-down" },
  },

  feature: {
    /** Rendered solid black. */
    headingStrong: "Discover the projects I've designed and built,",
    /** Rendered light gray, continuing the same sentence. */
    headingMuted:
      "that turn messy requirements into clean, reliable applications people actually enjoy using.",
    media: {
      title: "Traffic Mesh",
      caption: "Emergent traffic flow — no lights, no stop signs.",
      href: PROJECT_LINKS.trafficMesh,
      linkLabel: "Live demo",
      playLabel: "Play preview",
      pauseLabel: "Pause preview",
      /**
       * Drop an .mp4/.webm in /public and set this to e.g. "/traffic-mesh.mp4".
       * When null, an animated canvas stand-in is used so play/pause stays real.
       */
      videoSrc: null as string | null,
    },
    /** {{PLACEHOLDER}} — no testimonial exists on singh-angad.ch. */
    testimonial: {
      quote: "{{PLACEHOLDER_TESTIMONIAL_QUOTE}}",
      name: "{{PLACEHOLDER_NAME}}",
      role: "{{PLACEHOLDER_ROLE}}",
      tag: "{{PLACEHOLDER_TAG}}",
      avatar: null as string | null,
      badge: "Placeholder",
      emptyLead: "No testimonial or recommendation was found on singh-angad.ch. Add a real quote in",
      emptyMid: "under",
      emptyTail: "and this card renders normally.",
      emptyNote: "Nothing invented here on purpose.",
    },
  },

  about: {
    heading: "About",
    paragraphs: [
      "Application-development student near Zurich, with an appetite for the whole breadth of software — from the database through to the interface. I pick up new languages and tools as I go, and I like turning ideas into projects of my own.",
      "My training is hands-on: I learn a tool by shipping something real with it. That's where Grade Tracker and Traffic Mesh came from — small products built end to end, from the data model out to the interface.",
      "I speak German and English fluently, Panjabi as a mother tongue, good Hindi and Urdu, and enough French to get by.",
    ],
    stats: [
      { value: "2+", label: "Projects shipped" },
      { value: "15", label: "Technologies" },
      { value: "6", label: "Languages spoken" },
    ],
  },

  projects: {
    heading: "Projects",
    items: [
      {
        name: "Grade Tracker",
        href: PROJECT_LINKS.gradeTracker,
        desc: "A web app for tracking school grades on the Swiss 1–6 scale, with weighted exams, live per-class averages, and cloud sync.",
        tags: ["React", "Vite", "Cloud sync"],
      },
      {
        name: "Traffic Mesh",
        href: PROJECT_LINKS.trafficMesh,
        desc: "A traffic simulation with no lights and no stop signs — every car runs the same rule to negotiate each crossing, on a demo grid or on real city streets.",
        tags: ["JavaScript", "Canvas", "Simulation"],
      },
    ],
  },

  /** Card beside the featured project. The title is a product name and
   *  stays as-is; the tagline is a sentence, so it gets translated. */
  market: {
    title: "Darwins Market",
    subtitle: "Survival of the fittest strategy. bots trade, die and evolve.",
    comingSoon: "Coming soon",
    unavailable: "Market data unavailable right now.",
    chartLabel: "Bitcoin candlestick chart, last 4 hours in 5 minute candles",
  },

  skillsSection: {
    heading: "Skills & Tools",
    languagesHeading: "Languages",
    /** Labels for `skillGroups` — keyed by `SkillGroupKey`. */
    groups: {
      programming: "Programming languages",
      web: "Web",
      databases: "Databases",
      tools: "Tools",
    },
  },

  languages: [
    { flag: "🇩🇪", name: "German", tag: "fluent" },
    { flag: "🇬🇧", name: "English", tag: "fluent" },
    { flag: "🇮🇳", name: "Panjabi", tag: "mother tongue" },
    { flag: "🇮🇳", name: "Hindi", tag: "good" },
    { flag: "🇵🇰", name: "Urdu", tag: "good" },
    { flag: "🇫🇷", name: "French", tag: "basics" },
  ],

  /** CV timeline. `period` is rendered in a right-aligned column, so keep it
   *  short enough to sit on one line next to the title in both languages. */
  resume: {
    heading: "Résumé",
    educationHeading: "Education",
    experienceHeading: "Experience",
    seeking: {
      label: "Looking for",
      text: "An internship placement for the practical half of my apprenticeship, from Summer 2027 to Summer 2029.",
    },
    education: [
      {
        title: "Application Developer EFZ (in training)",
        org: "Benedict-Schule, Zürich",
        period: "Summer 2025 – Summer 2029",
        bullets: [
          "School-based foundation in software development — programming, databases and web.",
          "The practical half runs in a company: an internship from Summer 2027 to Summer 2029.",
        ],
      },
      {
        title: "Informatikmittelschule (IMS)",
        org: "IMS Sargans",
        period: "2024 – 2025",
        bullets: [
          "IT-focused secondary education on the vocational baccalaureate track.",
        ],
      },
      {
        title: "Secondary school",
        org: "Adliswil",
        period: "until 2024",
        bullets: ["Completed compulsory education."],
      },
    ],
    experience: [
      {
        title: "Web development assistant",
        org: "Free Mind Tech AG",
        period: "2025 · short assignment",
        bullets: [
          "Helped build and maintain websites over a few weeks.",
          "A first look inside a professional development environment.",
        ],
      },
    ],
  },

  footer: {
    heading: "Let's build something.",
    sub: "Application developer in training, based in Adliswil near Zurich. Looking for an internship placement for Summer 2027 to Summer 2029, and open to interesting problems.",
    builtIn: "Built in Adliswil",
    navLabel: "Footer",
  },

  ui: {
    langSwitchLabel: "Switch language",
    homeLabel: "Angad Singh — home",
  },
};

/* ── GERMAN (Swiss orthography: ss, never ß) ─────────────── */

const de: typeof en = {
  site: {
    name: "Angad Singh",
    initials: "AS",
    role: "Applikationsentwickler EFZ in Ausbildung",
    location: "in Adliswil bei Zürich",
    wordmark: "ANGAD",
  },

  // Kept to roughly the same line lengths as the English version — German
  // runs ~25% longer, so the lines are trimmed to stop them wrapping and
  // turning the 5-line stagger into 9 visual rows.
  heroLines: [
    "Ich baue",
    "durchdachte Software,",
    "die echte Probleme löst",
    "und sich mühelos",
    "bedienen lässt.",
  ],

  heroStatus: {
    label: "Aktuell",
    text: "In Ausbildung zum Applikationsentwickler bei Zürich — und auf der Suche nach einem Praktikumsplatz für Sommer 2027 bis Sommer 2029.",
  },

  nav: [
    { label: "Start", href: "#home" },
    { label: "Über mich", href: "#about" },
    { label: "Projekte", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Kontakt", href: "#contact" },
  ],

  cta: {
    // Short on purpose: the compact navbar pill has to fit five German nav
    // labels, the language switch and this button. "Kontakt aufnehmen"
    // overflowed.
    label: "Schreib mir",
    href: `mailto:${EMAIL}`,
  },

  highlight: {
    heading: "Ausgereifte Software vom ersten Tag an",
    sub: "Von der Datenbank bis zum Interface — und laufend neue Tools und Sprachen dazu.",
    button: { label: "Projekte ansehen", href: "#projects" },
    cards: [
      { title: "JavaScript", meta: "React · Vite" },
      { title: "C# / Java", meta: "Typisiert & OOP" },
      { title: "PostgreSQL", meta: "SQL & NoSQL" },
      { title: "Mehr erfahren", meta: "Full Stack", isCta: true, href: "#skills" },
    ],
    toggle: { on: "Praktikum gesucht", off: "Im Fokus" },
  },

  feature: {
    headingStrong: "Entdecke die Projekte, die ich entworfen und gebaut habe,",
    headingMuted:
      "die aus unklaren Anforderungen saubere, zuverlässige Applikationen machen, die man wirklich gerne benutzt.",
    media: {
      title: "Traffic Mesh",
      caption: "Emergenter Verkehrsfluss — keine Ampeln, keine Stoppschilder.",
      href: PROJECT_LINKS.trafficMesh,
      linkLabel: "Live-Demo",
      playLabel: "Vorschau abspielen",
      pauseLabel: "Vorschau pausieren",
      videoSrc: null as string | null,
    },
    testimonial: {
      quote: "{{PLACEHOLDER_TESTIMONIAL_QUOTE}}",
      name: "{{PLACEHOLDER_NAME}}",
      role: "{{PLACEHOLDER_ROLE}}",
      tag: "{{PLACEHOLDER_TAG}}",
      avatar: null as string | null,
      badge: "Platzhalter",
      emptyLead: "Auf singh-angad.ch war keine Referenz oder Empfehlung zu finden. Trage ein echtes Zitat in",
      emptyMid: "unter",
      emptyTail: "ein, dann wird diese Karte normal dargestellt.",
      emptyNote: "Hier wurde bewusst nichts erfunden.",
    },
  },

  about: {
    heading: "Über mich",
    paragraphs: [
      "Lernender in der Applikationsentwicklung bei Zürich, mit Freude an der gesamten Bandbreite der Softwareentwicklung — von der Datenbank bis zur Benutzeroberfläche. Ich eigne mir laufend neue Sprachen und Werkzeuge an und setze Ideen gerne in eigenen Projekten um.",
      "Meine Ausbildung ist praxisnah: Ein Tool lerne ich, indem ich etwas Echtes damit baue. Genau so sind Grade Tracker und Traffic Mesh entstanden — kleine Produkte, von Grund auf gebaut, vom Datenmodell bis zur Oberfläche.",
      "Ich spreche fliessend Deutsch und Englisch, Panjabi als Muttersprache, gut Hindi und Urdu — und genug Französisch, um durchzukommen.",
    ],
    stats: [
      { value: "2+", label: "Projekte umgesetzt" },
      { value: "15", label: "Technologien" },
      { value: "6", label: "Sprachen" },
    ],
  },

  projects: {
    heading: "Projekte",
    items: [
      {
        name: "Grade Tracker",
        href: PROJECT_LINKS.gradeTracker,
        desc: "Eine Web-App zum Verfolgen von Schulnoten auf der Schweizer Skala 1–6, mit gewichteten Prüfungen, laufenden Fachdurchschnitten und Cloud-Sync.",
        tags: ["React", "Vite", "Cloud-Sync"],
      },
      {
        name: "Traffic Mesh",
        href: PROJECT_LINKS.trafficMesh,
        desc: "Eine Verkehrssimulation ohne Ampeln und Stoppschilder — jedes Auto folgt derselben Regel, um jede Kreuzung auszuhandeln, auf einem Demo-Raster oder auf echten Stadtstrassen.",
        tags: ["JavaScript", "Canvas", "Simulation"],
      },
    ],
  },

  market: {
    title: "Darwins Market",
    // "entwickeln" alone is transitive; evolving needs the reflexive "sich".
    subtitle: "Survival of the fittest. Bots traden, sterben und entwickeln sich.",
    comingSoon: "Demnächst",
    unavailable: "Marktdaten derzeit nicht verfügbar.",
    chartLabel: "Bitcoin-Kerzenchart, letzte 4 Stunden in 5-Minuten-Kerzen",
  },

  skillsSection: {
    heading: "Skills & Tools",
    languagesHeading: "Sprachen",
    groups: {
      programming: "Programmiersprachen",
      web: "Web",
      databases: "Datenbanken",
      tools: "Werkzeuge",
    },
  },

  languages: [
    { flag: "🇩🇪", name: "Deutsch", tag: "fliessend" },
    { flag: "🇬🇧", name: "Englisch", tag: "fliessend" },
    { flag: "🇮🇳", name: "Panjabi", tag: "Muttersprache" },
    { flag: "🇮🇳", name: "Hindi", tag: "gut" },
    { flag: "🇵🇰", name: "Urdu", tag: "gut" },
    { flag: "🇫🇷", name: "Französisch", tag: "Grundkenntnisse" },
  ],

  resume: {
    heading: "Lebenslauf",
    educationHeading: "Ausbildung",
    experienceHeading: "Praktische Erfahrung",
    seeking: {
      label: "Gesucht",
      text: "Ein Praktikumsplatz für den praktischen Teil meiner Ausbildung, von Sommer 2027 bis Sommer 2029.",
    },
    education: [
      {
        title: "Applikationsentwickler EFZ (in Ausbildung)",
        org: "Benedict-Schule, Zürich",
        period: "Sommer 2025 – Sommer 2029",
        bullets: [
          "Schulisch organisierte Grundbildung in Softwareentwicklung — Programmierung, Datenbanken und Web.",
          "Der praktische Teil findet im Betrieb statt: ein Praktikum von Sommer 2027 bis Sommer 2029.",
        ],
      },
      {
        title: "Informatikmittelschule (IMS)",
        org: "IMS Sargans",
        period: "2024 – 2025",
        bullets: [
          "Informatik- und berufsmaturitätsorientierte Ausbildung.",
        ],
      },
      {
        title: "Sekundarschule",
        org: "Adliswil",
        period: "bis 2024",
        bullets: ["Abschluss der obligatorischen Schulzeit."],
      },
    ],
    experience: [
      {
        title: "Aushilfe Webentwicklung",
        org: "Free Mind Tech AG",
        period: "2025 · Kurzeinsatz",
        bullets: [
          "Während einiger Wochen bei der Erstellung und Pflege von Websites mitgeholfen.",
          "Erster Einblick in ein professionelles Entwicklungsumfeld.",
        ],
      },
    ],
  },

  footer: {
    heading: "Bauen wir etwas zusammen.",
    sub: "Applikationsentwickler EFZ in Ausbildung, mit Sitz in Adliswil bei Zürich. Auf der Suche nach einem Praktikumsplatz für Sommer 2027 bis Sommer 2029 und offen für spannende Probleme.",
    builtIn: "Gebaut in Adliswil",
    navLabel: "Fusszeile",
  },

  ui: {
    langSwitchLabel: "Sprache wechseln",
    homeLabel: "Angad Singh — Startseite",
  },
};

export type Dict = typeof en;

export const content: Record<Lang, Dict> = { en, de };
