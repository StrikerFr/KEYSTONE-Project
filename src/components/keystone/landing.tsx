import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  ClipboardList,
  Clock3,
  FileCheck2,
  History,
  KeyRound,
  Menu,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme";
import { KeystoneMark, Wordmark } from "./brand";
import { useCountUp, useInView, useMounted } from "@/hooks/use-reveal";

/* ------------------------------------------------------------------ */
/* primitives                                                          */
/* ------------------------------------------------------------------ */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal-tr ${inView ? "reveal-in" : "reveal-init"} ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHead({
  index,
  eyebrow,
  title,
  text,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  text: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <div className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
        <span className="font-mono text-[10px] tracking-[0.2em] text-primary">{index}</span>
        <span className="h-px w-8 bg-border" />
        <span className="text-[10px] tracking-[0.2em] text-muted-foreground">{eyebrow}</span>
      </div>
      <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.06] tracking-[-0.02em] sm:text-[2.75rem]">
        {title}
      </h2>
      <p className="mt-5 text-[15px] leading-7 text-muted-foreground">{text}</p>
    </Reveal>
  );
}

function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative border-t border-border/70 px-5 py-24 sm:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function LiveDot({ tone = "success" }: { tone?: "success" | "warning" | "primary" | "critical" }) {
  const map = {
    success: "bg-success",
    warning: "bg-warning",
    primary: "bg-primary",
    critical: "bg-critical",
  } as const;
  return (
    <span className="relative inline-flex h-1.5 w-1.5">
      <span className={`absolute inline-flex h-full w-full rounded-full live-dot ${map[tone]}`} />
      <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${map[tone]}`} />
    </span>
  );
}

function Meta({ children }: { children: ReactNode }) {
  return <p className="text-[10px] tracking-[0.14em] text-muted-foreground">{children}</p>;
}

function Chip({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "warning" | "primary" | "success" }) {
  const map = {
    muted: "border-border text-muted-foreground",
    warning: "border-warning/30 bg-warning/10 text-warning",
    primary: "border-primary/30 bg-primary/10 text-primary",
    success: "border-success/30 bg-success/10 text-success",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-[3px] text-[10px] tracking-[0.08em] ${map[tone]}`}>
      {children}
    </span>
  );
}

function PrimaryCta({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Button asChild size="lg" className="group h-11 btn-glow">
      <Link to={to}>
        {children}
        <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/* header                                                              */
/* ------------------------------------------------------------------ */

const LANDING_NAV = [
  { label: "Workflow", id: "workflow" },
  { label: "SLA Engine", id: "sla" },
  { label: "Dispatch", id: "dispatch" },
  { label: "Operations", id: "operations" },
  { label: "Portals", id: "portals" },
  { label: "Security", id: "security" },
] as const;

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 15);

      const sectionIds = ["workflow", "sla", "dispatch", "operations", "portals", "security"];
      const scrollPosition = window.scrollY + 140;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          return;
        }
      }
      if (window.scrollY < 250) {
        setActiveSection("");
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -72;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/40 bg-background/75 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.06)] backdrop-blur-2xl dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.5)]"
          : "border-b border-border/20 bg-background/40 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-85"
        >
          <KeystoneMark className="h-6 w-6 transition-transform duration-300 group-hover:scale-105" />
          <Wordmark className="text-xs tracking-wider" />
        </a>

        {/* Center Pill Nav (Apple style) */}
        <nav className="hidden items-center gap-0.5 rounded-full border border-border/50 bg-surface-1/60 p-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-xl md:flex">
          {LANDING_NAV.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => scrollToSection(item.id, e)}
                className={`relative rounded-full px-3.5 py-1.5 text-xs tracking-tight transition-all duration-200 ${
                  isActive
                    ? "bg-foreground/10 font-medium text-foreground shadow-2xs dark:bg-foreground/15"
                    : "text-muted-foreground hover:bg-surface-2/70 hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA cluster */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 rounded-full px-3.5 text-xs font-normal text-muted-foreground transition-colors hover:bg-surface-2/70 hover:text-foreground"
          >
            <Link to="/login">Sign in</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="group h-8 rounded-full bg-primary px-3.5 text-xs font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            <Link to="/dashboard">
              View operations
              <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-1.5 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`overflow-hidden border-b border-border/40 bg-background/95 backdrop-blur-2xl transition-[max-height,opacity] duration-300 md:hidden ${
          open ? "max-h-96 opacity-100 shadow-xl" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-1 px-5 py-4">
          {LANDING_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={(e) => scrollToSection(item.id, e)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <span>{item.label}</span>
              <ArrowRight className="h-3 w-3 opacity-50" />
            </button>
          ))}
          <div className="grid grid-cols-2 gap-2 border-t border-border/40 pt-3">
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/login" onClick={() => setOpen(false)}>Sign in</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full">
              <Link to="/dashboard" onClick={() => setOpen(false)}>View operations</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* hero                                                                */
/* ------------------------------------------------------------------ */

const HERO_ROWS = [
  { id: "WO-1042", issue: "HVAC cooling failure", site: "XYZ Mall · Building A", tech: "Rahul Sharma", state: "In Progress", tone: "primary" as const },
  { id: "WO-1043", issue: "Generator inspection", site: "Orion Business Park", tech: "Amit Verma", state: "Scheduled", tone: "muted" as const },
  { id: "WO-1044", issue: "Electrical fault, Tower 2", site: "Metro Plaza", tech: "Neha Singh", state: "At Risk", tone: "warning" as const },
];

function Hero() {
  const mounted = useMounted();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [activeRow, setActiveRow] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveRow((r) => (r + 1) % HERO_ROWS.length), 3200);
    return () => clearInterval(id);
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPointer({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  const step = (i: number) => ({
    transitionDelay: `${120 + i * 110}ms`,
  });

  return (
    <div id="overview" ref={wrapRef} onMouseMove={onMove} className="relative overflow-hidden px-5 pb-24 pt-28 sm:pt-36">
      <div
        className="pointer-events-none absolute inset-0 grid-atmos opacity-[.55] transition-transform duration-[1200ms] ease-out"
        style={{ transform: `translate3d(${pointer.x * -14}px, ${pointer.y * -10}px, 0)` }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-[-12%] h-[70vh] ambient-glow transition-transform duration-[1400ms] ease-out"
        style={{ transform: `translate3d(${pointer.x * 22}px, ${pointer.y * 14}px, 0)` }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div
          className={`reveal-tr flex items-center gap-2.5 ${mounted ? "reveal-in" : "reveal-init"}`}
          style={step(0)}
        >
          <LiveDot tone="primary" />
          <Meta>FIELD SERVICE MANAGEMENT PLATFORM</Meta>
        </div>

        <h1 className="mt-8 max-w-4xl text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-7xl lg:text-[5.25rem]">
          <span
            className={`block reveal-tr ${mounted ? "reveal-in" : "reveal-init"}`}
            style={step(1)}
          >
            Field operations,
          </span>
          <span
            className={`block text-muted-foreground reveal-tr ${mounted ? "reveal-in" : "reveal-init"}`}
            style={step(2)}
          >
            engineered for clarity.
          </span>
        </h1>

        <p
          className={`mt-8 max-w-xl text-[15px] leading-7 text-muted-foreground reveal-tr ${mounted ? "reveal-in" : "reveal-init"} sm:text-base`}
          style={step(3)}
        >
          Coordinate service requests, dispatch technicians, monitor SLAs, and manage every field
          operation from one intelligent command center.
        </p>

        <div
          className={`mt-10 flex flex-wrap items-center gap-3 reveal-tr ${mounted ? "reveal-in" : "reveal-init"}`}
          style={step(4)}
        >
          <PrimaryCta to="/dashboard">Explore KEYSTONE</PrimaryCta>
          <Button asChild size="lg" variant="quiet" className="h-11">
            <Link to="/technician/dashboard">See how it works</Link>
          </Button>
        </div>

        {/* layered product visual */}
        <div
          className={`relative mt-20 reveal-tr ${mounted ? "reveal-in" : "reveal-init"}`}
          style={{ transitionDelay: "620ms", perspective: "1800px" }}
        >
          <div
            className="relative transition-transform duration-[1200ms] ease-out"
            style={{
              transform: `rotateX(${2 - pointer.y * 1.2}deg) rotateY(${pointer.x * 1.2}deg) translateY(-4px)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* background operational layer */}
            <div className="absolute -inset-x-6 -top-8 hidden h-24 rounded-t-xl border border-border/50 bg-surface-1/50 sm:block" />
            <div className="absolute -inset-x-3 -top-4 hidden h-24 rounded-t-xl border border-border/70 bg-surface-1/80 sm:block" />

            <div className="relative overflow-hidden rounded-xl depth-panel">
              <div className="flex h-11 items-center gap-3 border-b border-border/70 px-4">
                <KeystoneMark className="h-5 w-5" />
                <span className="text-[11px] tracking-[0.16em] text-muted-foreground">
                  NORTHSTAR OPERATIONS
                </span>
                <span className="ml-auto flex items-center gap-2">
                  <LiveDot />
                  <span className="text-[10px] tracking-[0.18em] text-success">LIVE</span>
                </span>
              </div>

              <div className="grid lg:grid-cols-[186px_1fr]">
                <div className="hidden border-r border-border/70 p-4 lg:block">
                  <Meta>COMMAND CENTER</Meta>
                  <div className="mt-4 space-y-1">
                    {["Overview", "Work Orders", "Schedule", "Technicians", "SLA & Alerts", "Inventory"].map((x, i) => (
                      <div
                        key={x}
                        className={`rounded px-2.5 py-2 text-[11px] transition-colors ${
                          i === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {x}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 rounded border border-border/70 bg-surface-2/60 p-3">
                    <Meta>TECHNICIANS ACTIVE</Meta>
                    <p className="mt-1.5 font-mono text-lg tabular-nums">12</p>
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="grid grid-cols-2 gap-5 border-b border-border/70 pb-6 sm:grid-cols-4">
                    <HeroMetric value="42" label="Open work orders" />
                    <HeroMetric value="17" label="In progress" />
                    <HeroMetric value="6" label="SLA at risk" tone="warning" />
                    <HeroMetric value="94.8%" label="SLA compliance" tone="success" />
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <Meta>ACTIVE WORK ORDERS</Meta>
                    <Meta>UPDATED 12s AGO</Meta>
                  </div>

                  <div className="mt-2 divide-y divide-border/70">
                    {HERO_ROWS.map((row, i) => (
                      <div
                        key={row.id}
                        className={`grid grid-cols-[76px_1fr] items-center gap-3 rounded px-2 py-3.5 transition-colors duration-500 sm:grid-cols-[76px_1fr_120px_auto] ${
                          activeRow === i ? "bg-surface-3/50" : ""
                        }`}
                      >
                        <span className="font-mono text-[10px] text-primary">{row.id}</span>
                        <div className="min-w-0">
                          <p className="truncate text-xs">{row.issue}</p>
                          <p className="mt-1 truncate text-[10px] text-muted-foreground">{row.site}</p>
                        </div>
                        <span className="hidden truncate text-[11px] text-muted-foreground sm:block">
                          {row.tech}
                        </span>
                        <span className="justify-self-start sm:justify-self-end">
                          <Chip tone={row.tone}>
                            {row.tone === "primary" && <LiveDot tone="primary" />}
                            {row.state}
                          </Chip>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* floating SLA indicator */}
            <div className="absolute -right-2 top-24 hidden w-52 rounded-lg depth-panel p-4 lg:block" style={{ transform: "translateZ(50px)" }}>
              <div className="flex items-center justify-between">
                <Meta>SLA DEADLINE</Meta>
                <LiveDot tone="warning" />
              </div>
              <p className="mt-2 font-mono text-xl tabular-nums text-warning">42:18</p>
              <p className="mt-1 text-[10px] text-muted-foreground">WO-1042 · remaining</p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[68%] bg-warning/80" />
              </div>
            </div>

            {/* floating technician status */}
            <div className="absolute -left-4 bottom-10 hidden w-56 rounded-lg depth-panel p-4 xl:block" style={{ transform: "translateZ(70px)" }}>
              <Meta>TECHNICIAN ON SITE</Meta>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface-3 text-[10px]">RS</span>
                <div>
                  <p className="text-xs">Rahul Sharma</p>
                  <p className="text-[10px] text-muted-foreground">HVAC Specialist</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-border/70 pt-3">
                <LiveDot />
                <span className="text-[10px] text-success">Working · 3 active jobs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroMetric({ value, label, tone }: { value: string; label: string; tone?: "warning" | "success" }) {
  const color = tone === "warning" ? "text-warning" : tone === "success" ? "text-success" : "";
  return (
    <div>
      <p className={`font-mono text-2xl tabular-nums tracking-tight ${color}`}>{value}</p>
      <p className="mt-1.5 text-[10px] tracking-[0.1em] text-muted-foreground">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* problem                                                             */
/* ------------------------------------------------------------------ */

function ProblemSection() {
  const fragments = [
    { label: "Requests", note: "email & phone" },
    { label: "Dispatch", note: "spreadsheets" },
    { label: "Field work", note: "chat threads" },
    { label: "Parts", note: "paper logs" },
    { label: "SLAs", note: "manual audit" },
  ];
  return (
    <Section id="problem">
      <div className="grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
        <SectionHead
          index="01"
          eyebrow="THE PROBLEM"
          title={<>Field operations are fragmented by default.</>}
          text="Every hand-off, from request to dispatch, site arrival, and final invoice, lives in a different tool. Context is lost exactly where accountability matters most."
        />
        <Reveal delay={120}>
          <div className="relative rounded-xl depth-panel p-6 sm:p-8">
            <div className="pointer-events-none absolute inset-0 grid-atmos-dense opacity-40" />
            <div className="relative space-y-3">
              {fragments.map((f, i) => (
                <div
                  key={f.label}
                  className="flex items-center justify-between rounded border border-dashed border-border/80 bg-surface-1/60 px-4 py-3.5 transition-colors duration-300 hover:border-border"
                  style={{ marginLeft: `${i % 2 === 0 ? 0 : 28}px`, marginRight: `${i % 2 === 0 ? 28 : 0}px` }}
                >
                  <span className="text-[13px]">{f.label}</span>
                  <span className="text-[10px] tracking-[0.1em] text-muted-foreground">{f.note}</span>
                </div>
              ))}
            </div>
            <p className="relative mt-6 text-[11px] text-muted-foreground">
              Five systems. No single source of operational truth.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* system journey                                                      */
/* ------------------------------------------------------------------ */

const STAGES = [
  {
    key: "REQUEST",
    title: "A request enters the system",
    text: "Customers report issues with location, asset and priority attached from the first keystroke.",
    visual: <RequestVisual />,
  },
  {
    key: "DISPATCH",
    title: "The right technician is matched",
    text: "Skills, workload, proximity and SLA urgency resolve into a single scheduled assignment.",
    visual: <DispatchVisual />,
  },
  {
    key: "EXECUTION",
    title: "Work is executed in the field",
    text: "Technicians run the job with time, parts, notes and photos captured as the work happens.",
    visual: <ExecutionVisual />,
  },
  {
    key: "RESOLUTION",
    title: "Resolution closes the loop",
    text: "Completion, cost, SLA outcome and customer visibility land in the same record.",
    visual: <ResolutionVisual />,
  },
];

function JourneySection() {
  const [active, setActive] = useState(0);
  const current = STAGES[active] ?? STAGES[0]!;

  return (
    <Section id="workflow">
      <SectionHead
        index="02"
        eyebrow="THE SYSTEM"
        align="center"
        title={
          <>
            One system.
            <br />
            Every field operation.
          </>
        }
        text="From the first service request to final resolution, KEYSTONE connects every moving part of field service."
      />

      <Reveal delay={100} className="mt-14">
        <div className="relative overflow-x-auto">
          <div className="flex min-w-[560px] items-center">
            {STAGES.map((stage, i) => (
              <div key={stage.key} className="flex flex-1 items-center">
                <button
                  onClick={() => setActive(i)}
                  className={`group relative flex-1 rounded-lg border px-4 py-4 text-left transition-all duration-300 ${
                    active === i
                      ? "border-primary/40 bg-primary/[0.07]"
                      : "border-border/70 bg-surface-1/50 hover:border-border hover:bg-surface-2/60"
                  }`}
                >
                  <span className={`font-mono text-[10px] tracking-[0.18em] ${active === i ? "text-primary" : "text-muted-foreground"}`}>
                    0{i + 1}
                  </span>
                  <p className={`mt-1.5 text-[12px] tracking-[0.14em] ${active === i ? "text-foreground" : "text-muted-foreground"}`}>
                    {stage.key}
                  </p>
                  <span
                    className={`absolute inset-x-4 bottom-0 h-px origin-left bg-primary transition-transform duration-500 ${
                      active === i ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
                {i < STAGES.length - 1 && (
                  <div className="relative mx-2 h-px w-6 overflow-hidden bg-border sm:w-10">
                    <span className="absolute inset-y-0 w-3 bg-primary/70 sweep" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={160} className="mt-10">
        <div className="grid gap-8 rounded-xl depth-panel p-6 sm:p-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.01em] sm:text-2xl">{current.title}</h3>
            <p className="mt-4 max-w-sm text-[13px] leading-6 text-muted-foreground">{current.text}</p>
            <div className="mt-6 flex gap-1.5">
              {STAGES.map((s, i) => (
                <span
                  key={s.key}
                  className={`h-0.5 w-8 rounded-full transition-colors duration-300 ${i === active ? "bg-primary" : "bg-border"}`}
                />
              ))}
            </div>
          </div>
          <div key={current.key} className="reveal-tr reveal-in">
            {current.visual}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function MiniPanel({ children, title, meta }: { children: ReactNode; title: string; meta?: string }) {
  return (
    <div className="rounded-lg border border-border/80 bg-surface-1/80 shadow-[0_24px_60px_-40px_oklch(0_0_0/90%)]">
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5">
        <span className="text-[10px] tracking-[0.16em] text-muted-foreground">{title}</span>
        {meta && <span className="font-mono text-[10px] text-primary">{meta}</span>}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function Field({ label, value, tone }: { label: string; value: string; tone?: "warning" | "primary" }) {
  const color = tone === "warning" ? "text-warning" : tone === "primary" ? "text-primary" : "";
  return (
    <div>
      <p className="text-[10px] tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className={`mt-1.5 text-[13px] ${color}`}>{value}</p>
    </div>
  );
}

function RequestVisual() {
  return (
    <MiniPanel title="SERVICE REQUEST" meta="#1042">
      <p className="text-base font-medium">HVAC cooling failure</p>
      <p className="mt-1 text-[11px] text-muted-foreground">XYZ Mall · Building A · Floor 3</p>
      <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border/70 pt-4">
        <Field label="PRIORITY" value="High" tone="warning" />
        <Field label="SUBMITTED" value="10:14 AM" />
        <Field label="ASSET" value="AHU-04" />
      </div>
      <div className="mt-5 flex items-center gap-2 rounded border border-primary/25 bg-primary/[0.07] px-3 py-2.5">
        <ArrowRight className="h-3.5 w-3.5 text-primary" />
        <span className="text-[11px] text-primary">Converted to Work Order WO-1042</span>
      </div>
    </MiniPanel>
  );
}

function DispatchVisual() {
  return (
    <MiniPanel title="DISPATCH" meta="WO-1042">
      <p className="text-base font-medium">HVAC Cooling Failure</p>
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-3 rounded border border-border/70 bg-surface-2/60 px-3 py-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-full border border-border bg-surface-3 text-[10px]">RS</span>
          <div className="min-w-0">
            <p className="text-[12px]">Rahul Sharma</p>
            <p className="text-[10px] text-muted-foreground">HVAC Specialist · 96% SLA</p>
          </div>
          <Chip tone="success">Matched</Chip>
        </div>
        <div className="grid grid-cols-[64px_1fr] items-center gap-3 text-[10px] text-muted-foreground">
          <span>09:00</span>
          <div className="relative h-7 rounded bg-surface-2/70">
            <div className="absolute left-[18%] top-0 h-7 w-[46%] rounded border border-primary/35 bg-primary/15 px-2 py-1.5 text-[10px] text-primary">
              10:30 · XYZ Mall
            </div>
          </div>
        </div>
      </div>
    </MiniPanel>
  );
}

function ExecutionVisual() {
  const actions = ["Add Note", "Add Part", "Log Time", "Upload Photo"];
  return (
    <MiniPanel title="TECHNICIAN · CURRENT JOB" meta="WO-1042">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-medium">HVAC Cooling Failure</p>
          <p className="mt-1 text-[11px] text-muted-foreground">XYZ Mall · Building A · 10:30 AM</p>
        </div>
        <Chip tone="primary">
          <LiveDot tone="primary" />
          In progress
        </Chip>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {actions.map((a) => (
          <div
            key={a}
            className="rounded border border-border/70 bg-surface-2/60 px-3 py-2.5 text-center text-[11px] text-muted-foreground transition-colors duration-200 hover:border-primary/30 hover:text-foreground"
          >
            {a}
          </div>
        ))}
      </div>
      <div className="mt-3 rounded border border-primary/30 bg-primary/10 px-3 py-2.5 text-center text-[11px] text-primary">
        Complete Work
      </div>
    </MiniPanel>
  );
}

function ResolutionVisual() {
  const timeline = [
    ["10:14", "Request received"],
    ["10:22", "Assigned to Rahul Sharma"],
    ["10:31", "Technician on site"],
    ["11:05", "Compressor relay replaced"],
    ["12:08", "Resolved · SLA met"],
  ];
  return (
    <MiniPanel title="RESOLUTION" meta="WO-1042">
      <div className="space-y-0">
        {timeline.map(([time, label], i) => (
          <div key={label} className="grid grid-cols-[52px_20px_1fr] items-start gap-2 pb-4 last:pb-0">
            <span className="font-mono text-[10px] text-muted-foreground">{time}</span>
            <div className="relative flex justify-center">
              <span className={`mt-1 h-1.5 w-1.5 rounded-full ${i === timeline.length - 1 ? "bg-success" : "bg-primary/60"}`} />
              {i < timeline.length - 1 && <span className="absolute top-3 h-full w-px bg-border" />}
            </div>
            <span className="text-[12px]">{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-4 border-t border-border/70 pt-4">
        <Field label="DURATION" value="1h 37m" />
        <Field label="PARTS COST" value="₹4,820" />
        <Field label="SLA" value="Met" />
      </div>
    </MiniPanel>
  );
}

/* ------------------------------------------------------------------ */
/* SLA                                                                 */
/* ------------------------------------------------------------------ */

function Countdown() {
  const [seconds, setSeconds] = useState(42 * 60 + 18);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <span className="font-mono text-4xl tabular-nums tracking-tight text-warning sm:text-5xl">
      {mm}:{ss}
    </span>
  );
}

function SlaSection() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const compliance = useCountUp(94.8, inView);
  const atRisk = useCountUp(6, inView);
  const breached = useCountUp(2, inView);

  return (
    <Section id="sla">
      <div ref={ref} className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
        <SectionHead
          index="03"
          eyebrow="SERVICE COMMITMENTS"
          title={<>Nothing important slips through.</>}
          text="KEYSTONE watches every clock in the portfolio and surfaces risk long before it becomes a breach, with the escalation path already attached."
        />
        <Reveal delay={120}>
          <div className="rounded-xl depth-panel p-6 sm:p-8">
            <div className="grid grid-cols-3 gap-6 border-b border-border/70 pb-6">
              <div>
                <p className="font-mono text-3xl tabular-nums tracking-tight text-success">
                  {compliance.toFixed(1)}%
                </p>
                <Meta>SLA COMPLIANCE</Meta>
              </div>
              <div>
                <p className="font-mono text-3xl tabular-nums tracking-tight text-warning">
                  {Math.round(atRisk)}
                </p>
                <Meta>AT RISK</Meta>
              </div>
              <div>
                <p className="font-mono text-3xl tabular-nums tracking-tight text-critical">
                  {Math.round(breached)}
                </p>
                <Meta>BREACHED</Meta>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-warning/25 bg-warning/[0.05] p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-3.5 w-3.5 text-warning" />
                  <span className="font-mono text-[11px] text-warning">WO-1042</span>
                </div>
                <Meta>SLA DEADLINE</Meta>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <Countdown />
                <span className="pb-1.5 text-[11px] text-muted-foreground">remaining</span>
              </div>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[68%] bg-gradient-to-r from-success/70 to-warning" />
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Technician on site · escalation to Operations Manager at 15:00
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* technicians                                                         */
/* ------------------------------------------------------------------ */

const TECHS = [
  { name: "Rahul Sharma", role: "HVAC Specialist", status: "On Job", tone: "primary" as const, load: 78, jobs: 3, sla: "96%" },
  { name: "Amit Verma", role: "Electrical", status: "Available", tone: "success" as const, load: 32, jobs: 1, sla: "93%" },
  { name: "Neha Singh", role: "Mechanical", status: "On Job", tone: "primary" as const, load: 64, jobs: 2, sla: "95%" },
  { name: "Arjun Mehta", role: "Elevator Systems", status: "On Leave", tone: "muted" as const, load: 0, jobs: 0, sla: "91%" },
];

function TechnicianSection() {
  return (
    <Section id="dispatch">
      <div className="grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
        <SectionHead
          index="04"
          eyebrow="THE FIELD TEAM"
          title={<>Know who is free, who is loaded, who is on site.</>}
          text="Every technician carries a live profile with skills, certifications, current workload and SLA performance, so dispatch decisions are made with evidence, not guesswork."
        />
        <Reveal delay={120}>
          <div className="overflow-hidden rounded-xl depth-panel">
            <div className="grid grid-cols-[1fr_88px_72px] gap-3 border-b border-border/70 px-5 py-3 sm:grid-cols-[1fr_120px_88px_72px]">
              <Meta>TECHNICIAN</Meta>
              <span className="hidden sm:block"><Meta>WORKLOAD</Meta></span>
              <Meta>STATUS</Meta>
              <Meta>SLA</Meta>
            </div>
            {TECHS.map((t) => (
              <div
                key={t.name}
                className="grid grid-cols-[1fr_88px_72px] items-center gap-3 border-b border-border/60 px-5 py-4 transition-colors duration-200 last:border-0 hover:bg-surface-2/60 sm:grid-cols-[1fr_120px_88px_72px]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-surface-3 text-[10px]">
                    {t.name.split(" ").map((p) => p[0]).join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px]">{t.name}</p>
                    <p className="flex items-center gap-1.5 truncate text-[10px] text-muted-foreground">
                      {t.role}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="h-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-[width] duration-700 ${t.load > 70 ? "bg-warning" : "bg-primary"}`}
                      style={{ width: `${t.load}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] text-muted-foreground">{t.jobs} active</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <LiveDot tone={t.tone === "muted" ? "warning" : t.tone} />
                  <span className="text-[10px] text-muted-foreground">{t.status}</span>
                </div>
                <span className="font-mono text-[12px] tabular-nums">{t.sla}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* command center                                                      */
/* ------------------------------------------------------------------ */

function Sparkline({ points, color, run }: { points: number[]; color: string; run: boolean }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 32 - ((p - min) / (max - min || 1)) * 28;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 34" preserveAspectRatio="none" className="h-10 w-full">
      <path d={d} fill="none" stroke={color} strokeWidth="1" vectorEffect="non-scaling-stroke" className={run ? "draw-line" : "opacity-0"} />
    </svg>
  );
}

function CommandCenterSection() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <Section id="operations">
      <div ref={ref}>
        <SectionHead
          index="05"
          eyebrow="COMMAND CENTER"
          align="center"
          title={<>See the operation, not just the ticket.</>}
          text="Work orders, technician availability, SLA health, schedule and live activity in one continuously updating operational picture."
        />

        <Reveal delay={120} className="relative mt-14">
          <div className="pointer-events-none absolute inset-x-10 -top-10 h-40 ambient-glow opacity-70" />
          <div className="relative overflow-hidden rounded-xl depth-panel">
            <div className="flex h-11 items-center gap-3 border-b border-border/70 px-4">
              <KeystoneMark className="h-5 w-5" />
              <span className="text-[11px] tracking-[0.16em] text-muted-foreground">OVERVIEW</span>
              <span className="ml-auto flex items-center gap-2">
                <LiveDot />
                <span className="text-[10px] tracking-[0.18em] text-success">LIVE</span>
              </span>
            </div>

            <div className="grid gap-px bg-border/60 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["42", "Open work orders", ""],
                ["17", "In progress", ""],
                ["6", "SLA at risk", "text-warning"],
                ["23", "Completed today", "text-success"],
              ].map(([v, l, c]) => (
                <div key={l} className="bg-surface-1 px-5 py-5">
                  <p className={`font-mono text-2xl tabular-nums ${c}`}>{v}</p>
                  <Meta>{l}</Meta>
                </div>
              ))}
            </div>

            <div className="grid gap-px bg-border/60 lg:grid-cols-[1.4fr_1fr]">
              <div className="bg-surface-1 p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[12px]">Work order activity</span>
                  <div className="flex gap-1">
                    {["7D", "30D", "90D"].map((t, i) => (
                      <span
                        key={t}
                        className={`rounded px-2 py-1 text-[10px] ${i === 0 ? "bg-surface-3 text-foreground" : "text-muted-foreground"}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <Sparkline points={[18, 24, 21, 31, 27, 38, 42]} color="var(--primary)" run={inView} />
                  <Sparkline points={[12, 15, 14, 19, 17, 22, 23]} color="var(--success)" run={inView} />
                </div>
                <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </div>

              <div className="bg-surface-1 p-5 sm:p-6">
                <span className="text-[12px]">SLA health</span>
                <div className="mt-5 space-y-4">
                  {[
                    ["Healthy", 36, "bg-success"],
                    ["At risk", 6, "bg-warning"],
                    ["Breached", 2, "bg-critical"],
                  ].map(([label, value, bar]) => (
                    <div key={label as string}>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">{label as string}</span>
                        <span className="font-mono tabular-nums">{value as number}</span>
                      </div>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full transition-[width] duration-1000 ${bar as string}`}
                          style={{ width: inView ? `${((value as number) / 44) * 100}%` : "0%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-px border-t border-border/60 bg-border/60 lg:grid-cols-2">
              <div className="bg-surface-1 p-5 sm:p-6">
                <Meta>TODAY'S SCHEDULE</Meta>
                <div className="mt-4 space-y-2.5">
                  {[
                    ["Rahul Sharma", "10:00 to 12:00", "WO-1042 HVAC Repair", 10, 44],
                    ["Amit Verma", "11:30 to 13:00", "WO-1045 Generator Inspection", 34, 32],
                    ["Neha Singh", "14:00 to 15:30", "WO-1044 Electrical Fault", 58, 30],
                  ].map(([name, time, job, left, width]) => (
                    <div key={name as string} className="grid grid-cols-[92px_1fr] items-center gap-3">
                      <span className="truncate text-[11px] text-muted-foreground">{name as string}</span>
                      <div className="relative h-8 rounded bg-surface-2/70">
                        <div
                          className="absolute top-0 flex h-8 items-center overflow-hidden rounded border border-primary/30 bg-primary/10 px-2 text-[10px] text-primary transition-[width,left] duration-700"
                          style={{ left: `${left as number}%`, width: `${width as number}%` }}
                          title={`${job as string} · ${time as string}`}
                        >
                          <span className="truncate">{job as string}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-1 p-5 sm:p-6">
                <Meta>RECENT ACTIVITY</Meta>
                <div className="mt-4 space-y-3.5">
                  {[
                    ["8m", "SLA warning: WO-1042 approaching deadline", "warning"],
                    ["21m", "Neha Singh completed WO-1039 at Metro Plaza", "success"],
                    ["44m", "New service request from Apex Industrial Systems", "primary"],
                    ["1h", "Low stock alert: Compressor relay (4 left)", "warning"],
                  ].map(([time, text, tone]) => (
                    <div key={text as string} className="flex items-start gap-3">
                      <span className="mt-1.5">
                        <LiveDot tone={tone as "warning" | "success" | "primary"} />
                      </span>
                      <p className="flex-1 text-[11.5px] leading-5 text-muted-foreground">{text as string}</p>
                      <span className="font-mono text-[10px] text-muted-foreground">{time as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* analytics                                                           */
/* ------------------------------------------------------------------ */

function AnalyticsSection() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const cards = [
    { label: "Work orders", value: "1,284", delta: "+8.2%", points: [12, 18, 15, 22, 19, 28, 31] },
    { label: "Avg resolution time", value: "3h 12m", delta: "−14m", points: [30, 28, 29, 25, 24, 22, 21] },
    { label: "SLA compliance", value: "94.8%", delta: "+2.4%", points: [88, 90, 89, 92, 93, 94, 95] },
    { label: "Technician utilization", value: "81%", delta: "+3.1%", points: [66, 70, 69, 74, 77, 79, 81] },
  ];
  return (
    <Section>
      <div ref={ref} className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <SectionHead
          index="06"
          eyebrow="INTELLIGENCE"
          title={<>Performance you can defend in a board review.</>}
          text="Resolution time, technician utilization, parts consumption and SLA outcomes reported at the same fidelity your operation runs at."
        />
        <Reveal delay={120}>
          <div className="grid gap-px overflow-hidden rounded-xl bg-border/60 sm:grid-cols-2">
            {cards.map((c) => (
              <div key={c.label} className="bg-surface-1 p-5 transition-colors duration-300 hover:bg-surface-2/70">
                <div className="flex items-baseline justify-between">
                  <Meta>{c.label.toUpperCase()}</Meta>
                  <span className="text-[10px] text-success">{c.delta}</span>
                </div>
                <p className="mt-2 font-mono text-2xl tabular-nums tracking-tight">{c.value}</p>
                <div className="mt-3">
                  <Sparkline points={c.points} color="var(--primary)" run={inView} />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* customer portal                                                     */
/* ------------------------------------------------------------------ */

function CustomerSection() {
  const steps = [
    ["Request received", "10:14 AM", true],
    ["Technician assigned", "10:22 AM", true],
    ["Technician on site", "10:31 AM", true],
    ["Work in progress", "Now", false],
    ["Resolution", "Est. 12:15 PM", false],
  ] as const;

  return (
    <Section id="portals">
      <div className="grid gap-14 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
        <Reveal className="order-2 lg:order-1">
          <div className="rounded-xl depth-panel p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-border/70 pb-5">
              <div>
                <Meta>CUSTOMER PORTAL</Meta>
                <p className="mt-1.5 text-base font-medium">XYZ Mall</p>
              </div>
              <Chip tone="primary">
                <LiveDot tone="primary" />
                Active service
              </Chip>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_180px]">
              <div>
                <p className="text-[15px] font-medium">HVAC Cooling Failure</p>
                <p className="mt-1 text-[11px] text-muted-foreground">WO-1042 · Building A · Floor 3</p>
                <div className="mt-5 space-y-0">
                  {steps.map(([label, time, done], i) => (
                    <div key={label} className="grid grid-cols-[18px_1fr_auto] items-start gap-3 pb-4 last:pb-0">
                      <div className="relative flex justify-center">
                        <span className={`mt-1 h-1.5 w-1.5 rounded-full ${done ? "bg-primary" : "bg-border"}`} />
                        {i < steps.length - 1 && <span className="absolute top-3 h-full w-px bg-border" />}
                      </div>
                      <span className={`text-[12px] ${done ? "" : "text-muted-foreground"}`}>{label}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 rounded-lg border border-border/70 bg-surface-2/50 p-4">
                <div>
                  <Meta>TECHNICIAN</Meta>
                  <div className="mt-2 flex items-center gap-2.5">
                    <span className="grid h-7 w-7 place-items-center rounded-full border border-border bg-surface-3 text-[10px]">RS</span>
                    <div>
                      <p className="text-[12px]">Rahul Sharma</p>
                      <p className="text-[10px] text-muted-foreground">HVAC Specialist</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-border/70 pt-3">
                  <Meta>STATUS</Meta>
                  <p className="mt-1.5 text-[12px] text-primary">Technician on site</p>
                </div>
                <div className="border-t border-border/70 pt-3">
                  <Meta>EST. COMPLETION</Meta>
                  <p className="mt-1.5 font-mono text-[12px] tabular-nums">12:15 PM</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHead
            index="07"
            eyebrow="THE OTHER SIDE"
            title={<>Customers always know what's happening.</>}
            text="A calm, read-only view of their own operation: open requests, assigned technicians, live status and full service history, without a single status call."
          />
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* security                                                            */
/* ------------------------------------------------------------------ */

const TRUST = [
  { icon: Users, label: "Role-based access", note: "Admin · Dispatcher · Technician · Customer" },
  { icon: KeyRound, label: "Secure authentication", note: "Session control and enforced sign-out" },
  { icon: History, label: "Audit history", note: "Every status change attributed and timestamped" },
  { icon: ClipboardList, label: "Organization controls", note: "Workspace, site and asset scoping" },
  { icon: Activity, label: "Operational visibility", note: "Live view across every active work order" },
  { icon: FileCheck2, label: "Service records", note: "Exportable performance and compliance reporting" },
];

function SecuritySection() {
  return (
    <Section id="security">
      <SectionHead
        index="08"
        eyebrow="TRUST"
        align="center"
        title={<>Enterprise control, by construction.</>}
        text="Access, accountability and history are built into the data model, never bolted on afterwards."
      />
      <div className="mt-12 grid gap-px overflow-hidden rounded-xl bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
        {TRUST.map((item, i) => (
          <Reveal key={item.label} delay={i * 60}>
            <div className="h-full bg-surface-1 p-6 transition-colors duration-300 hover:bg-surface-2/70">
              <item.icon className="h-4 w-4 text-primary" />
              <p className="mt-4 text-[13px]">{item.label}</p>
              <p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">{item.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA + footer                                                        */
/* ------------------------------------------------------------------ */

function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-border/70 px-5 py-32">
      <div className="pointer-events-none absolute inset-0 grid-atmos opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 bottom-[-30%] h-[70vh] ambient-glow" />
      <Reveal className="relative mx-auto max-w-2xl text-center">
        <ShieldCheck className="mx-auto h-6 w-6 text-primary" />
        <h2 className="mt-7 text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-6xl">
          Bring every field operation into focus.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-[15px] leading-7 text-muted-foreground">
          One command center for requests, technicians, work orders, assets and service performance.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <PrimaryCta to="/dashboard">Explore KEYSTONE</PrimaryCta>
          <Button asChild size="lg" variant="quiet" className="h-11">
            <Link to="/login">View operations</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 px-5 py-10 backdrop-blur-xl sm:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Brand + smooth scroll to top */}
        <div className="flex flex-col gap-1.5">
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-85"
          >
            <KeystoneMark className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" />
            <Wordmark className="text-xs tracking-wider" />
          </a>
          <p className="text-[11px] text-muted-foreground">
            Enterprise field service command and operations platform.
          </p>
        </div>

        {/* Center: Clean role portal links */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <Link to="/dashboard" className="transition-colors hover:text-foreground">
            Operations
          </Link>
          <Link to="/schedule" className="transition-colors hover:text-foreground">
            Dispatch
          </Link>
          <Link to="/technician/dashboard" className="transition-colors hover:text-foreground">
            Technician
          </Link>
          <Link to="/customer/dashboard" className="transition-colors hover:text-foreground">
            Customer Portal
          </Link>
          <Link to="/reports" className="transition-colors hover:text-foreground">
            Reports
          </Link>
          <Link to="/login" className="transition-colors hover:text-foreground">
            Sign in
          </Link>
        </div>

        {/* Right: Copyright & Live Pulse */}
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <LiveDot tone="success" />
            <span>Systems Online</span>
          </div>
          <span className="text-[10px] tracking-wider text-muted-foreground/80">
            © 2026 KEYSTONE. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Header />
      <main>
        <Hero />
        <ProblemSection />
        <JourneySection />
        <SlaSection />
        <TechnicianSection />
        <CommandCenterSection />
        <AnalyticsSection />
        <CustomerSection />
        <SecuritySection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
