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

/** Tech names are proper nouns — identical in both languages. */
export const skills = [
  { name: "PostgreSQL", icon: devicon("postgresql") },
  { name: "NoSQL", icon: null },
  { name: "Docker", icon: devicon("docker") },
  { name: "Vite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" },
  { name: "C++", icon: devicon("cplusplus") },
  { name: "C#", icon: devicon("csharp") },
  { name: "Java", icon: devicon("java") },
  { name: "JavaScript", icon: devicon("javascript") },
  { name: "React", icon: devicon("react") },
  { name: "HTML", icon: devicon("html5") },
  { name: "CSS", icon: devicon("css3") },
  { name: "Access", icon: null },
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
    role: "Application Developer",
    location: "near Zurich, Switzerland",
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
    text: "Building side projects & learning in public — training as an application developer near Zurich.",
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
    toggle: { on: "Open to work", off: "Heads-down" },
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
      "Zurich-based developer, currently studying to become an application developer. I enjoy building things across the stack — from databases to interfaces — and I'm always picking up new tools and languages along the way.",
      "My training is hands-on: I learn a tool by shipping something real with it. That's where Grade Tracker and Traffic Mesh came from — small products built end to end, from the data model out to the interface.",
      "I speak German and English fluently, plus Panjabi, Urdu and Hindi, and enough French to get by.",
    ],
    stats: [
      { value: "2+", label: "Projects shipped" },
      { value: "12", label: "Technologies" },
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

  skillsSection: {
    heading: "Skills & Tools",
    languagesHeading: "Languages",
    educationHeading: "Education",
  },

  languages: [
    { flag: "🇩🇪", name: "German", tag: "fluent" },
    { flag: "🇬🇧", name: "English", tag: "fluent" },
    { flag: "🇮🇳", name: "Panjabi", tag: null as string | null },
    { flag: "🇵🇰", name: "Urdu", tag: null as string | null },
    { flag: "🇮🇳", name: "Hindi", tag: null as string | null },
    { flag: "🇫🇷", name: "French", tag: "basics" },
  ],

  education: {
    title: "Application Development — In Progress",
    desc: "Training to become an application developer near Zurich, Switzerland.",
  },

  footer: {
    heading: "Let's build something.",
    sub: "Application Developer based near Zurich, Switzerland. Open to interesting problems and good collaborators.",
    builtIn: "Built near Zurich",
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
    role: "Applikationsentwickler",
    location: "bei Zürich, Schweiz",
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
    text: "Nebenprojekte bauen, öffentlich dazulernen — in Ausbildung zum Applikationsentwickler bei Zürich.",
  },

  nav: [
    { label: "Start", href: "#home" },
    { label: "Über mich", href: "#about" },
    { label: "Projekte", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Kontakt", href: "#contact" },
  ],

  cta: {
    label: "Kontakt aufnehmen",
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
    toggle: { on: "Offen für Angebote", off: "Im Fokus" },
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
      "Entwickler aus der Region Zürich, aktuell in der Ausbildung zum Applikationsentwickler. Ich baue gerne über den ganzen Stack hinweg — von der Datenbank bis zum Interface — und eigne mir laufend neue Tools und Sprachen an.",
      "Meine Ausbildung ist praxisnah: Ein Tool lerne ich, indem ich etwas Echtes damit baue. Genau so sind Grade Tracker und Traffic Mesh entstanden — kleine Produkte, von Grund auf gebaut, vom Datenmodell bis zur Oberfläche.",
      "Ich spreche fliessend Deutsch und Englisch, dazu Panjabi, Urdu und Hindi — und genug Französisch, um durchzukommen.",
    ],
    stats: [
      { value: "2+", label: "Projekte umgesetzt" },
      { value: "12", label: "Technologien" },
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

  skillsSection: {
    heading: "Skills & Tools",
    languagesHeading: "Sprachen",
    educationHeading: "Ausbildung",
  },

  languages: [
    { flag: "🇩🇪", name: "Deutsch", tag: "fliessend" },
    { flag: "🇬🇧", name: "Englisch", tag: "fliessend" },
    { flag: "🇮🇳", name: "Panjabi", tag: null },
    { flag: "🇵🇰", name: "Urdu", tag: null },
    { flag: "🇮🇳", name: "Hindi", tag: null },
    { flag: "🇫🇷", name: "Französisch", tag: "Grundkenntnisse" },
  ],

  education: {
    title: "Applikationsentwicklung — laufend",
    desc: "Ausbildung zum Applikationsentwickler bei Zürich, Schweiz.",
  },

  footer: {
    heading: "Bauen wir etwas zusammen.",
    sub: "Applikationsentwickler mit Sitz bei Zürich, Schweiz. Offen für spannende Probleme und gute Zusammenarbeit.",
    builtIn: "Gebaut bei Zürich",
    navLabel: "Fusszeile",
  },

  ui: {
    langSwitchLabel: "Sprache wechseln",
    homeLabel: "Angad Singh — Startseite",
  },
};

export type Dict = typeof en;

export const content: Record<Lang, Dict> = { en, de };
