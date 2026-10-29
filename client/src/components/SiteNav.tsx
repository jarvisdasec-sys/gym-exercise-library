import { Link } from "wouter";
import {
  Apple,
  BookOpen,
  Calculator,
  ChevronDown,
  Dumbbell,
  HeartPulse,
  Accessibility,
  Bookmark,
  LayoutGrid,
  Menu,
  Smartphone,
  X,
} from "lucide-react";
import { useState } from "react";
import { BtbLogo } from "@/components/BtbLogo";
import { AuthControl } from "@/components/AuthControl";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/lib/routes";

export type NavKey =
  | "home"
  | "start"
  | "app"
  | "plus"
  | "plates"
  | "workouts"
  | "cardio"
  | "mobility"
  | "nutrition"
  | "calculators"
  | "education"
  | "saved"
  | "instagram";

type NavItem = {
  key: NavKey;
  label: string;
  href: string;
  icon: typeof LayoutGrid;
  hint: string;
  group?: string;
};

const PRIMARY: NavItem[] = [
  { key: "plates", label: "Exercises", href: ROUTES.exercises, icon: LayoutGrid, hint: "54 movement blueprints" },
  { key: "workouts", label: "Workouts", href: ROUTES.workouts, icon: Dumbbell, hint: "Training sessions and weekly plans" },
  { key: "nutrition", label: "Nutrition", href: ROUTES.nutrition, icon: Apple, hint: "Food, meals and tracking" },
  { key: "education", label: "Education", href: ROUTES.education, icon: BookOpen, hint: "Training and nutrition knowledge" },
  { key: "app", label: "App", href: `${ROUTES.start}#btb-app`, icon: Smartphone, hint: "BTB Fitness & Health app" },
];

const MORE: NavItem[] = [
  { key: "start", label: "Start Here", href: ROUTES.start, icon: LayoutGrid, hint: "Choose your next practical step", group: "Getting Started" },
  { key: "cardio", label: "Cardio", href: ROUTES.cardio, icon: HeartPulse, hint: "Conditioning and intervals", group: "Training" },
  { key: "mobility", label: "Mobility & Flow", href: ROUTES.mobility, icon: Accessibility, hint: "Yoga, Pilates and rhythm cardio", group: "Training" },
  { key: "calculators", label: "Calculators", href: ROUTES.calculators, icon: Calculator, hint: "BMI, 1RM, macros and more", group: "Tools" },
  { key: "plus", label: "BTB Plus", href: ROUTES.plus, icon: Bookmark, hint: "Proposed membership · no payment", group: "BTB" },
];

export function SiteNav({
  active,
  children,
}: {
  active: NavKey;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const saved: NavItem = { key: "saved", label: "Saved", href: ROUTES.saved, icon: Bookmark, hint: "Your exercises and routines", group: "BTB" };
  const primary = PRIMARY;
  const more = user ? [...MORE, saved] : MORE;
  const isCurrent = (key: NavKey) => key === active || (key === "workouts" && (active === "cardio" || active === "mobility")) || (key === "app" && active === "start");
  const isMoreCurrent = more.some((item) => item.key === active);

  return (
    <header className="no-print sticky z-40 border-b border-white/10 bg-background/94 backdrop-blur-xl" style={{ top: "var(--book-banner-height, 0px)" }}>
      <div className="container flex h-16 items-center gap-3 sm:h-[4.5rem]">
        <Link href="/" className="shrink-0" aria-label="BTB home"><BtbLogo compact /></Link>
        <nav className="ml-1 hidden items-stretch self-stretch xl:flex" aria-label="Primary navigation">
          {primary.map((item) => {
            const Icon = item.icon;
            const current = isCurrent(item.key);
            const className = `relative flex items-center gap-2 px-3 transition-colors ${current ? "text-lime" : "text-white/55 hover:text-white"}`;
            const content = (
              <>
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="meta text-[0.52rem] font-bold">{item.label}</span>
                <span className={`absolute bottom-0 left-2 right-2 h-[2px] ${current ? "bg-lime" : "bg-transparent"}`} />
              </>
            );
            return item.key === "app" ? (
              <a key={item.key} href={item.href} aria-current={current ? "page" : undefined} className={className}>{content}</a>
            ) : (
              <Link key={item.key} href={item.href} aria-current={current ? "page" : undefined} className={className}>{content}</Link>
            );
          })}
          <details className="group relative flex items-stretch">
            <summary aria-label="More site sections" className={`flex cursor-pointer list-none items-center gap-1.5 px-3 transition-colors [&::-webkit-details-marker]:hidden ${isMoreCurrent ? "text-lime" : "text-white/55 hover:text-white"}`}>
              <span className="meta text-[0.52rem] font-bold">More</span>
              <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="absolute right-0 top-full z-50 mt-px min-w-64 border border-white/12 bg-[#0b0b0b] p-2 shadow-xl">
              <p className="meta px-3 py-2 text-[0.4rem] tracking-[0.15em] text-lime">MORE BTB SECTIONS</p>
              {more.map((item, index) => {
                const Icon = item.icon;
                const current = isCurrent(item.key);
                return (
                  <div key={item.key}>
                    {index === 0 || more[index - 1]?.group !== item.group ? <p className="meta px-3 pb-1 pt-2 text-[0.38rem] tracking-[0.15em] text-white/35">{item.group}</p> : null}
                    <Link href={item.href} aria-current={current ? "page" : undefined} className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${current ? "bg-lime/[0.07] text-lime" : "text-white/75 hover:bg-white/[0.04] hover:text-lime"}`}>
                      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="min-w-0"><span className="block text-sm font-semibold">{item.label}</span><span className="block text-[0.65rem] text-white/40">{item.hint}</span></span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </details>
        </nav>
        <div className="ml-auto flex min-w-0 items-center gap-2.5">
          {children}
          <AuthControl />
          <button onClick={() => setOpen((value) => !value)} aria-label={open ? "Close sections" : "Open sections"} aria-expanded={open} className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 transition-colors hover:border-lime hover:text-lime xl:hidden">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="max-h-[75vh] overflow-y-auto border-t border-white/10 xl:hidden" aria-label="Site sections">
          {[...primary, ...more.filter((item) => !primary.some((primaryItem) => primaryItem.key === item.key))].map((item) => {
            const Icon = item.icon;
            const current = isCurrent(item.key);
            const className = `flex items-center gap-3 border-b border-white/[0.07] px-5 py-3.5 last:border-b-0 ${current ? "bg-lime/[0.07]" : ""}`;
            const content = (
              <>
                <span className={`h-8 w-[3px] shrink-0 ${current ? "bg-lime" : "bg-white/12"}`} />
                <Icon className={`h-4 w-4 shrink-0 ${current ? "text-lime" : "text-white/45"}`} aria-hidden="true" />
                <span className="min-w-0 flex-1"><span className={`display block text-[0.95rem] font-semibold ${current ? "text-lime" : "text-white"}`}>{item.label}</span><span className="meta text-[0.4rem] text-white/40">{item.hint}</span></span>
              </>
            );
            return item.key === "app" ? (
              <a key={item.key} href={item.href} onClick={() => setOpen(false)} aria-current={current ? "page" : undefined} className={className}>{content}</a>
            ) : (
              <Link key={item.key} href={item.href} onClick={() => setOpen(false)} aria-current={current ? "page" : undefined} className={className}>{content}</Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
