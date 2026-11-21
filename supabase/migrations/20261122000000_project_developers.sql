-- Cada desenvolvedor vira uma linha própria, com um link de contato opcional (GitHub, LinkedIn...).
create table public.project_developers (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  url text check (url is null or (url ~ '^https://[^[:space:]]+$' and char_length(url) <= 300)),
  position integer not null default 0
);

create index project_developers_project_idx on public.project_developers (project_id, position);

alter table public.project_developers enable row level security;

grant select on public.project_developers to anon;
grant select, insert, update, delete on public.project_developers to authenticated;

create policy "Visitors read developers of published projects"
on public.project_developers for select to anon
using (exists (
  select 1 from public.projects p where p.id = project_id and p.published
));

create policy "Team manages developers"
on public.project_developers for all to authenticated
using (true) with check (true);

-- Copia os nomes da coluna antiga, na mesma ordem, antes de removê-la.
insert into public.project_developers (project_id, name, position)
select p.id, developer.name, developer.ordinality - 1
from public.projects p
cross join lateral unnest(p.developers) with ordinality as developer (name, ordinality);

-- Se algum nome não tiver sido copiado, a migração inteira é desfeita.
do $$
begin
  if (select coalesce(sum(cardinality(developers)), 0) from public.projects)
     <> (select count(*) from public.project_developers) then
    raise exception 'Nem todos os desenvolvedores foram copiados para project_developers.';
  end if;
end $$;

-- A exigência de ao menos um desenvolvedor para publicar passa para a Server Action, como já
-- acontece com funcionalidades e telas, que também ficam em tabelas filhas.
alter table public.projects
  drop constraint projects_published_complete_check,
  add constraint projects_published_complete_check check (
    not published
    or (
      client <> ''
      and summary <> ''
      and description <> ''
      and cardinality(technologies) > 0
    )
  );

alter table public.projects drop column developers;
