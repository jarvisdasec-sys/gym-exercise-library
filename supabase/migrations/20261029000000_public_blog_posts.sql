begin;

create table if not exists public.blog_posts (
  id uuid primary key,
  title text not null check (char_length(btrim(title)) between 1 and 120),
  body text not null default '' check (char_length(body) <= 10000),
  author_name text not null default 'BTB Community' check (char_length(author_name) <= 80),
  category text not null check (category in ('Weight Lifting', 'Health', 'Cardio', 'Gear', 'Other')),
  contribution_type text not null check (contribution_type in ('article', 'short_post', 'image', 'other')),
  image_path text,
  created_at timestamptz not null default now(),
  check (char_length(btrim(body)) > 0 or image_path is not null),
  check (contribution_type <> 'image' or image_path is not null),
  check (
    image_path is null
    or image_path in (
      id::text || '/' || id::text || '.jpg',
      id::text || '/' || id::text || '.png',
      id::text || '/' || id::text || '.webp'
    )
  )
);

alter table public.blog_posts enable row level security;

revoke all on public.blog_posts from anon, authenticated;
grant select on public.blog_posts to anon, authenticated;
grant insert (id, title, body, author_name, category, contribution_type, image_path)
  on public.blog_posts to anon, authenticated;

drop policy if exists "Anyone can read community blog posts" on public.blog_posts;
create policy "Anyone can read community blog posts"
  on public.blog_posts
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can publish community blog posts" on public.blog_posts;
create policy "Anyone can publish community blog posts"
  on public.blog_posts
  for insert
  to anon, authenticated
  with check (
    char_length(btrim(title)) between 1 and 120
    and char_length(body) <= 10000
    and char_length(author_name) <= 80
    and category in ('Weight Lifting', 'Health', 'Cardio', 'Gear', 'Other')
    and contribution_type in ('article', 'short_post', 'image', 'other')
    and (char_length(btrim(body)) > 0 or image_path is not null)
    and (contribution_type <> 'image' or image_path is not null)
    and (
      image_path is null
      or image_path in (
        id::text || '/' || id::text || '.jpg',
        id::text || '/' || id::text || '.png',
        id::text || '/' || id::text || '.webp'
      )
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'btb-blog-images',
  'btb-blog-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can view BTB blog images" on storage.objects;

drop policy if exists "Anyone can upload BTB blog images" on storage.objects;
create policy "Anyone can upload BTB blog images"
  on storage.objects
  for insert
  to anon, authenticated
  with check (
    bucket_id = 'btb-blog-images'
    and array_length(storage.foldername(name), 1) = 1
    and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and split_part(name, '/', 2) = (storage.foldername(name))[1] || '.' || lower(split_part(name, '.', 2))
    and lower(split_part(name, '.', 2)) in ('jpg', 'png', 'webp')
    and metadata ->> 'mimetype' in ('image/jpeg', 'image/png', 'image/webp')
  );

create or replace function public.cleanup_unattached_blog_image(p_path text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from storage.objects as o
  where o.bucket_id = 'btb-blog-images'
    and o.name = p_path
    and o.created_at > pg_catalog.now() - interval '15 minutes'
    and array_length(storage.foldername(o.name), 1) = 1
    and (storage.foldername(o.name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and split_part(o.name, '/', 2) in (
      (storage.foldername(o.name))[1] || '.jpg',
      (storage.foldername(o.name))[1] || '.png',
      (storage.foldername(o.name))[1] || '.webp'
    )
    and not exists (
      select 1 from public.blog_posts as post where post.image_path = o.name
    );
end;
$$;

revoke all on function public.cleanup_unattached_blog_image(text) from public;
grant execute on function public.cleanup_unattached_blog_image(text) to anon, authenticated;

commit;
