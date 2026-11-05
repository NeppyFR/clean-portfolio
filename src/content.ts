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

/**
 * Portrait shown at the top of the About section.
 *
 * Drop an image in `/public` and point this at it. Roughly 4/5 (portrait)
 * suits the box best; see `Portrait` in `StatsSection.tsx`. Set it back to
 * null and a placeholder avatar of the same shape renders instead, so the
 * layout does not shift either way.
 *
 * Keep the file small — it is served through next/image, which never requests
 * wider than 384px for this box, so anything past ~800px is repo weight for
 * nothing. This one is 800x916 at 86KB; the 1.6MB PNG it replaced looked
 * identical on screen.
 *
 * Defined out here rather than inside `en`/`de` because an asset path is
 * language-invariant — duplicating it in both dictionaries would just give
 * it two places to drift. The alt text *is* translated, under
 * `about.portraitAlt`.
 */
export const PORTRAIT_SRC: string | null = "/angad.jpg";

/**
 * The cinematic interlude that follows the projects grid, currently holding
 * Commerce Platform. While this is false the section is not rendered at all,
 * so it stays the off switch if the section ever holds unfinished work again:
 * pushing to main deploys straight to production.
 */
export const CINEMATIC_ENABLED = true;

/**
 * The public Commerce Platform demo. While this is null the row under the
 * banner shows no link; once the demo is published, only this line changes.
 */
export const COMMERCE_DEMO_URL: string | null = null;

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
 * Grouping follows the CV. The 16 entries here are what the "16 technologies"
 * stat counts — keep them in step. PHP, Git, GitHub, .NET and MongoDB are not
 * on the CV; they were added later.
 *
 * .NET sits under Tools rather than beside C#, because that group is
 * "Programming languages" and .NET is the platform, not the language — the
 * same reason HTML and CSS live under Web.
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
      { name: "MongoDB", icon: devicon("mongodb") },
      { name: "Access", icon: null },
    ],
  },
  {
    key: "tools",
    items: [
      { name: "Git", icon: devicon("git") },
      { name: "GitHub", icon: devicon("github") },
      { name: "Docker", icon: devicon("docker") },
      // `dotnetcore` is the modern .NET logo; devicon's `dot-net` is the
      // legacy .NET Framework one.
      { name: ".NET", icon: devicon("dotnetcore") },
    ],
  },
];

const PROJECT_LINKS = {
  gradeTracker: "https://neppyfr.github.io/gradetracker/",
  trafficMesh: "https://neppyfr.github.io/traffic-mesh/",
  werkhalleRepo: "https://github.com/NeppyFR/werkhalle",
  sentinel: "https://sentinel-shooting-group.ch",
};

/**
 * A project card.
 *
 * `href` makes the whole card a link to a live demo. It is null for a project
 * without one, and the card then renders as a plain div, which is what lets
 * the Werkhalle card hold a button: a button nested inside a link is invalid,
 * and unusable with a keyboard. `repo` is a separate small link for that case.
 *
 * Declared explicitly rather than inferred, because `de: typeof en` would
 * otherwise infer a union of two different item shapes from the array and
 * make `preview` unreachable.
 */
export type ProjectItem = {
  name: string;
  href: string | null;
  desc: string;
  tags: string[];
  repo?: { label: string; href: string };
  /** Renders the animated Werkhalle illustration inside the card. */
  preview?: "werkhalle";
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

  /**
   * The cinematic interlude — consumed by CinematicSection.tsx.
   *
   * The black is not tied to scroll position. Scroll only decides *whether*
   * the page is black: crossing a threshold starts a timed fade that runs to
   * completion on its own, so scrolling further cannot darken it further and
   * the page cannot be left parked on grey. What plays on the black, the
   * title card and then the preview, does follow scroll.
   */
  cinematic: {
    /**
     * Total scroll length of the section, in viewport heights. Its inner
     * screen sticks for all but the last 100vh of it.
     */
    heightVh: 300,
    /** The page goes black when the section's top reaches this viewport line, */
    enter: "start 55%" as const,
    /**
     * and comes back when its bottom reaches this one. Not as the pin lets go:
     * that would fade up on a screen of empty paper. By here the next section
     * is already in view, so the fade reveals something.
     */
    exit: "end 45%" as const,
    /**
     * Deadband on going black, as a fraction of the enter-to-exit range.
     * Without it, a scroll resting exactly on a threshold can flip the state
     * on sub-pixel movement and strobe the whole page.
     */
    hysteresis: 0.01,
    /** Pixels back from the furthest point reached that count as turning back. */
    turnBack: 8,
    /** Milliseconds without movement that count as the page having stopped. */
    stillMs: 200,
    /** Seconds for the page to go black, and to come back. */
    fade: 0.75,
    /**
     * Every stop below is a fraction of the pinned scroll range: 0 the moment
     * the section tops out, 1 when its bottom reaches the foot of the viewport.
     */
    /** title card: in, hold, out */
    titleStops: [0.02, 0.14, 0.4, 0.5] as [number, number, number, number],
    /** each line lags the one above it by this much scroll progress */
    lineStagger: 0.035,
    /**
     * preview: in, hold, out. It starts only once the title has gone: the two
     * share no scroll range, because a bright banner through a fading title
     * reads as a glitch.
     */
    previewStops: [0.5, 0.6, 0.92, 1] as [number, number, number, number],
    /** the preview grows a little as it arrives */
    previewScaleFrom: 0.94,
    /** px of travel on the title lines */
    y: 30,
    /** entry blur, borrowed from the hero */
    blur: 6,
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
    /** Alt text for `PORTRAIT_SRC`. Only used once a real photo is set —
     *  the placeholder is decorative and is hidden from assistive tech. */
    portraitAlt: "Angad Singh",
    portraitPlaceholder: "Photo coming soon",
    paragraphs: [
      "Application-development student near Zurich, with an appetite for the whole breadth of software — from the database through to the interface. I pick up new languages and tools as I go, and I like turning ideas into projects of my own.",
      "My training is hands-on: I learn a tool by shipping something real with it. That's where Grade Tracker and Traffic Mesh came from — small products built end to end, from the data model out to the interface.",
      "I speak German and English fluently, Panjabi as a mother tongue, good Hindi and Urdu, and enough French to get by.",
    ],
    stats: [
      { value: "2+", label: "Projects shipped" },
      { value: "16", label: "Technologies" },
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
        name: "Sentinel Shooting Group",
        href: PROJECT_LINKS.sentinel,
        desc: "A client website for a shooting-sport group in German-speaking Switzerland, with its courses, training and guided sessions. Static pages, no runtime dependencies.",
        tags: ["Node.js", "Cloudflare Workers", "Playwright"],
      },
      {
        name: "Werkhalle",
        // No live demo: it runs on a laptop, so only the code is linked.
        href: null,
        repo: { label: "GitHub", href: PROJECT_LINKS.werkhalleRepo },
        desc: "A mini smart factory with a live digital twin. When a machine breaks, the software notices in about a tenth of a second, tests new plans on a copy of the plant and recommends the best one.",
        tags: [
          "Python",
          "OPC UA",
          "OR-Tools CP-SAT",
          "Simulated Annealing",
          "FastAPI",
          "SQLite",
        ],
        preview: "werkhalle",
      },
    ] as ProjectItem[],
  },

  /** Labels for the animated Werkhalle illustration on the project card. */
  werkhalle: {
    illustration: "Simplified illustration",
    a11yTitle: "Werkhalle production line, illustrated",
    a11yDesc:
      "A seven-machine aluminium extrusion line: casting, two presses, two furnaces, a saw and packaging. Material flows from left to right. Once every loop Press 2 fails, the software detects it, re-plans, and reroutes the work through Press 1 until Press 2 is repaired.",
    button: "Break Press 2",
    buttonRepair: "Repair Press 2",
    faultTag: "Fault",
    chipDetected: "Detected: 96 ms",
    chipReplan: "New plan: 8.8 s",
    scheduleLabel: "Schedule",
    machines: {
      guss: "Casting",
      pr1: "Press 1",
      pr2: "Press 2",
      of1: "Furnace 1",
      of2: "Furnace 2",
      sae: "Saw",
      vp: "Packaging",
    },
  },

  /**
   * The cinematic interlude's copy: the title card, then the row under the
   * banner, which CommerceSlot reads. The banner's own labels are the one
   * exception to "all copy lives here": they ship inside CommercePreview.tsx,
   * a copy of the banner in its source project, recoloured black, with the brand
   * wordmarks removed and a box as the product. Do not overwrite it with the
   * source file.
   */
  cinematic: {
    eyebrow: "The big project",
    badge: "Static demo",
    /** One entry per line. Each gets its own beat in the stagger, so keep
     *  them short: this is a title card, not a paragraph. */
    lines: ["One clothing shop.", "53 staff screens.", "Everything behind it."],
    // "not trading yet" stays: it is true, and the page must not imply a live
    // shop.
    caption:
      "A real shop platform, built and tested but not trading yet. This public version keeps the features and invents the data, so nothing here can charge anyone.",
    /** The caption's first sentence: all the retired card keeps of it. */
    status: "A real shop platform, built and tested but not trading yet.",
    /** Stands in if the section is ever rendered without a preview. */
    slotEmpty: "Preview goes here",
    /** The row under the banner, read by CommerceSlot. */
    name: "Commerce Platform",
    blurb:
      "A complete online shop with its staff system, finances and hosting map, rebuilt as a static demo with invented data.",
    tags: ["Next.js", "TypeScript", "Supabase", "Postgres", "Stripe", "Playwright"],
    demoLink: "Open the demo",
  },

  /** Card beside the featured project. The title is a product name and
   *  stays as-is; the tagline is a sentence, so it gets translated. */
  market: {
    title: "Darwins Market",
    subtitle: "Survival of the fittest strategy. Bots trade, die and evolve.",
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
    portraitAlt: "Angad Singh",
    portraitPlaceholder: "Foto folgt",
    paragraphs: [
      "Lernender in der Applikationsentwicklung bei Zürich, mit Freude an der gesamten Bandbreite der Softwareentwicklung — von der Datenbank bis zur Benutzeroberfläche. Ich eigne mir laufend neue Sprachen und Werkzeuge an und setze Ideen gerne in eigenen Projekten um.",
      "Meine Ausbildung ist praxisnah: Ein Tool lerne ich, indem ich etwas Echtes damit baue. Genau so sind Grade Tracker und Traffic Mesh entstanden — kleine Produkte, von Grund auf gebaut, vom Datenmodell bis zur Oberfläche.",
      "Ich spreche fliessend Deutsch und Englisch, Panjabi als Muttersprache, gut Hindi und Urdu — und genug Französisch, um durchzukommen.",
    ],
    stats: [
      { value: "2+", label: "Projekte umgesetzt" },
      { value: "16", label: "Technologien" },
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
        name: "Sentinel Shooting Group",
        href: PROJECT_LINKS.sentinel,
        desc: "Eine Kundenwebsite für eine Schiesssport-Gruppe in der Deutschschweiz, mit ihren Kursen, Trainings und Schiessguides. Statische Seiten, keine Laufzeit-Abhängigkeiten.",
        tags: ["Node.js", "Cloudflare Workers", "Playwright"],
      },
      {
        name: "Werkhalle",
        href: null,
        repo: { label: "GitHub", href: PROJECT_LINKS.werkhalleRepo },
        desc: "Eine Mini-Smart-Factory mit digitalem Zwilling. Fällt eine Maschine aus, merkt die Software das in etwa einer Zehntelsekunde, testet neue Pläne an einer Kopie des Werks und empfiehlt den besten.",
        tags: [
          "Python",
          "OPC UA",
          "OR-Tools CP-SAT",
          "Simulated Annealing",
          "FastAPI",
          "SQLite",
        ],
        preview: "werkhalle",
      },
    ] as ProjectItem[],
  },

  werkhalle: {
    illustration: "Vereinfachte Darstellung",
    a11yTitle: "Werkhalle-Fertigungslinie, illustriert",
    a11yDesc:
      "Eine Strangpresslinie mit sieben Maschinen: Giessanlage, zwei Pressen, zwei Öfen, Säge und Verpackung. Das Material läuft von links nach rechts. Einmal pro Durchlauf fällt Presse 2 aus, die Software erkennt das, plant neu und leitet die Arbeit über Presse 1, bis Presse 2 repariert ist.",
    button: "Presse 2 ausfallen lassen",
    buttonRepair: "Presse 2 reparieren",
    faultTag: "Störung",
    chipDetected: "Erkannt: 96 ms",
    chipReplan: "Neuer Plan: 8,8 s",
    scheduleLabel: "Plan",
    machines: {
      // Swiss orthography: Giessanlage, never Gießanlage.
      guss: "Giessanlage",
      pr1: "Presse 1",
      pr2: "Presse 2",
      of1: "Ofen 1",
      of2: "Ofen 2",
      sae: "Säge",
      vp: "Verpackung",
    },
  },

  cinematic: {
    eyebrow: "Das grosse Projekt",
    badge: "Statische Demo",
    lines: ["Ein Kleidershop.", "53 Screens fürs Team.", "Und alles dahinter."],
    caption:
      "Eine echte Shop-Plattform, gebaut und getestet, aber noch ohne Handel. Diese öffentliche Version behält die Funktionen und erfindet die Daten, darum kann hier niemand belastet werden.",
    status: "Eine echte Shop-Plattform, gebaut und getestet, aber noch ohne Handel.",
    slotEmpty: "Vorschau kommt hierhin",
    name: "Commerce Platform",
    blurb:
      "Ein kompletter Onlineshop mit Team-System, Finanzen und Hosting-Karte, als statische Demo mit erfundenen Daten nachgebaut.",
    tags: ["Next.js", "TypeScript", "Supabase", "Postgres", "Stripe", "Playwright"],
    demoLink: "Demo öffnen",
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
