-- Run in Supabase Dashboard > SQL Editor for the target project.
-- Re-runnable: policies and bucket settings are recreated safely.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 120),
  description text not null check (char_length(btrim(description)) between 1 and 1500),
  image_url text not null,
  date timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null
);

create index if not exists posts_date_desc_idx on public.posts (date desc);

alter table public.posts enable row level security;
grant select on public.posts to anon, authenticated;
grant insert, delete on public.posts to authenticated;

drop policy if exists "Public can read posts" on public.posts;
create policy "Public can read posts"
  on public.posts for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can create posts" on public.posts;
create policy "Admins can create posts"
  on public.posts for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Admins can delete posts" on public.posts;
create policy "Admins can delete posts"
  on public.posts for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('posts-images', 'posts-images', true, 15728640, array['image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view post images" on storage.objects;
create policy "Public can view post images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'posts-images');

drop policy if exists "Admins can upload post images" on storage.objects;
create policy "Admins can upload post images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'posts-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Admins can delete post images" on storage.objects;
create policy "Admins can delete post images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'posts-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
