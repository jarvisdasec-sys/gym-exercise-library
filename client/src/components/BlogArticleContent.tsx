import React from "react";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Link } from "wouter";
import { BLOG_POSTS, type BlogPost } from "../lib/blog";
import { STARTER_PLAN_URL } from "./StarterPlanPromo";

/** The same public article body is served initially and rendered in the browser. */
export function BlogArticleContent({ post }: { post: BlogPost }) {
  const nextPost = BLOG_POSTS[(BLOG_POSTS.findIndex(item => item.slug === post.slug) + 1) % BLOG_POSTS.length];
  return (
    <>
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
          {post.slug === "a-simple-first-strength-week" && (
            <div className="blog-article-cta">
              <div><p className="meta text-lime">PUT YOUR FIRST WEEK ON THE CALENDAR</p><p>Use the free 7-day starter plan for a daily checklist, gym or equipment-light home options, and space to plan your next week.</p></div>
              <a href={STARTER_PLAN_URL} className="blog-text-link">Open the free 7-day plan <ArrowRight aria-hidden="true" /></a>
            </div>
          )}
          <div className="blog-article-cta"><div><p className="meta text-lime">HAVE A STORY TO SHARE?</p><p>Help make the BTB reading room useful for the next person.</p></div><Link href="/blog/contribute" className="blog-text-link">Post a contribution <ArrowRight aria-hidden="true" /></Link></div>
          <Link href={`/blog/${nextPost.slug}`} className="blog-next-story"><span className="meta">NEXT STORY / {nextPost.category.toUpperCase()}</span><strong className="display">{nextPost.title}</strong><ArrowRight aria-hidden="true" /></Link>
        </div>
      </article>
    </>
  );
}
