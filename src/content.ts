/**
 * ─────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH FOR ALL SITE COPY
 *  Edit this file to change the site. No component needs touching.
 *
 *  Content marked {{PLACEHOLDER}} could not be found on
 *  https://singh-angad.ch and needs your input.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Angad Singh",
  initials: "AS",
  role: "Application Developer",
  location: "near Zurich, Switzerland",
  /** Oversized faint wordmark across the bottom of the hero */
  wordmark: "ANGAD",
};

/**
 * Hero headline. Each string is one animated line.
 * Keep them short — the per-line stagger reads best at ~5 lines.
 */
export const heroLines = [
  "Building",
  "thoughtful applications",
  "that solve real problems",
  "and feel effortless",
  "to use.",
];

/** Small status card, upper right of the hero. */
export const heroStatus = {
  label: "Currently",
  text: "Building side projects & learning in public — training as an application developer near Zurich.",
};

export const nav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const cta = {
  label: "Let's talk",
  // Scrolls to the contact footer. Swap for "mailto:you@example.com" once
  // you've decided which address should be public.
  href: "#contact",
};

export const socials = [
  { label: "GitHub", href: "https://github.com/neppyfr", icon: "github" },
  // {{PLACEHOLDER}} — set to "mailto:your@address" to enable the email icon
  { label: "Email", href: "{{PLACEHOLDER_EMAIL}}", icon: "mail" },
  // {{PLACEHOLDER}} — LinkedIn URL not listed on singh-angad.ch
  { label: "LinkedIn", href: "{{PLACEHOLDER_LINKEDIN}}", icon: "linkedin" },
] as const;

/* ── Highlight section (light) ───────────────────────────── */

export const highlight = {
  heading: "Shipping polished software from day one",
  sub: "From databases to interfaces — picking up new tools and languages along the way.",
  button: { label: "View projects", href: "#projects" },
  /** Floating stack cards that scale in on scroll. */
  cards: [
    { title: "JavaScript", meta: "React · Vite" },
    { title: "C# / Java", meta: "Typed & OOP" },
    { title: "PostgreSQL", meta: "SQL & NoSQL" },
    { title: "Learn more", meta: "Full stack", isCta: true, href: "#skills" },
  ],
};

/* ── Feature section (light) ─────────────────────────────── */

export const feature = {
  /** Rendered solid black. */
  headingStrong: "Discover the projects I've designed and built,",
  /** Rendered light gray, continuing the same sentence. */
  headingMuted:
    "that turn messy requirements into clean, reliable applications people actually enjoy using.",
  media: {
    title: "Traffic Mesh",
    caption: "Emergent traffic flow — no lights, no stop signs.",
    href: "https://neppyfr.github.io/traffic-mesh/",
    /**
     * Drop an .mp4/.webm in /public and set this to e.g. "/traffic-mesh.mp4".
     * When null, an animated canvas stand-in of the simulation is used so the
     * play/pause control is still real and working.
     */
    videoSrc: null as string | null,
  },
  /** {{PLACEHOLDER}} — no testimonial or recommendation exists on singh-angad.ch. */
  testimonial: {
    quote: "{{PLACEHOLDER_TESTIMONIAL_QUOTE}}",
    name: "{{PLACEHOLDER_NAME}}",
    role: "{{PLACEHOLDER_ROLE}}",
    tag: "{{PLACEHOLDER_TAG}}",
    avatar: null as string | null,
  },
};

/* ── Stats / about section (light) ───────────────────────── */

export const about = {
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
};

/* ── Projects ────────────────────────────────────────────── */

export const projects = [
  {
    name: "Grade Tracker",
    href: "https://neppyfr.github.io/gradetracker/",
    desc: "A web app for tracking school grades on the Swiss 1–6 scale, with weighted exams, live per-class averages, and cloud sync.",
    tags: ["React", "Vite", "Cloud sync"],
  },
  {
    name: "Traffic Mesh",
    href: "https://neppyfr.github.io/traffic-mesh/",
    desc: "A traffic simulation with no lights and no stop signs — every car runs the same rule to negotiate each crossing, on a demo grid or on real city streets.",
    tags: ["JavaScript", "Canvas", "Simulation"],
  },
];

/* ── Skills ──────────────────────────────────────────────── */

const devicon = (slug: string, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg`;

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

export const languages = [
  { flag: "🇩🇪", name: "German", tag: "fluent" },
  { flag: "🇬🇧", name: "English", tag: "fluent" },
  { flag: "🇮🇳", name: "Panjabi", tag: null },
  { flag: "🇵🇰", name: "Urdu", tag: null },
  { flag: "🇮🇳", name: "Hindi", tag: null },
  { flag: "🇫🇷", name: "French", tag: "basics" },
];

export const education = {
  title: "Application Development — In Progress",
  desc: "Training to become an application developer near Zurich, Switzerland.",
};

/* ── Motion constants ────────────────────────────────────────
 * Exact hero entrance timing, per spec. Change here to retune.
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
};
