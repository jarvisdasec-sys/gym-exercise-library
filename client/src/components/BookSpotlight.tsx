import { ArrowUpRight, BookOpen, Download } from "lucide-react";

const AMAZON_URL =
  "https://www.amazon.com/BTB-Foundations-Health-Nutrition-Blueprint-ebook/dp/B0HCMVK5ZN/ref=sr_1_2?crid=SVHQ55SOF96R&dib=eyJ2IjoiMSJ9.swLWrVydJ_CVFZEFuGBtVTWgmStNC-0DGNeigV5WymV4d-M1g6cxNFthZaz1mZ8GOqnFdSn3byRXny8X8HDibg.zCaLNQq809q1am1qQStb1NwALB448Bg_LfvGUmM6hrk&dib_tag=se&keywords=jarvis+dixon&qid=1786340487&sprefix=jarvis+dixon%2Caps%2C317&sr=8-2";
const BARNES_AND_NOBLE_URL =
  "https://www.barnesandnoble.com/w/btb-foundation-of-health-and-nutrition-jarvis-dixon/1150963840?ean=2940185322222";

export function BookSpotlight({
  onDownloadChapter,
}: {
  onDownloadChapter: () => void;
}) {
  return (
    <section className="border-b border-white/10 bg-[#0b0b0b] py-10 sm:py-14">
      <div className="container grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#8CFF00]" />
            <span className="meta text-[0.52rem] font-bold tracking-[0.16em] text-[#8CFF00]">
              THE BTB READING ROOM
            </span>
          </div>
          <p className="meta mb-3 inline-flex border border-[#8CFF00]/40 px-2 py-1 text-[0.48rem] font-bold tracking-[0.14em] text-[#8CFF00]">
            BOOK 2 COMING SOON: BTB STRENGTH, MUSCLE, AND RECOVERY
          </p>
          <h2 className="display max-w-3xl text-3xl font-bold leading-[0.95] text-white sm:text-5xl">
            BTB: The Foundation of
            <span className="text-[#8CFF00]"> Fitness and Health</span>
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
            A practical blueprint for training with purpose, eating with
            clarity, and building habits that hold up outside the gym.
          </p>

          <ul className="mt-6 grid gap-2 text-sm text-white/80 sm:grid-cols-3">
            {["Form Blueprints", "Nutrition Science", "Program Design"].map(
              (topic) => (
                <li key={topic} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#8CFF00]" />
                  {topic}
                </li>
              ),
            )}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onDownloadChapter}
              className="inline-flex h-11 items-center gap-2 bg-[#8CFF00] px-5 text-sm font-bold text-black transition-colors hover:bg-white"
            >
              <Download className="h-4 w-4" />
              Download Chapter 1 (Free PDF)
            </button>
            <a
              href={AMAZON_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 border border-white/20 px-4 text-sm font-semibold text-white transition-colors hover:border-[#8CFF00] hover:text-[#8CFF00]"
            >
              Buy on Amazon <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={BARNES_AND_NOBLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 border border-white/20 px-4 text-sm font-semibold text-white transition-colors hover:border-[#8CFF00] hover:text-[#8CFF00]"
            >
              Buy on Barnes &amp; Noble <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[250px] [perspective:1000px] lg:max-w-none">
          <div className="relative aspect-[3/4] -rotate-y-6 border border-[#8CFF00]/50 bg-gradient-to-br from-[#1c1c1c] via-[#0b0b0b] to-black p-5 shadow-[-16px_18px_0_#8CFF00] transition-transform duration-300 hover:-translate-y-1 hover:rotate-y-0">
            <div className="flex h-full flex-col border border-white/15 p-4">
              <BookOpen className="h-7 w-7 text-[#8CFF00]" />
              <span className="meta mt-8 text-[0.5rem] font-bold tracking-[0.18em] text-[#8CFF00]">
                BUILD THE BODY
              </span>
              <h3 className="display mt-3 text-3xl font-bold leading-[0.9] text-white">
                THE FOUNDATION
                <br />
                <span className="text-[#8CFF00]">OF FITNESS</span>
                <br />
                &amp; HEALTH
              </h3>
              <span className="meta mt-auto text-[0.5rem] tracking-[0.14em] text-white/50">
                BTB / VOL. 01
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
