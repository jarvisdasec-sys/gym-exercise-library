import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  MAX_BLOG_BODY_LENGTH,
  MAX_BLOG_IMAGE_BYTES,
  validateBlogContribution,
  type BlogContributionInput,
} from "@/lib/blogSubmissions";

const projectRoot = path.resolve(process.cwd());
const base: BlogContributionInput = {
  title: "A useful habit",
  body: "A short community contribution.",
  authorName: "Alex",
  category: "Health",
  contributionType: "article",
  image: null,
};

const fakeImage = (type: string, size: number) => ({ type, size }) as File;

describe("direct community blog publishing", () => {
  it("accepts a valid public article without login or email fields", () => {
    expect(validateBlogContribution(base)).toBeNull();
  });

  it("requires a title and either text or an image", () => {
    expect(validateBlogContribution({ ...base, title: " " })).toMatch(/title/i);
    expect(validateBlogContribution({ ...base, body: " " })).toMatch(/text or choose an image/i);
  });

  it("enforces title, body and optional display-name limits", () => {
    expect(validateBlogContribution({ ...base, title: "T".repeat(121) })).toMatch(/120/);
    expect(validateBlogContribution({ ...base, body: "B".repeat(MAX_BLOG_BODY_LENGTH + 1) })).toMatch(/10,000/);
    expect(validateBlogContribution({ ...base, authorName: "N".repeat(81) })).toMatch(/80/);
  });

  it("requires an image for photo-only contributions and limits uploads to JPEG, PNG or WebP up to 5 MB", () => {
    expect(validateBlogContribution({ ...base, contributionType: "image", body: "", image: null })).toMatch(/choose an image/i);
    const photo = { ...base, contributionType: "image" as const, body: "", image: fakeImage("image/png", 1024) };
    expect(validateBlogContribution(photo)).toBeNull();
    expect(validateBlogContribution({ ...photo, image: fakeImage("image/svg+xml", 1024) })).toMatch(/JPEG, PNG, or WebP/i);
    expect(validateBlogContribution({ ...photo, image: fakeImage("image/png", MAX_BLOG_IMAGE_BYTES + 1) })).toMatch(/5 MB/i);
  });

  it("keeps database publication anonymous and prevents public editing/deletion", () => {
    const migration = readFileSync(
      path.join(projectRoot, "supabase/migrations/20261029000000_public_blog_posts.sql"),
      "utf8"
    );
    expect(migration).toMatch(/for select\s+to anon, authenticated/i);
    expect(migration).toMatch(/for insert\s+to anon, authenticated/i);
    expect(migration).toMatch(/grant insert \(id, title, body, author_name, category, contribution_type, image_path\)/i);
    expect(migration).not.toMatch(/grant\s+(update|delete)\b[^;]*blog_posts/i);
    expect(migration).toContain("5242880");
    expect(migration).toContain("btb-blog-images");
    expect(migration).toContain("cleanup_unattached_blog_image");
    expect(migration).toContain("15 minutes");
    expect(migration).toContain("id::text || '/' || id::text || '.jpg'");
    expect(migration).not.toMatch(/email|author_email/i);
  });
});
