import { useState } from "react";
import { ArrowRight, BookOpen, Clock, PenLine } from "lucide-react";
import { Link } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import { BLOG_CATEGORIES, BLOG_POSTS, type BlogFilter } from "@/lib/blog";

const FILTERS: BlogFilter[] = ["All topics", ...BLOG_CATEGORIES];

export default function Blog() {
  const requestedTopic = new URLSearchParams(window.location.search).get("topic");
  const initialTopic = BLOG_CATEGORIES.find(category => category === requestedTopic);
  const [selected, setSelected] = useState<BlogFilter>(initialTopic ?? "All topics");
  const visiblePosts = selected === "All topics"
    ? BLOG_POSTS
    : BLOG_POSTS.filter(post => post.category === selected);
  const featured = visiblePosts[0];
  const remaining = visiblePosts.slice(1);

  return (
    <main className="blog-page min-h-screen">
      <SiteNav active="blog" />
      <header className="blog-masthead border-b border-white/10">
        <div className="container blog-masthead-inner">
          <div>
            <p className="meta blog-kicker"><span className="blog-kicker-mark" /> BTB READING ROOM / TRAINING, HEALTH & EVERYDAY GEAR</p>
            <h1 className="display blog-title">Real life.<br /><span>Stronger stories.</span></h1>
            <p className="blog-intro">Ideas you can use between workouts. Read a guide, find your next step, or bring your own voice to the BTB community.</p>
            <Link href="/blog/contribute" className="blog-button blog-button-lime"><PenLine aria-hidden="true" /> Share a contribution <ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="blog-masthead-stamp" aria-hidden="true"><span>BTB</span><i>FIELD<br />NOTES</i><b>01—04</b></div>
        </div>
      </header>

      <section className="container blog-content" aria-labelledby="blog-stories-heading">
        <div className="blog-section-heading">
          <div><p className="meta text-lime">THE LATEST FROM BTB</p><h2 id="blog-stories-heading" className="display">Stories to put to work.</h2></div>
          <p className="blog-count"><BookOpen aria-hidden="true" /> {visiblePosts.length} {visiblePosts.length === 1 ? "story" : "stories"}</p>
        </div>
        <div className="blog-filter-row" role="group" aria-label="Filter blog by topic">
          {FILTERS.map(filter => <button key={filter} type="button" aria-pressed={selected === filter} onClick={() => setSelected(filter)} className={`blog-filter ${selected === filter ? "is-active" : ""}`}>{filter}</button>)}
        </div>

        {featured && (
          <article className="blog-featured-card">
            <Link href={`/blog/${featured.slug}`} className="blog-featured-image-link" aria-label={`Read ${featured.title}`}>
              <img className="blog-featured-image" src={featured.image} alt={featured.imageAlt} />
              <span className="blog-image-label meta">FEATURED / {featured.category.toUpperCase()}</span>
            </Link>
            <div className="blog-featured-copy">
              <p className="meta blog-category">{featured.category} <span>/</span> {featured.readTime} MIN READ</p>
              <h3 className="display"><Link href={`/blog/${featured.slug}`}>{featured.title}</Link></h3>
              <p className="blog-card-summary">{featured.summary}</p>
              <div className="blog-card-byline"><span>{featured.author}</span><span><Clock aria-hidden="true" /> {featured.readTime} min</span></div>
              <Link href={`/blog/${featured.slug}`} className="blog-text-link">Read the story <ArrowRight aria-hidden="true" /></Link>
            </div>
          </article>
        )}

        {remaining.length > 0 && <div className="blog-card-list">{remaining.map((post, index) => (
          <article key={post.slug} className="blog-story-card">
            <Link href={`/blog/${post.slug}`} className="blog-story-image-link" aria-label={`Read ${post.title}`}>
              <img src={post.image} alt={post.imageAlt} loading="lazy" />
              <span className="blog-story-number meta">0{index + 2}</span>
            </Link>
            <div className="blog-story-copy">
              <p className="meta blog-category">{post.category} <span>/</span> {post.readTime} MIN READ</p>
              <h3 className="display"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
              <p className="blog-card-summary">{post.summary}</p>
              <Link href={`/blog/${post.slug}`} className="blog-text-link">Read story <ArrowRight aria-hidden="true" /></Link>
            </div>
          </article>
        ))}</div>}
      </section>

      <section className="blog-contribute-band" aria-labelledby="blog-contribute-heading">
        <div className="container blog-contribute-inner">
          <div><p className="meta text-lime">YOUR STORY BELONGS HERE</p><h2 id="blog-contribute-heading" className="display">Got a useful idea?<br />Bring it to the room.</h2><p>Send an article, a quick post, an image, or another idea. BTB reviews every contribution before it appears here.</p></div>
          <Link href="/blog/contribute" className="blog-button blog-button-outline"><PenLine aria-hidden="true" /> Contribute to the blog <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
