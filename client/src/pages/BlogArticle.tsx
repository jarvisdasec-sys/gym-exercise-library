import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Link, useRoute } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog";
import {
  getCommunityBlogPost,
  type CommunityBlogPost as CommunityPost,
} from "@/lib/blogSubmissions";
import NotFound from "@/pages/NotFound";

function CommunityArticle({ post }: { post: CommunityPost }) {
  const readingMinutes = Math.max(1, Math.ceil(post.body.trim().split(/\s+/).filter(Boolean).length / 200));
  const date = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(post.createdAt));
  return (
    <main className="blog-page min-h-screen">
      <SiteNav active="blog" />
      <header className="blog-article-header border-b border-white/10">
        <div className="container blog-article-heading">
          <Link href="/blog" className="blog-back-link"><ArrowLeft aria-hidden="true" /> All stories</Link>
          <p className="meta blog-category">COMMUNITY POST <span>/</span> {post.category} <span>/</span> {date}</p>
          <h1 className="display">{post.title}</h1>
          <div className="blog-card-byline"><span>By {post.authorName}</span><span><Clock aria-hidden="true" /> {readingMinutes} min read</span></div>
          <p className="blog-immediate-label">Published immediately by a community contributor.</p>
        </div>
      </header>
      <article className="container blog-article-body">
        {post.imageUrl && <figure className="blog-article-figure"><img src={post.imageUrl} alt={post.title} /><figcaption className="meta">PUBLIC COMMUNITY IMAGE / {post.category.toUpperCase()}</figcaption></figure>}
        <div className="blog-prose">
          {post.body && <p className="blog-community-body">{post.body}</p>}
          <aside className="blog-scope-note">Community submissions are published as provided and are not reviewed by BTB. Do not rely on community posts as medical or personalized training advice.</aside>
          <div className="blog-article-cta"><div><p className="meta text-lime">HAVE SOMETHING TO ADD?</p><p>Share an article, a quick post, an image, or another idea.</p></div><Link href="/blog/contribute" className="blog-text-link">Post to the blog <ArrowRight aria-hidden="true" /></Link></div>
        </div>
      </article>
    </main>
  );
}

export default function BlogArticle() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";
  const post = getBlogPost(slug);
  const [communityPost, setCommunityPost] = useState<CommunityPost | null>(null);
  const [loadingCommunityPost, setLoadingCommunityPost] = useState(false);
  const [communityLoadError, setCommunityLoadError] = useState(false);

  useEffect(() => {
    if (!slug || post) {
      setCommunityPost(null);
      setLoadingCommunityPost(false);
      setCommunityLoadError(false);
      return;
    }
    let active = true;
    setLoadingCommunityPost(true);
    setCommunityLoadError(false);
    getCommunityBlogPost(slug)
      .then(result => {
        if (active) setCommunityPost(result);
      })
      .catch(() => {
        if (active) setCommunityLoadError(true);
      })
      .finally(() => {
        if (active) setLoadingCommunityPost(false);
      });
    return () => {
      active = false;
    };
  }, [slug, post]);

  if (!post && communityPost) return <CommunityArticle post={communityPost} />;
  if (!post && loadingCommunityPost) return <main className="blog-page min-h-screen"><SiteNav active="blog" /><div className="container blog-feed-status" role="status" aria-live="polite">Loading community story…</div></main>;
  if (!post && communityLoadError) return <main className="blog-page min-h-screen"><SiteNav active="blog" /><div className="container blog-feed-status" role="alert">This community story could not be loaded. <Link href="/blog" className="blog-text-link">Back to the blog <ArrowRight aria-hidden="true" /></Link></div></main>;
  if (!post) return <NotFound />;

  const nextPost = BLOG_POSTS[(BLOG_POSTS.findIndex(item => item.slug === post.slug) + 1) % BLOG_POSTS.length];
  return (
    <main className="blog-page min-h-screen">
      <SiteNav active="blog" />
      <header className="blog-article-header border-b border-white/10">
        <div className="container blog-article-heading">
          <Link href="/blog" className="blog-back-link"><ArrowLeft aria-hidden="true" /> All stories</Link>
          <p className="meta blog-category">{post.category} <span>/</span> {post.readTime} MIN READ</p>
          <h1 className="display">{post.title}</h1>
          <p className="blog-intro">{post.summary}</p>
          <div className="blog-card-byline"><span>By {post.author}</span><span><Clock aria-hidden="true" /> {post.readTime} min read</span></div>
        </div>
      </header>
      <article className="container blog-article-body">
        <figure className="blog-article-figure"><img src={post.image} alt={post.imageAlt} /><figcaption className="meta">BTB FITNESS & HEALTH / {post.category.toUpperCase()}</figcaption></figure>
        <div className="blog-prose">
          {post.sections.map(section => <section key={section.heading}>
            <h2 className="display">{section.heading}</h2>
            {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            {section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
          </section>)}
          <aside className="blog-scope-note">General education only—not medical advice or a personalized training or nutrition prescription. Adapt activities to your circumstances and consult a qualified professional for individual health or injury concerns.</aside>
          <div className="blog-article-cta"><div><p className="meta text-lime">HAVE A STORY TO SHARE?</p><p>Help make the BTB reading room useful for the next person.</p></div><Link href="/blog/contribute" className="blog-text-link">Post a contribution <ArrowRight aria-hidden="true" /></Link></div>
          <Link href={`/blog/${nextPost.slug}`} className="blog-next-story"><span className="meta">NEXT STORY / {nextPost.category.toUpperCase()}</span><strong className="display">{nextPost.title}</strong><ArrowRight aria-hidden="true" /></Link>
        </div>
      </article>
    </main>
  );
}
