import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Clock, PenLine } from "lucide-react";
import { Link } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import { BLOG_CATEGORIES, BLOG_POSTS } from "@/lib/blog";
import {
  listCommunityBlogPosts,
  type CommunityBlogPost,
} from "@/lib/blogSubmissions";

const FILTERS = ["All topics", ...BLOG_CATEGORIES, "Other"] as const;
type BlogFilter = (typeof FILTERS)[number];

function communitySummary(post: CommunityBlogPost) {
  const body = post.body.trim();
  if (!body) return "A community image shared with the BTB reading room.";
  return body.length > 180 ? `${body.slice(0, 177).trimEnd()}…` : body;
}

function CommunityStoryCard({ post }: { post: CommunityBlogPost }) {
  const published = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(post.createdAt));
  return (
    <article className="blog-community-card">
      <Link href={`/blog/${post.id}`} className="blog-community-image-link" aria-label={`Read ${post.title}`}>
        {post.imageUrl
          ? <img src={post.imageUrl} alt={post.title} loading="lazy" />
          : <span className="blog-community-placeholder meta">BTB COMMUNITY / {post.contributionType.replaceAll("_", " ")}</span>}
      </Link>
      <div className="blog-community-copy">
        <p className="meta blog-category">{post.category} <span>/</span> {published}</p>
        <h3 className="display"><Link href={`/blog/${post.id}`}>{post.title}</Link></h3>
        <p className="blog-card-summary">{communitySummary(post)}</p>
        <div className="blog-card-byline"><span>{post.authorName}</span></div>
        <Link href={`/blog/${post.id}`} className="blog-text-link">Read post <ArrowRight aria-hidden="true" /></Link>
      </div>
    </article>
  );
}

export default function Blog() {
  const requestedTopic = new URLSearchParams(window.location.search).get("topic");
  const initialTopic = FILTERS.find(category => category === requestedTopic);
  const [selected, setSelected] = useState<BlogFilter>(initialTopic ?? "All topics");
  const [communityPosts, setCommunityPosts] = useState<CommunityBlogPost[]>([]);
  const [loadingCommunityPosts, setLoadingCommunityPosts] = useState(true);
  const [communityError, setCommunityError] = useState(false);

  useEffect(() => {
    let active = true;
    listCommunityBlogPosts()
      .then(posts => {
        if (active) setCommunityPosts(posts);
      })
      .catch(() => {
        if (active) setCommunityError(true);
      })
      .finally(() => {
        if (active) setLoadingCommunityPosts(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const visiblePosts = selected === "All topics"
    ? BLOG_POSTS
    : BLOG_POSTS.filter(post => post.category === selected);
  const visibleCommunityPosts = selected === "All topics"
    ? communityPosts
    : communityPosts.filter(post => post.category === selected);
  const featured = visiblePosts[0];
  const remaining = visiblePosts.slice(1);
  const storyCount = visiblePosts.length + visibleCommunityPosts.length;

  return (
    <main className="blog-page min-h-screen">
      <SiteNav active="blog" />
      <header className="blog-masthead border-b border-white/10">
        <div className="container blog-masthead-inner">
          <div>
            <p className="meta blog-kicker"><span className="blog-kicker-mark" /> BTB READING ROOM / TRAINING, HEALTH & EVERYDAY GEAR</p>
            <h1 className="display blog-title">Real life.<br /><span>Stronger stories.</span></h1>
            <p className="blog-intro">Ideas you can use between workouts. Read a guide, find your next step, or publish your own voice to the BTB community.</p>
            <Link href="/blog/contribute" className="blog-button blog-button-lime"><PenLine aria-hidden="true" /> Post to the blog <ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="blog-masthead-stamp" aria-hidden="true"><span>BTB</span><i>FIELD<br />NOTES</i><b>01—04</b></div>
        </div>
      </header>

      <section className="container blog-content" aria-labelledby="blog-stories-heading">
        <div className="blog-section-heading">
          <div><p className="meta text-lime">THE LATEST FROM BTB</p><h2 id="blog-stories-heading" className="display">Stories to put to work.</h2></div>
          <p className="blog-count"><BookOpen aria-hidden="true" /> {storyCount} {storyCount === 1 ? "story" : "stories"}</p>
        </div>
        <div className="blog-filter-row" role="group" aria-label="Filter blog by topic">
          {FILTERS.map(filter => <button key={filter} type="button" aria-pressed={selected === filter} onClick={() => setSelected(filter)} className={`blog-filter ${selected === filter ? "is-active" : ""}`}>{filter}</button>)}
        </div>

        {loadingCommunityPosts && <p className="blog-feed-status" role="status" aria-live="polite">Loading community posts…</p>}
        {communityError && <p className="blog-feed-status" role="status">Community posts could not be loaded right now. The starter stories are still available.</p>}
        {visibleCommunityPosts.length > 0 && <section className="blog-community-section" aria-labelledby="community-stories-heading">
          <div className="blog-community-heading"><div><p className="meta text-lime">PUBLISHED BY THE COMMUNITY</p><h2 id="community-stories-heading" className="display">Just shared.</h2></div><span className="meta blog-live-label">LIVE / NO REVIEW QUEUE</span></div>
          <div className="blog-community-grid">{visibleCommunityPosts.map(post => <CommunityStoryCard key={post.id} post={post} />)}</div>
        </section>}

        {featured && <article className="blog-featured-card">
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
        </article>}

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

        {storyCount === 0 && !loadingCommunityPosts && <p className="blog-feed-status">No posts match this topic yet. Choose another topic or publish the first post.</p>}
      </section>

      <section className="blog-contribute-band" aria-labelledby="blog-contribute-heading">
        <div className="container blog-contribute-inner">
          <div><p className="meta text-lime">YOUR STORY BELONGS HERE</p><h2 id="blog-contribute-heading" className="display">Got a useful idea?<br />Bring it to the room.</h2><p>Post an article, a quick tip, an image, or another idea. No login, email, or approval—your contribution appears publicly as soon as you publish.</p></div>
          <Link href="/blog/contribute" className="blog-button blog-button-outline"><PenLine aria-hidden="true" /> Post to the blog <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
