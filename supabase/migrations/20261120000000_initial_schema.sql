create type public.project_type as enum ('app', 'site', 'system');
create type public.planet_texture as enum ('gas', 'rocky', 'earth', 'ice');

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 80),
  client text not null default '',
  year smallint not null check (year between 2000 and 2100),
  type public.project_type not null,
  summary text not null check (char_length(summary) between 1 and 200),
  description text not null default '',
  technologies text[] not null default '{}',
  developers text[] not null default '{}',
  color_primary text not null check (color_primary ~ '^#[0-9A-Fa-f]{6}$'),
  color_accent text not null check (color_accent ~ '^#[0-9A-Fa-f]{6}$'),
  color_background text not null check (color_background ~ '^#[0-9A-Fa-f]{6}$'),
  texture public.planet_texture not null default 'rocky',
  has_ring boolean not null default false,
  published boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_published_position_idx on public.projects (published, position);

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create table public.project_features (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  description text not null default '',
  position integer not null default 0
);

create index project_features_project_idx on public.project_features (project_id, position);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  path text not null,
  alt text not null check (char_length(alt) between 1 and 200),
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index project_images_project_idx on public.project_images (project_id, position);

-- RLS é a fonte da verdade: visitantes só veem o que foi publicado; a equipe logada faz tudo.
alter table public.projects enable row level security;
alter table public.project_features enable row level security;
alter table public.project_images enable row level security;

grant usage on type public.project_type, public.planet_texture to anon, authenticated;
grant select on public.projects, public.project_features, public.project_images to anon;
grant select, insert, update, delete
  on public.projects, public.project_features, public.project_images to authenticated;

create policy "Visitors read published projects"
on public.projects for select to anon
using (published);

create policy "Team manages projects"
on public.projects for all to authenticated
using (true) with check (true);

create policy "Visitors read features of published projects"
on public.project_features for select to anon
using (exists (
  select 1 from public.projects p where p.id = project_id and p.published
));

create policy "Team manages features"
on public.project_features for all to authenticated
using (true) with check (true);

create policy "Visitors read images of published projects"
on public.project_images for select to anon
using (exists (
  select 1 from public.projects p where p.id = project_id and p.published
));

create policy "Team manages images"
on public.project_images for all to authenticated
using (true) with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/avif']
);

create policy "Team uploads project images"
on storage.objects for insert to authenticated
with check (bucket_id = 'project-images');

create policy "Team updates project images"
on storage.objects for update to authenticated
using (bucket_id = 'project-images');

create policy "Team deletes project images"
on storage.objects for delete to authenticated
using (bucket_id = 'project-images');
