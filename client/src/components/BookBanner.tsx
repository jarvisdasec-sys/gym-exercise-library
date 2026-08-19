import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

// Replace with the canonical retailer or book landing-page URL when available.
const BOOK_PURCHASE_URL =
  "https://www.amazon.com/BTB-Foundations-Health-Nutrition-Blueprint-ebook/dp/B0HCMVK5ZN/ref=sr_1_2?crid=SVHQ55SOF96R&dib=eyJ2IjoiMSJ9.swLWrVydJ_CVFZEFuGBtVTWgmStNC-0DGNeigV5WymV4d-M1g6cxNFthZaz1mZ8GOqnFdSn3byRXny8X8HDibg.zCaLNQq809q1am1qQStb1NwALB448Bg_LfvGUmM6hrk&dib_tag=se&keywords=jarvis+dixon&qid=1786340487&sprefix=jarvis+dixon%2Caps%2C317&sr=8-2";

export function BookBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const bannerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = document.documentElement;

    if (!isVisible || !bannerRef.current) {
      root.style.setProperty("--book-banner-height", "0px");
      return;
    }

    const updateHeight = () => {
      root.style.setProperty(
        "--book-banner-height",
        `${bannerRef.current?.offsetHeight ?? 0}px`,
      );
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(bannerRef.current);

    return () => {
      observer.disconnect();
      root.style.setProperty("--book-banner-height", "0px");
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <section
      ref={bannerRef}
      aria-label="Book announcement"
      className="no-print sticky top-0 z-50 border-b border-[#8CFF00]/30 bg-[#0b0b0b] text-white"
    >
      <div className="container relative flex min-h-12 flex-wrap items-center justify-center gap-x-3 gap-y-1 px-12 py-2 text-center sm:min-h-14 sm:px-14">
        <span className="meta shrink-0 bg-[#8CFF00] px-2 py-1 text-[0.52rem] font-bold tracking-[0.14em] text-black">
          NEW RELEASE
        </span>
        <p className="text-xs leading-snug text-white/85 sm:text-sm">
          BTB: The Foundation of Fitness and Health is now available on Amazon
          &amp; Barnes &amp; Noble!
        </p>
        <a
          href={BOOK_PURCHASE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="meta shrink-0 text-[0.6rem] font-bold text-[#8CFF00] transition-colors hover:text-white"
        >
          Get Your Copy →
        </a>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss book announcement"
          className="absolute right-3 inline-flex h-8 w-8 items-center justify-center text-white/70 transition-colors hover:bg-white/10 hover:text-[#8CFF00] sm:right-4"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
