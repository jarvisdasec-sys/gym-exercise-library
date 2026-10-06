type BtbHeroMediaProps = {
  src: string;
  alt: string;
  position?: "left" | "right";
};

export function BtbHeroMedia({ src, alt, position = "right" }: BtbHeroMediaProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 hidden w-1/2 overflow-hidden lg:block ${position === "right" ? "right-0" : "left-0"}`}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover opacity-40 mix-blend-screen"
      />
      <div
        className={`absolute inset-0 ${position === "right" ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-transparent via-black/45 to-black`}
      />
    </div>
  );
}
