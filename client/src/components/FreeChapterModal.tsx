import { useState } from "react";
import { CheckCircle2, Download, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function FreeChapterModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lead, setLead] = useState({ name: "", email: "" });
  const [submittedLead, setSubmittedLead] = useState({ name: "", email: "" });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmittedLead(lead);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setIsSubmitting(false);
      setIsSubmitted(false);
      setLead({ name: "", email: "" });
      setSubmittedLead({ name: "", email: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-[#8CFF00]/40 bg-[#0b0b0b] p-0 text-white sm:max-w-md" showCloseButton={!isSubmitting}>
        <div className="border-b border-[#8CFF00]/25 bg-gradient-to-r from-[#8CFF00]/15 to-transparent px-6 py-5">
          <span className="meta text-[0.52rem] font-bold tracking-[0.16em] text-[#8CFF00]">
            FREE FIELD MANUAL
          </span>
          <DialogHeader className="mt-2 text-left">
            <DialogTitle className="display text-2xl font-bold text-white">
              Get Chapter 1.
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-white/65">
              Start with the foundational system behind sustainable fitness and
              health.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6">
          {isSubmitted ? (
            <div className="py-5 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-[#8CFF00]" />
              <p className="display mt-4 text-xl font-bold text-white">
                Your Free Preview Is Ready!
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                Thank you for subscribing. Click the button below to download
                Chapter 1 immediately.
              </p>
              <a
                href="/BTB_Chapter_1.pdf"
                download
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 bg-[#8CFF00] px-5 text-sm font-bold text-black transition-colors hover:bg-white"
              >
                <Download className="h-4 w-4" />
                Download Chapter 1 (PDF)
              </a>
            </div>
          ) : (
            <form className="space-y-4 pt-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="meta mb-1.5 block text-[0.52rem] font-bold tracking-[0.12em] text-white/60">
                  NAME
                </span>
                <input
                  name="name"
                  required
                  autoComplete="name"
                  value={lead.name}
                  onChange={(event) =>
                    setLead((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="h-11 w-full border border-white/20 bg-black px-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#8CFF00]"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="meta mb-1.5 block text-[0.52rem] font-bold tracking-[0.12em] text-white/60">
                  EMAIL ADDRESS
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={lead.email}
                  onChange={(event) =>
                    setLead((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="h-11 w-full border border-white/20 bg-black px-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#8CFF00]"
                  placeholder="you@example.com"
                />
              </label>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-11 w-full items-center justify-center gap-2 bg-[#8CFF00] text-sm font-bold text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "Get Free Chapter"
                )}
              </button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
