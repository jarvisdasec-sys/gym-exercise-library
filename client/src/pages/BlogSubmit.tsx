import { useId, useState, type FormEvent } from "react";
import { ArrowLeft, Mail, Paperclip, Send } from "lucide-react";
import { Link } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import { BLOG_CATEGORIES, buildBlogSubmissionMailto } from "@/lib/blog";

const TYPES = ["Article", "Short post", "Image / photo", "Idea or other"] as const;

export default function BlogSubmit() {
  const [type, setType] = useState<string>(TYPES[0]);
  const [category, setCategory] = useState<string>(BLOG_CATEGORIES[0]);
  const nameId = useId();
  const emailId = useId();
  const titleId = useId();
  const messageId = useId();
  const consentId = useId();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const consent = form.get("rights") === "on";
    if (!consent) {
      document.getElementById(consentId)?.focus();
      return;
    }
    window.location.href = buildBlogSubmissionMailto({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      type,
      category,
      title: String(form.get("title") ?? ""),
      message: String(form.get("message") ?? ""),
    });
  };

  return (
    <main className="blog-page min-h-screen">
      <SiteNav active="blog" />
      <section className="container blog-submit-layout">
        <div className="blog-submit-aside">
          <Link href="/blog" className="blog-back-link"><ArrowLeft aria-hidden="true" /> Back to the reading room</Link>
          <p className="meta blog-category">BTB COMMUNITY / OPEN SUBMISSIONS</p>
          <h1 className="display">Make room<br /><span>for your voice.</span></h1>
          <p className="blog-intro">Have a training lesson, health habit, cardio idea, gear note, or image worth sharing? Send it to the BTB editorial team.</p>
          <div className="blog-submit-note"><Paperclip aria-hidden="true" /><div><strong>Sending an image?</strong><p>When your email draft opens, attach the image file in your email app before you send it. The site does not upload files.</p></div></div>
          <div className="blog-submit-note"><Mail aria-hidden="true" /><div><strong>Nothing posts automatically.</strong><p>Your email app will open with a draft. Review it and press Send yourself. BTB reviews submissions before deciding what to publish.</p></div></div>
        </div>
        <form className="blog-submit-form" onSubmit={submit}>
          <p className="meta text-lime">CONTRIBUTOR DETAILS</p>
          <div className="blog-form-grid">
            <div className="blog-form-field"><label htmlFor={nameId}>Your name</label><input id={nameId} name="name" autoComplete="name" required maxLength={100} /></div>
            <div className="blog-form-field"><label htmlFor={emailId}>Email for a reply</label><input id={emailId} name="email" type="email" autoComplete="email" required maxLength={254} /></div>
            <div className="blog-form-field"><label htmlFor="contribution-type">What are you sharing?</label><select id="contribution-type" value={type} onChange={event => setType(event.target.value)}>{TYPES.map(item => <option key={item}>{item}</option>)}</select></div>
            <div className="blog-form-field"><label htmlFor="contribution-category">Topic</label><select id="contribution-category" value={category} onChange={event => setCategory(event.target.value)}>{BLOG_CATEGORIES.map(item => <option key={item}>{item}</option>)}<option>Other</option></select></div>
            <div className="blog-form-field blog-form-wide"><label htmlFor={titleId}>Working title or short description</label><input id={titleId} name="title" required maxLength={120} /></div>
            <div className="blog-form-field blog-form-wide"><label htmlFor={messageId}>Your contribution or image details</label><textarea id={messageId} name="message" rows={9} maxLength={2500} placeholder="Paste your article or post, describe your image, or tell us about your idea." /><span className="blog-field-hint">Up to 2,500 characters. Longer pieces can be attached as a document to your email draft.</span></div>
          </div>
          <label className="blog-consent" htmlFor={consentId}><input id={consentId} name="rights" type="checkbox" required /><span>I created this material or have permission to share it, and I agree to send it to BTB for editorial review.</span></label>
          <p className="blog-privacy-note">Your details and contribution are placed in an email draft on your device; BTB does not receive anything until you send that email. Do not include sensitive health or personal information.</p>
          <button className="blog-button blog-button-lime blog-submit-button" type="submit"><Send aria-hidden="true" /> Prepare email draft</button>
          <a className="blog-direct-email" href="mailto:btbfitnessandhealth@yahoo.com">Email BTB directly instead</a>
        </form>
      </section>
    </main>
  );
}
