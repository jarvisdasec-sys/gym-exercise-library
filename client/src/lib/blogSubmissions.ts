import { BLOG_CATEGORIES, type BlogCategory } from "@/lib/blog";
import { supabase } from "@/lib/supabase";

export const BLOG_IMAGE_BUCKET = "btb-blog-images";
export const MAX_BLOG_BODY_LENGTH = 10_000;
export const MAX_BLOG_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_BLOG_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type BlogTopic = BlogCategory | "Other";
export type BlogContributionType = "article" | "short_post" | "image" | "other";

export type BlogContributionInput = {
  title: string;
  body: string;
  authorName: string;
  category: BlogTopic;
  contributionType: BlogContributionType;
  image: File | null;
};

export type CommunityBlogPost = {
  id: string;
  title: string;
  body: string;
  authorName: string;
  category: BlogTopic;
  contributionType: BlogContributionType;
  imageUrl: string | null;
  createdAt: string;
};

type BlogPostRow = {
  id: string;
  title: string;
  body: string;
  author_name: string;
  category: BlogTopic;
  contribution_type: BlogContributionType;
  image_path: string | null;
  created_at: string;
};

const POST_COLUMNS =
  "id,title,body,author_name,category,contribution_type,image_path,created_at";
const TOPICS: BlogTopic[] = [...BLOG_CATEGORIES, "Other"];
const CONTRIBUTION_TYPES: BlogContributionType[] = [
  "article",
  "short_post",
  "image",
  "other",
];
const EXTENSION_BY_MIME: Record<(typeof ALLOWED_BLOG_IMAGE_TYPES)[number], string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function validateBlogContribution(
  input: BlogContributionInput
): string | null {
  const title = input.title.trim();
  const body = input.body.trim();
  const authorName = input.authorName.trim();

  if (!title) return "Add a title before publishing.";
  if (title.length > 120) return "Keep the title to 120 characters or fewer.";
  if (body.length > MAX_BLOG_BODY_LENGTH)
    return `Keep the post to ${MAX_BLOG_BODY_LENGTH.toLocaleString()} characters or fewer.`;
  if (authorName.length > 80)
    return "Keep the display name to 80 characters or fewer.";
  if (!TOPICS.includes(input.category)) return "Choose a valid blog topic.";
  if (!CONTRIBUTION_TYPES.includes(input.contributionType))
    return "Choose a valid contribution type.";
  if (!body && !input.image)
    return "Add text or choose an image before publishing.";
  if (input.contributionType === "image" && !input.image)
    return "Choose an image for an image contribution.";
  if (input.image) {
    if (
      !ALLOWED_BLOG_IMAGE_TYPES.includes(
        input.image.type as (typeof ALLOWED_BLOG_IMAGE_TYPES)[number]
      )
    ) {
      return "Use a JPEG, PNG, or WebP image.";
    }
    if (input.image.size <= 0 || input.image.size > MAX_BLOG_IMAGE_BYTES)
      return "Choose an image no larger than 5 MB.";
  }
  return null;
}

function toCommunityPost(row: BlogPostRow): CommunityBlogPost {
  const imageUrl = row.image_path && supabase
    ? supabase.storage.from(BLOG_IMAGE_BUCKET).getPublicUrl(row.image_path).data.publicUrl
    : null;
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    authorName: row.author_name,
    category: row.category,
    contributionType: row.contribution_type,
    imageUrl,
    createdAt: row.created_at,
  };
}

export async function listCommunityBlogPosts(): Promise<CommunityBlogPost[]> {
  if (!supabase) throw new Error("Public blog posting is not configured yet.");
  const { data, error } = await supabase
    .from("blog_posts")
    .select(POST_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data as BlogPostRow[]).map(toCommunityPost);
}

export async function getCommunityBlogPost(
  id: string
): Promise<CommunityBlogPost | null> {
  if (!supabase) throw new Error("Public blog posting is not configured yet.");
  const { data, error } = await supabase
    .from("blog_posts")
    .select(POST_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toCommunityPost(data as BlogPostRow) : null;
}

export async function publishCommunityBlogPost(
  input: BlogContributionInput
): Promise<CommunityBlogPost> {
  if (!supabase) throw new Error("Public blog posting is not configured yet.");
  const validationError = validateBlogContribution(input);
  if (validationError) throw new Error(validationError);

  const id = globalThis.crypto.randomUUID();
  let imagePath: string | null = null;
  if (input.image) {
    const extension = EXTENSION_BY_MIME[
      input.image.type as (typeof ALLOWED_BLOG_IMAGE_TYPES)[number]
    ];
    imagePath = `${id}/${id}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(BLOG_IMAGE_BUCKET)
      .upload(imagePath, input.image, {
        contentType: input.image.type,
        upsert: false,
      });
      if (uploadError) {
        throw uploadError;
      }
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      id,
      title: input.title.trim(),
      body: input.body.trim(),
      author_name: input.authorName.trim() || "BTB Community",
      category: input.category,
      contribution_type: input.contributionType,
      image_path: imagePath,
    })
    .select(POST_COLUMNS)
    .single();
  if (error) {
    throw error;
  }
  return toCommunityPost(data as BlogPostRow);
}
