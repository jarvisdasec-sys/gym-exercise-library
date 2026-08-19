import { Facebook, Instagram } from "lucide-react";

export function SocialFooter() {
  return (
    <footer className="no-print border-t border-neutral-800 bg-[#0b0b0b]">
      <div className="container flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="display text-base font-semibold text-white">Build The Body</p>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/55">Follow @btbfitnessandhealth for daily execution tips, routine drops, and book updates.</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://www.instagram.com/btbfitnessandhealth" target="_blank" rel="noopener noreferrer" aria-label="Follow BTB on Instagram" className="flex h-10 w-10 items-center justify-center border border-neutral-800 text-white/65 transition-colors hover:border-lime hover:text-lime"><Instagram className="h-4 w-4" /></a>
          <a href="https://www.facebook.com/btbfitnessandhealth" target="_blank" rel="noopener noreferrer" aria-label="Follow BTB on Facebook" className="flex h-10 w-10 items-center justify-center border border-neutral-800 text-white/65 transition-colors hover:border-lime hover:text-lime"><Facebook className="h-4 w-4" /></a>
        </div>
      </div>
    </footer>
  );
}
