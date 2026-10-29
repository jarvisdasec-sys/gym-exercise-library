import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Link, useRoute } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog";
import NotFound from "@/pages/NotFound";

export default function BlogArticle() {
  const [, params] = useRoute("/blog/:slug");
  const post = getBlogPost(params?.slug ?? "");
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
          <div className="blog-article-cta"><div><p className="meta text-lime">HAVE A STORY TO SHARE?</p><p>Help make the BTB reading room useful for the next person.</p></div><Link href="/blog/contribute" className="blog-text-link">Send a contribution <ArrowRight aria-hidden="true" /></Link></div>
          <Link href={`/blog/${nextPost.slug}`} className="blog-next-story"><span className="meta">NEXT STORY / {nextPost.category.toUpperCase()}</span><strong className="display">{nextPost.title}</strong><ArrowRight aria-hidden="true" /></Link>
        </div>
      </article>
    </main>
  );
}
