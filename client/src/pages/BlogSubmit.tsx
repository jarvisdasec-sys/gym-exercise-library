import { useId, useState, type FormEvent } from "react";
import { ArrowLeft, ImagePlus, Send } from "lucide-react";
import { Link, useLocation } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import { BLOG_CATEGORIES } from "@/lib/blog";
import {
  ALLOWED_BLOG_IMAGE_TYPES,
  MAX_BLOG_BODY_LENGTH,
  MAX_BLOG_IMAGE_BYTES,
  publishCommunityBlogPost,
  validateBlogContribution,
  type BlogContributionType,
  type BlogTopic,
} from "@/lib/blogSubmissions";

const TYPES: { value: BlogContributionType; label: string }[] = [
  { value: "article", label: "Article" },
  { value: "short_post", label: "Short post" },
  { value: "image", label: "Image / photo" },
  { value: "other", label: "Other contribution" },
];
const TOPICS: BlogTopic[] = [...BLOG_CATEGORIES, "Other"];

export default function BlogSubmit() {
  const [, navigate] = useLocation();
  const [type, setType] = useState<BlogContributionType>("article");
  const [category, setCategory] = useState<BlogTopic>(BLOG_CATEGORIES[0]);
  const [publishing, setPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const titleId = useId();
  const nameId = useId();
  const typeId = useId();
  const categoryId = useId();
  const bodyId = useId();
  const imageId = useId();
  const consentId = useId();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (publishing) return;
    const form = new FormData(event.currentTarget);
    if (String(form.get("website") ?? "").trim()) {
      setErrorMessage("We could not publish this contribution. Please try again.");
      return;
    }
    const selectedFile = form.get("image");
    const image = selectedFile instanceof File && selectedFile.size > 0
      ? selectedFile
      : null;
    const input = {
      title: String(form.get("title") ?? ""),
      body: String(form.get("body") ?? ""),
      authorName: String(form.get("authorName") ?? ""),
      category,
      contributionType: type,
      image,
    };
    const validationError = validateBlogContribution(input);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    if (form.get("rights") !== "on") {
      setErrorMessage("Confirm that your contribution may be published publicly.");
      return;
    }

    setPublishing(true);
    setErrorMessage("");
    try {
      const post = await publishCommunityBlogPost(input);
      navigate(`/blog/${post.id}`);
    } catch {
      setErrorMessage(
        "We could not publish your contribution. Check your connection and image format, then try again."
      );
      setPublishing(false);
    }
  };

  return (
    <main className="blog-page min-h-screen">
      <SiteNav active="blog" />
      <section className="container blog-submit-layout">
        <div className="blog-submit-aside">
          <Link href="/blog" className="blog-back-link"><ArrowLeft aria-hidden="true" /> Back to the reading room</Link>
          <p className="meta blog-category">BTB COMMUNITY / OPEN POSTING</p>
          <h1 className="display">Make room<br /><span>for your voice.</span></h1>
          <p className="blog-intro">Share a training lesson, health habit, cardio idea, gear note, image, or another useful contribution. No account or email is needed.</p>
          <div className="blog-submit-note"><ImagePlus aria-hidden="true" /><div><strong>Posting is immediate.</strong><p>When you publish, your text and any image appear on the public blog right away. BTB does not review posts first.</p></div></div>
          <div className="blog-submit-note"><ImagePlus aria-hidden="true" /><div><strong>Images are public.</strong><p>Upload one JPEG, PNG, or WebP image up to 5 MB. Only share a photo you are comfortable making public.</p></div></div>
        </div>

        <form className="blog-submit-form" onSubmit={submit}>
          <p className="meta text-lime">PUBLISH A COMMUNITY POST</p>
          <div className="blog-form-grid">
            <div className="blog-form-field blog-form-wide"><label htmlFor={titleId}>Title</label><input id={titleId} name="title" required maxLength={120} autoComplete="off" /></div>
            <div className="blog-form-field"><label htmlFor={nameId}>Display name (optional)</label><input id={nameId} name="authorName" maxLength={80} autoComplete="nickname" placeholder="BTB Community" /></div>
            <div className="blog-form-field"><label htmlFor={typeId}>Contribution type</label><select id={typeId} value={type} onChange={event => setType(event.target.value as BlogContributionType)}>{TYPES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
            <div className="blog-form-field"><label htmlFor={categoryId}>Topic</label><select id={categoryId} value={category} onChange={event => setCategory(event.target.value as BlogTopic)}>{TOPICS.map(item => <option key={item}>{item}</option>)}</select></div>
            <div className="blog-form-field blog-form-wide"><label htmlFor={bodyId}>Your post</label><textarea id={bodyId} name="body" rows={10} maxLength={MAX_BLOG_BODY_LENGTH} placeholder="Write your article, quick post, photo caption, or idea. Your words display as plain text." /><span className="blog-field-hint">Up to {MAX_BLOG_BODY_LENGTH.toLocaleString()} characters. Text is published as plain text.</span></div>
            <div className="blog-form-field blog-form-wide"><label htmlFor={imageId}>Image (optional; required for an image-only post)</label><input id={imageId} name="image" type="file" accept={ALLOWED_BLOG_IMAGE_TYPES.join(",")} /><span className="blog-field-hint">JPEG, PNG, or WebP · Maximum {MAX_BLOG_IMAGE_BYTES / (1024 * 1024)} MB.</span></div>
          </div>

          <div className="blog-honeypot" aria-hidden="true"><label htmlFor="blog-website">Leave this field blank</label><input id="blog-website" name="website" tabIndex={-1} autoComplete="off" /></div>
          <label className="blog-consent" htmlFor={consentId}><input id={consentId} name="rights" type="checkbox" required /><span>I understand this will publish publicly immediately, and I created or have permission to share the text and image.</span></label>
          <p className="blog-privacy-note">No login, email, or editorial approval is required. Do not include private or sensitive personal or health information. Community posts are not reviewed before publication.</p>
          {errorMessage && <p className="blog-submit-error" role="alert">{errorMessage}</p>}
          <button className="blog-button blog-button-lime blog-submit-button" type="submit" disabled={publishing}><Send aria-hidden="true" /> {publishing ? "Publishing…" : "Publish to the blog"}</button>
        </form>
      </section>
    </main>
  );
}
