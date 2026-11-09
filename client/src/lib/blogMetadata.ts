import type { BlogPost } from "./blog";
import { absolutePublicUrl, BTB_SITE_ORIGIN } from "./exerciseMetadata";

export function getBlogPostMetadata(post: BlogPost) {
  return {
    title: `${post.title} | BTB Fitness & Health`,
    description: post.summary,
    url: `${BTB_SITE_ORIGIN}/blog/${post.slug}`,
    image: absolutePublicUrl(post.image),
    imageAlt: post.imageAlt,
    type: "article" as const,
  };
}
