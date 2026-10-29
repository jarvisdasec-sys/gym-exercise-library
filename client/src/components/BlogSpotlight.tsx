import { ArrowLeft, ArrowRight, Newspaper } from "lucide-react";
import { BLOG_CATEGORIES, BLOG_POSTS } from "@/lib/blog";

export function BlogSpotlight() {
  const featured = BLOG_POSTS[0];
  return (
    <section className="blog-spotlight-section" aria-labelledby="blog-spotlight-heading">
      <div className="container blog-spotlight-layout">
        <div className="blog-spotlight-copy">
          <p className="meta blog-kicker"><span className="blog-kicker-mark" /> THE BTB BLOG / READ IT. SHARE IT.</p>
          <h2 id="blog-spotlight-heading" className="display">Read up.<br /><span>Pass it on.</span></h2>
          <p>Real training, health, cardio and gear stories for your week. Read what helps—or share your own without an account.</p>
          <div className="blog-spotlight-topics" aria-label="Blog topics">
            {BLOG_CATEGORIES.map(category => <a key={category} href={`/blog?topic=${encodeURIComponent(category)}`}>{category}</a>)}
          </div>
          <a href="/blog" className="blog-spotlight-link" aria-label="Read the blog"><span>READ THE</span><ArrowRight aria-hidden="true" /><strong>BLOG</strong><ArrowLeft aria-hidden="true" /></a>
        </div>
        <a href={`/blog/${featured.slug}`} className="blog-spotlight-story">
          <div className="blog-spotlight-image"><img src={featured.image} alt={featured.imageAlt} loading="lazy" /><span className="meta">START HERE / {featured.category.toUpperCase()}</span></div>
          <div className="blog-spotlight-story-copy"><Newspaper aria-hidden="true" /><div><p className="meta">BTB READING ROOM / 01</p><h3 className="display">{featured.title}</h3><span className="blog-spotlight-read">Read the story <ArrowRight aria-hidden="true" /></span></div></div>
        </a>
      </div>
    </section>
  );
}
