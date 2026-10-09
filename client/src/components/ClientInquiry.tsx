import { useState, type FormEvent } from "react";
import { BTB_CONTACT, inquiryDraft } from "../lib/growth";

export function ClientInquiry({
  initialTopic = "Help with the BTB tools",
}: {
  initialTopic?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(initialTopic);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<ReturnType<typeof inquiryDraft> | null>(
    null
  );
  const [status, setStatus] = useState("");
  const topics = [
    "Help with the BTB tools",
    "Future BTB Plus membership",
    "Gym or trainer partnership",
    "Book and education question",
  ];
  function prepare(event: FormEvent) {
    event.preventDefault();
    setError("");
    setStatus("");
    try {
      setDraft(inquiryDraft({ name, email, topic, message }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please check your message.");
      setDraft(null);
    }
  }
  const changed = () => {
    setDraft(null);
    setStatus("");
  };
  async function copy() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.text);
      setStatus(
        "Draft copied. Paste it into your email app and send it to BTB."
      );
    } catch {
      setStatus(
        "Clipboard access is unavailable. Select the draft text below, or download it."
      );
    }
  }
  function download() {
    if (!draft) return;
    const href = URL.createObjectURL(
      new Blob([draft.text], { type: "text/plain" })
    );
    const a = document.createElement("a");
    a.href = href;
    a.download = "BTB-inquiry-draft.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
    setStatus(
      "Draft downloaded. It has not been sent; use your email app to send it to BTB."
    );
  }
  return (
    <section
      className="growth-inquiry"
      id="btb-inquiry"
      aria-labelledby="inquiry-title"
    >
      <div className="growth-wrap growth-split">
        <div>
          <p className="growth-kicker">LET'S FIND YOUR NEXT STEP</p>
          <h2 id="inquiry-title">
            A real question.
            <br />A clear conversation.
          </h2>
          <p>
            Tell BTB what you need help with. This prepares an email draft—it
            does not automatically submit or send your information.
          </p>
          <p className="mt-4">
            You decide what to share and send. Please don't include medical
            records or sensitive health information.
          </p>
          <a className="growth-text-link" href={`mailto:${BTB_CONTACT}`}>
            {BTB_CONTACT}
          </a>
          <p>
            Name and email are used only in your draft. This page does not
            subscribe you to marketing.
          </p>
        </div>
        <div>
          <form onSubmit={prepare} noValidate>
            <div className="growth-form-row">
              <div>
                <label htmlFor="inquiry-name">Your name</label>
                <input
                  id="inquiry-name"
                  value={name}
                  maxLength={100}
                  autoComplete="name"
                  required
                  onChange={e => {
                    setName(e.target.value);
                    changed();
                  }}
                />
              </div>
              <div>
                <label htmlFor="inquiry-email">Reply email</label>
                <input
                  id="inquiry-email"
                  value={email}
                  type="email"
                  maxLength={254}
                  autoComplete="email"
                  required
                  onChange={e => {
                    setEmail(e.target.value);
                    changed();
                  }}
                />
              </div>
            </div>
            <div>
              <label htmlFor="inquiry-topic">I'm interested in</label>
              <select
                id="inquiry-topic"
                value={topic}
                onChange={e => {
                  setTopic(e.target.value);
                  changed();
                }}
              >
                {topics.map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="inquiry-message">
                What would be useful to you?
              </label>
              <textarea
                id="inquiry-message"
                value={message}
                maxLength={2000}
                required
                onChange={e => {
                  setMessage(e.target.value);
                  changed();
                }}
              />
            </div>
            {error && (
              <p className="growth-error" role="alert">
                {error}
              </p>
            )}
            <button className="growth-action" type="submit">
              Prepare my email draft →
            </button>
          </form>
          {draft && (
            <div className="growth-draft">
              <strong>Draft ready—not yet sent.</strong>
              <pre tabIndex={0}>{draft.text}</pre>
              <div className="growth-actions">
                <a className="growth-action" href={draft.href}>
                  Open email app ↗
                </a>
                <button
                  className="growth-secondary"
                  type="button"
                  onClick={() => void copy()}
                >
                  Copy draft
                </button>
                <button
                  className="growth-secondary"
                  type="button"
                  onClick={download}
                >
                  Download draft
                </button>
              </div>
              <p>
                Send from your email app to complete the inquiry. If it doesn't
                open, copy or download the draft.
              </p>
            </div>
          )}
          {status && (
            <p role="status" className="mt-4">
              {status}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
