-- Projetos publicados sem os campos obrigatórios voltam a ser rascunho antes das restrições novas.
-- Na aplicação desta migração: sss, ssss, teste e teste-1 (sem descrição, tecnologia e desenvolvedor).
update public.projects
set published = false
where published
  and (
    client = ''
    or summary = ''
    or description = ''
    or cardinality(technologies) = 0
    or cardinality(developers) = 0
  );

-- Limites de tamanho que o layout da página do projeto comporta; rascunhos podem ficar sem resumo.
alter table public.projects
  drop constraint projects_name_check,
  drop constraint projects_summary_check,
  add constraint projects_name_check check (char_length(name) between 1 and 40),
  add constraint projects_summary_check check (char_length(summary) <= 160),
  add constraint projects_description_check check (char_length(description) <= 1200),
  add constraint projects_published_complete_check check (
    not published
    or (
      client <> ''
      and summary <> ''
      and description <> ''
      and cardinality(technologies) > 0
      and cardinality(developers) > 0
    )
  );

alter table public.project_features
  drop constraint project_features_title_check,
  add constraint project_features_title_check check (char_length(title) between 1 and 60),
  add constraint project_features_description_check check (char_length(description) <= 200);
