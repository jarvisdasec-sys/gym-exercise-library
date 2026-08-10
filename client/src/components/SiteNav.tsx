/**
 * SiteNav — the one labelled top navigation used on every page.
 *
 * WHY IT EXISTS: each section had grown its own ad-hoc header with different
 * buttons, so a member could not tell what the site contained or where they
 * were. This gives every page the same four labelled tabs with the active one
 * marked, which is what the user asked for.
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall"):
 *  - Industrial wayfinding: labels are mono uppercase, never sentence case.
 *  - The active tab is marked with a lime underscore rule + lime text; inactive
 *    tabs stay white/60 so the wall stays quiet. No pill shapes, no rounding.
 *  - Lime is reserved for state and one primary action — it is not decoration.
 */
import { Link } from "wouter";
import {
  Apple,
  BookOpen,
  Calculator,
  Dumbbell,
  HeartPulse,
  LayoutGrid,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { BtbLogo } from "@/components/BtbLogo";

export type NavKey =
  | "plates"
  | "workouts"
  | "cardio"
  | "nutrition"
  | "calculators"
  | "education";

const TABS: {
  key: NavKey;
  label: string;
  href: string;
  icon: typeof LayoutGrid;
  /** shown under the label in the mobile sheet */
  hint: string;
}[] = [
  {
    key: "plates",
    label: "Exercises",
    href: "/",
    icon: LayoutGrid,
    hint: "54 movement blueprints",
  },
  {
    key: "workouts",
    label: "Workouts",
    href: "/workouts",
    icon: Dumbbell,
    hint: "12 training sessions",
  },
  {
    key: "cardio",
    label: "Cardio",
    href: "/cardio",
    icon: HeartPulse,
    hint: "Conditioning & intervals",
  },
  {
    key: "nutrition",
    label: "Nutrition",
    href: "/nutrition",
    icon: Apple,
    hint: "Food, meals & tracking",
  },
  {
    key: "calculators",
    label: "Calculators",
    href: "/calculators",
    icon: Calculator,
    hint: "BMI, 1RM, macros & more",
  },
  {
    key: "education",
    label: "Education",
    href: "/learn",
    icon: BookOpen,
    hint: "Training & nutrition knowledge",
  },
];

export function SiteNav({
  active,
  children,
}: {
  /** which tab to mark as current */
  active: NavKey;
  /** optional page-specific controls (search, filters) rendered to the right */
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/10 bg-background/94 backdrop-blur-xl">
      <div className="container flex h-16 items-center gap-4 sm:h-[4.5rem]">
        <Link href="/" className="shrink-0">
          <BtbLogo compact />
        </Link>

        {/* ── labelled tabs (desktop) ─────────────────────────────── */}
        <nav className="ml-2 hidden items-stretch self-stretch lg:flex">
          {TABS.map((t) => {
            const isActive = t.key === active;
            const Icon = t.icon;
            return (
              <Link
                key={t.key}
                href={t.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex items-center gap-2 px-4 transition-colors duration-200 ${
                  isActive
                    ? "text-lime"
                    : "text-white/55 hover:text-white"
                }`}
                style={{ transitionTimingFunction: "var(--ease-out-snap)" }}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="meta text-[0.52rem] font-bold">{t.label}</span>
                {/* active marker: a bolted-down lime rule, not a pill */}
                <span
                  className={`absolute bottom-0 left-2 right-2 h-[2px] transition-opacity duration-200 ${
                    isActive ? "bg-lime opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex min-w-0 items-center gap-2.5">
          {children}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Open sections"
            aria-expanded={open}
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 transition-colors duration-200 hover:border-lime hover:text-lime lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ── labelled tabs (mobile sheet) ──────────────────────────── */}
      {open && (
        <nav className="border-t border-white/10 lg:hidden">
          {TABS.map((t) => {
            const isActive = t.key === active;
            const Icon = t.icon;
            return (
              <Link
                key={t.key}
                href={t.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 border-b border-white/[0.07] px-5 py-3.5 last:border-b-0 ${
                  isActive ? "bg-lime/[0.07]" : ""
                }`}
              >
                {/* lime spine marks the current section */}
                <span
                  className={`h-8 w-[3px] shrink-0 ${
                    isActive ? "bg-lime" : "bg-white/12"
                  }`}
                />
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? "text-lime" : "text-white/45"
                  }`}
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={`display block text-[0.95rem] font-semibold ${
                      isActive ? "text-lime" : "text-white"
                    }`}
                  >
                    {t.label}
                  </span>
                  <span className="meta text-[0.4rem] text-white/40">
                    {t.hint}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
