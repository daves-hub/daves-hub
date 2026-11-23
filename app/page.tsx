import Link from "next/link";

function formatDuration(startDateStr: string, endDateStr?: string): string {
  const start = new Date(startDateStr);
  const end = endDateStr ? new Date(endDateStr) : new Date();

  let totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    1; // inclusive of starting month

  if (totalMonths < 1) totalMonths = 1;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  return parts.join(" ");
}

function formatTotalExperience(
  roles: { startDate: string; endDate?: string }[],
): string {
  const totalMonths = roles.reduce((acc, role) => {
    const start = new Date(role.startDate);
    const end = role.endDate ? new Date(role.endDate) : new Date();
    const diff =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth()) +
      1;
    return acc + Math.max(1, diff);
  }, 0);

  const years = (totalMonths / 12).toFixed(1);
  return `${years} yrs`;
}

async function getLiveStats() {
  try {
    const [cfInfoRes, cfStatusRes, ghUserRes] = await Promise.all([
      fetch("https://codeforces.com/api/user.info?handles=daveshub", {
        next: { revalidate: 3600 },
      }),
      fetch("https://codeforces.com/api/user.status?handle=daveshub", {
        next: { revalidate: 3600 },
      }),
      fetch("https://api.github.com/users/daves-hub", {
        next: { revalidate: 3600 },
        headers: { Accept: "application/vnd.github.v3+json" },
      }),
    ]);

    let cfSolved = "600+";
    let cfMaxRating = "1266";

    if (cfInfoRes.ok) {
      const infoJson = await cfInfoRes.json();
      const user = infoJson?.result?.[0];
      if (user?.maxRating) cfMaxRating = String(user.maxRating);
    }

    if (cfStatusRes.ok) {
      const statusJson = await cfStatusRes.json();
      if (statusJson?.status === "OK" && Array.isArray(statusJson.result)) {
        const solvedSet = new Set<string>();
        for (const sub of statusJson.result) {
          if (sub.verdict === "OK" && sub.problem) {
            solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
          }
        }
        if (solvedSet.size > 0) {
          cfSolved = `${solvedSet.size}`;
        }
      }
    }

    let publicRepos = "25+";
    if (ghUserRes.ok) {
      const ghJson = await ghUserRes.json();
      if (typeof ghJson?.public_repos === "number") {
        publicRepos = `${ghJson.public_repos}`;
      }
    }

    return { cfSolved, cfMaxRating, publicRepos };
  } catch {
    return { cfSolved: "608", cfMaxRating: "1266", publicRepos: "25+" };
  }
}

const EXPERIENCE = [
  {
    role: "Full-Stack Developer",
    company: "Zkyte Technologies Ltd.",
    startDate: "2025-11-01",
    periodLabel: "Nov 2025 — Present",
    location: "Remote",
    current: true,
    highlights: [
      "Engineer production web applications using React, Next.js, TypeScript, and Tailwind CSS across platforms including Nationwide League One (NLO), National Women Football League (NWFL), CreatorBlock, and TinDrop.",
      "Integrate REST APIs via OpenAPI-generated TypeScript SDKs (Hey API) and manage asynchronous server state and caching with TanStack Query.",
      "Conduct code reviews and provide technical guidance to maintain clean, type-safe, and scalable frontend architecture.",
    ],
  },
  {
    role: "Web Developer Intern",
    company: "Gheli Technology Solutions",
    startDate: "2025-06-01",
    endDate: "2025-07-31",
    periodLabel: "Jun 2025 — Jul 2025",
    location: "Benin City, Nigeria",
    current: false,
    highlights: [
      "Built mobile-oriented component interfaces using Ionic React and designed high-fidelity UI/UX wireframes in Figma.",
    ],
  },
];

const PROJECTS = [
  {
    index: "01",
    title: "Kanny Kanban",
    tag: "Full-Stack App",
    description:
      "Multi-project Kanban management platform featuring position-based drag-and-drop task ordering, JWT authentication, role-aware route protection, and centralized Zod validation.",
    stack: ["Next.js", "TypeScript", "Express", "PostgreSQL", "Prisma"],
    links: [
      {
        label: "Frontend",
        href: "https://github.com/daves-hub/kanny-kanban-frontend",
      },
      {
        label: "Backend",
        href: "https://github.com/daves-hub/kanny-kanban-backend",
      },
    ],
  },
  {
    index: "02",
    title: "Stateless-Verifier Authentication",
    tag: "Cryptography Research",
    description:
      "B.Sc. thesis mathematical model and Python reference implementation for offline one-time password generation and O(1) constant-time verification using Ed25519 signatures and SHA-512 hash ratchets.",
    stack: ["Python", "Ed25519", "SHA-512", "Cryptography"],
    links: [
      {
        label: "Thesis & Code",
        href: "https://github.com/daves-hub/my-fy-project",
      },
    ],
  },
  {
    index: "03",
    title: "Solo Leveling Reader",
    tag: "PWA Web App",
    description:
      "Responsive web reader built with Next.js App Router featuring progressive image loading, chapter navigation, dark mode, and offline-ready PWA caching.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    links: [{ label: "GitHub", href: "https://github.com/daves-hub/slreader" }],
  },
  {
    index: "04",
    title: "NAMSNLIB",
    tag: "Digital Library",
    description:
      "Digital mathematics library built for University of Benin students to organize, search, and access categorized academic resources.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Figma"],
    links: [{ label: "GitHub", href: "https://github.com/namsnlib/namsnlib" }],
  },
  {
    index: "05",
    title: "Enigma Machine Emulator",
    tag: "Applied Cryptography",
    description:
      "Python CLI emulator replicating the WWII Enigma cipher machine with configurable rotor stepping, plugboard pair substitutions, ring settings, and reversible encryption/decryption.",
    stack: ["Python", "Cryptography", "CLI"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/daves-hub/Cryptography/tree/main/Enigma%20cipher",
      },
    ],
  },
  {
    index: "06",
    title: "Browser Chess Engine",
    tag: "Game Logic",
    description:
      "Zero-dependency browser chess implementation built from scratch in vanilla JavaScript, handling legal move validation, turn state, board rendering, and piece interaction.",
    stack: ["JavaScript", "HTML5", "CSS3"],
    links: [
      { label: "GitHub", href: "https://github.com/daves-hub/Chess-Game" },
    ],
  },
];

const STACK = [
  {
    category: "Frontend",
    items: [
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "shadcn/ui",
      "TanStack Query",
      "Zustand",
    ],
  },
  {
    category: "Backend & Data",
    items: [
      "Node.js",
      "Express",
      "Hono",
      "PostgreSQL",
      "Prisma ORM",
      "Redis",
      "Supabase",
      "Firebase",
    ],
  },
  {
    category: "APIs & Tooling",
    items: [
      "OpenAPI",
      "Hey API",
      "Zod",
      "Git",
      "Linux",
      "Bash",
      "Vercel",
      "cURL",
    ],
  },
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "C++", "SQL"],
  },
];

export default async function Home() {
  const stats = await getLiveStats();
  const totalExperience = formatTotalExperience(EXPERIENCE);

  return (
    <div className="relative min-h-screen">
      <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-zinc-50/80 backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-3 font-mono text-xs">
          <Link
            href="#hero"
            className="font-medium text-zinc-900 transition-opacity hover:opacity-75 dark:text-zinc-100"
          >
            daveshub
            <span className="text-emerald-600 dark:text-emerald-400">
              .vercel.app
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5 text-zinc-500 dark:text-zinc-400">
            <Link
              href="#experience"
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              work
            </Link>
            <Link
              href="#projects"
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              projects
            </Link>
            <Link
              href="#stack"
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              stack
            </Link>
            <Link
              href="#contact"
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              contact
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl space-y-24 px-6 py-16 sm:py-24">
        {/* Hero */}
        <section id="hero" className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] text-emerald-700 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Open to remote frontend &amp; full-stack roles
          </div>

          <div className="space-y-1.5">
            <h1 className="font-serif text-4xl italic tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
              Genesis Osasenaga Ighalo
            </h1>
            <p
              role="presentation"
              aria-label="Pronunciation"
              className="font-mono text-xs text-zinc-400 dark:text-zinc-500"
            >
              /ˈdʒɛn.ə.sɪs ɔ.sa.sɛˈna.ɡa iˈɣa.loʊ/
            </p>
            <p className="pt-1 font-mono text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Full-Stack Developer · React · Next.js · TypeScript
            </p>
          </div>

          <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            I engineer fast, type-safe web applications and dig into the systems
            behind them—from modular frontend architecture and generated API
            contracts to caching pipelines and offline cryptographic protocols.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 font-mono text-xs">
            <Link
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-zinc-900 px-4 py-2 font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              Download Resume ↗
            </Link>
            <Link
              href="https://github.com/daves-hub"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-zinc-200 bg-white/70 px-3.5 py-2 text-zinc-700 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
            >
              GitHub
            </Link>
            <Link
              href="https://www.linkedin.com/in/genesis-ighalo"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-zinc-200 bg-white/70 px-3.5 py-2 text-zinc-700 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
            >
              LinkedIn
            </Link>
            <Link
              href="https://codeforces.com/profile/daveshub"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-zinc-200 bg-white/70 px-3.5 py-2 text-zinc-700 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
            >
              Codeforces
            </Link>
          </div>
        </section>

        {/* Live Stats Strip */}
        <section
          aria-label="Live developer metrics"
          className="grid grid-cols-2 divide-y divide-zinc-200/80 rounded-xl border border-zinc-200/80 bg-white/60 py-4 backdrop-blur-sm sm:grid-cols-4 sm:divide-x sm:divide-y-0 dark:divide-zinc-800/80 dark:border-zinc-800/80 dark:bg-zinc-900/40"
        >
          <div className="px-4 py-2 text-center sm:py-0">
            <div className="font-serif text-2xl italic text-zinc-900 dark:text-zinc-100">
              {totalExperience}
            </div>
            <div className="mt-0.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              Industry Exp
            </div>
          </div>

          <div className="px-4 py-2 text-center sm:py-0">
            <div className="font-serif text-2xl italic text-zinc-900 dark:text-zinc-100">
              {stats.cfSolved}
            </div>
            <div className="mt-0.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              CF Solved (Max {stats.cfMaxRating})
            </div>
          </div>

          <div className="px-4 py-2 text-center sm:py-0">
            <div className="font-serif text-2xl italic text-zinc-900 dark:text-zinc-100">
              3.87<span className="text-sm not-italic text-zinc-400">/5.0</span>
            </div>
            <div className="mt-0.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              B.Sc. CS · UNIBEN
            </div>
          </div>

          <div className="px-4 py-2 text-center sm:py-0">
            <div className="font-serif text-2xl italic text-zinc-900 dark:text-zinc-100">
              4th Place
            </div>
            <div className="mt-0.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              UNILAG DevSprint
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="space-y-8">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl italic text-zinc-900 dark:text-zinc-100">
              Experience
            </h2>
            <div className="h-px flex-1 bg-zinc-200/80 dark:bg-zinc-800/80" />
          </div>

          <div className="relative space-y-10 border-l border-zinc-200 pl-6 dark:border-zinc-800">
            {EXPERIENCE.map((job) => {
              const duration = formatDuration(job.startDate, job.endDate);
              return (
                <div key={job.company} className="relative space-y-3">
                  <span
                    className={`absolute -left-7.25 top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-zinc-50 dark:ring-zinc-950 ${
                      job.current
                        ? "bg-emerald-500"
                        : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                  />

                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                    <div>
                      <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                        {job.role}
                      </h3>
                      <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
                        {job.company} · {job.location}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                      {job.periodLabel} ·{" "}
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {duration}
                      </span>
                    </span>
                  </div>

                  <ul className="space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {job.highlights.map((item) => (
                      <li
                        key={item}
                        className="relative pl-4 before:absolute before:left-0 before:text-zinc-400 before:content-['›']"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="space-y-8">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl italic text-zinc-900 dark:text-zinc-100">
              Selected Work
            </h2>
            <div className="h-px flex-1 bg-zinc-200/80 dark:bg-zinc-800/80" />
          </div>

          <div className="grid gap-5">
            {PROJECTS.map((project) => (
              <article
                key={project.title}
                className="group relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white/75 p-6 shadow-xs backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-emerald-500/0 via-emerald-500/70 to-emerald-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                      {project.index}
                    </span>
                    <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                      {project.title}
                    </h3>
                    <span className="hidden rounded-full border border-zinc-200 px-2 py-0.5 font-mono text-[10px] text-zinc-500 sm:inline-block dark:border-zinc-800 dark:text-zinc-400">
                      {project.tag}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 font-mono text-xs">
                    {project.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-600 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-emerald-600 hover:decoration-emerald-500 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-emerald-400"
                      >
                        {link.label} ↗
                      </Link>
                    ))}
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-zinc-200/70 bg-zinc-100/80 px-2 py-0.5 font-mono text-[11px] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Stack */}
        <section id="stack" className="space-y-8">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl italic text-zinc-900 dark:text-zinc-100">
              Technical Stack
            </h2>
            <div className="h-px flex-1 bg-zinc-200/80 dark:bg-zinc-800/80" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {STACK.map((group) => (
              <div
                key={group.category}
                className="rounded-xl border border-zinc-200/80 bg-white/60 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/40"
              >
                <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {group.category}
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded bg-zinc-100 px-2 py-1 font-mono text-xs text-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section id="education" className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl italic text-zinc-900 dark:text-zinc-100">
              Education
            </h2>
            <div className="h-px flex-1 bg-zinc-200/80 dark:bg-zinc-800/80" />
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-white/60 p-5 dark:border-zinc-800/80 dark:bg-zinc-900/40">
            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
              <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                B.Sc. in Computer Science — University of Benin (UNIBEN)
              </h3>
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                2023 — 2026
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              Graduated with a 3.87 / 5.0 CGPA. Undergraduate thesis:{" "}
              <span className="italic text-zinc-800 dark:text-zinc-200">
                Stateless-Verifier Authentication: Design and Analysis of a
                Mathematical Model for Offline One-Time Password Generation and
                Verification
              </span>
              .
            </p>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="rounded-2xl border border-zinc-200/80 bg-white/80 p-6 sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/60"
        >
          <h2 className="font-serif text-2xl italic text-zinc-900 dark:text-zinc-100">
            Let&apos;s build something solid.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            Whether you&apos;re hiring for a frontend or full-stack role or want
            to discuss software architecture, send a note anytime.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 font-mono text-xs">
            <Link
              href="mailto:ighalogenesis2007@gmail.com"
              className="rounded-md bg-emerald-600 px-4 py-2.5 font-medium text-white shadow-xs transition-colors hover:bg-emerald-500"
            >
              ighalogenesis2007@gmail.com ↗
            </Link>
            <Link
              href="https://www.linkedin.com/in/genesis-ighalo"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-600 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-zinc-100"
            >
              Message on LinkedIn
            </Link>
          </div>
        </section>

        <footer className="flex flex-col justify-between gap-2 border-t border-zinc-200/80 pt-8 font-mono text-xs text-zinc-400 sm:flex-row dark:border-zinc-800/80 dark:text-zinc-500">
          <span>Genesis Osasenaga Ighalo</span>
          <span>Benin City, Nigeria · {new Date().getFullYear()}</span>
        </footer>
      </main>
    </div>
  );
}
