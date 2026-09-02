import { useId, useState } from "react";
import { Mail } from "lucide-react";

const RECIPIENT = "btbfitnessandhealth@yahoo.com";
const MESSAGE_TYPES = ["Suggestion", "Question", "Idea", "Feedback"] as const;
type MessageType = (typeof MESSAGE_TYPES)[number];

export function SuggestionBox() {
  const [messageType, setMessageType] = useState<MessageType>("Suggestion");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) {
      setError("Please add a message before sending.");
      return;
    }
    setError(null);

    const subject = `BTB Suggestion Box - ${messageType}`;
    const body = [
      `Message Type: ${messageType}`,
      `Name: ${name.trim() || "(not provided)"}`,
      `User Email: ${email.trim() || "(not provided)"}`,
      "",
      "Message:",
      message.trim(),
    ].join("\n");

    const mailtoUrl = `mailto:${RECIPIENT}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
  };

  return (
    <section
      className="border-b border-white/10 bg-black py-10 sm:py-14"
      aria-labelledby="btb-suggestion-box-heading"
    >
      <div className="container">
        <div className="relative mx-auto w-full max-w-2xl border border-lime p-5 sm:p-8">
          <span className="tick-static absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-lime" />
          <span className="tick-static absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-lime" />

          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-lime" />
            <span className="meta text-[0.45rem] text-lime">Contact</span>
          </div>

          <h2
            id="btb-suggestion-box-heading"
            className="display text-2xl font-bold leading-none text-white sm:text-3xl"
          >
            BTB SUGGESTION BOX
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">
            Help us Build The Body better. Send us your suggestions,
            questions, feedback, or ideas.
          </p>

          <form onSubmit={handleSubmit} className="mt-6" noValidate>
            <fieldset className="mb-5">
              <legend className="meta mb-2.5 text-[0.45rem] text-muted-foreground">
                Message type
              </legend>
              <div className="flex flex-wrap gap-1.5">
                {MESSAGE_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMessageType(type)}
                    aria-pressed={messageType === type}
                    className={`min-h-11 border px-3.5 py-2 transition-colors duration-200 ${
                      messageType === type
                        ? "border-lime bg-lime/10 text-lime"
                        : "border-white/12 text-white/55 hover:border-white/40 hover:text-white"
                    }`}
                  >
                    <span className="meta text-[0.5rem]">{type}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={nameId}
                  className="meta mb-1.5 block text-[0.42rem] text-muted-foreground"
                >
                  Name (optional)
                </label>
                <input
                  id={nameId}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 w-full border border-white/12 bg-white/[0.03] px-3 text-sm text-white outline-none transition-colors focus:border-lime"
                />
              </div>
              <div>
                <label
                  htmlFor={emailId}
                  className="meta mb-1.5 block text-[0.42rem] text-muted-foreground"
                >
                  Email (optional)
                </label>
                <input
                  id={emailId}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full border border-white/12 bg-white/[0.03] px-3 text-sm text-white outline-none transition-colors focus:border-lime"
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor={messageId}
                className="meta mb-1.5 block text-[0.42rem] text-muted-foreground"
              >
                Message (required)
              </label>
              <textarea
                id={messageId}
                required
                rows={4}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError(null);
                }}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? `${messageId}-error` : undefined}
                className="w-full resize-y border border-white/12 bg-white/[0.03] p-3 text-sm text-white outline-none transition-colors focus:border-lime"
              />
              {error && (
                <p
                  id={`${messageId}-error`}
                  role="alert"
                  className="meta mt-2 text-[0.45rem] text-red-400"
                >
                  {error}
                </p>
              )}
            </div>

            <p className="meta mt-3 text-[0.4rem] leading-relaxed text-muted-foreground">
              Sending will open your default email app with this message
              pre-filled.
            </p>

            <button
              type="submit"
              className="mt-4 flex h-12 min-w-[10rem] items-center justify-center bg-lime px-6 transition-colors duration-200 hover:bg-lime/85"
            >
              <span className="meta text-[0.6rem] font-bold text-black">
                SEND TO BTB
              </span>
            </button>

            <a
              href={`mailto:${RECIPIENT}`}
              className="mt-4 flex items-center gap-2 text-white/55 transition-colors hover:text-lime"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="meta text-[0.42rem]">
                Prefer email? Contact BTB directly
              </span>
            </a>
          </form>
        </div>
      </div>
    </section>
  );
}
