-- Pedidos de projeto enviados pelo formulário público "Solicitar projeto".
create type public.request_platform as enum ('web', 'mobile', 'web_and_mobile');
create type public.contact_preference as enum ('email', 'phone');
create type public.request_status as enum ('new', 'contacted', 'closed');

create table public.project_requests (
  id uuid primary key default gen_random_uuid(),
  client_name text not null check (char_length(client_name) between 1 and 100),
  description text not null check (char_length(description) between 30 and 3000),
  platform public.request_platform not null,
  email text not null check (char_length(email) between 3 and 254 and email like '%_@_%'),
  -- Só os dígitos, com DDD: 10 para fixo e 11 para celular.
  phone text check (phone is null or phone ~ '^[0-9]{10,11}$'),
  contact_preference public.contact_preference not null,
  deadline date,
  consent boolean not null check (consent),
  status public.request_status not null default 'new',
  -- Hash do IP com sal, só para o limite de envios; o IP em si não é guardado.
  ip_hash text,
  created_at timestamptz not null default now(),
  constraint project_requests_phone_when_preferred check (
    contact_preference <> 'phone' or phone is not null
  )
);

create index project_requests_created_idx on public.project_requests (created_at desc);
create index project_requests_ip_idx on public.project_requests (ip_hash, created_at);

-- Visitantes não leem nem escrevem na tabela diretamente: o único caminho de entrada é a função
-- submit_project_request, que também aplica o limite de envios. A equipe logada lê, atualiza o
-- status e pode apagar pedidos (por exemplo, a pedido do titular dos dados, pela LGPD).
alter table public.project_requests enable row level security;

grant usage on type public.request_platform, public.contact_preference, public.request_status
  to anon, authenticated;
grant select, update, delete on public.project_requests to authenticated;

create policy "Team reads requests"
on public.project_requests for select to authenticated
using (true);

create policy "Team updates requests"
on public.project_requests for update to authenticated
using (true) with check (true);

create policy "Team deletes requests"
on public.project_requests for delete to authenticated
using (true);

-- Limites: 3 pedidos a cada 10 minutos por origem e um teto geral, para quem chamar a função
-- direto pela API com hashes inventados.
create function public.submit_project_request(
  p_client_name text,
  p_description text,
  p_platform public.request_platform,
  p_email text,
  p_phone text,
  p_contact_preference public.contact_preference,
  p_deadline date,
  p_consent boolean,
  p_ip_hash text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  window_start timestamptz := now() - interval '10 minutes';
begin
  if p_deadline is not null
     and p_deadline < (now() at time zone 'America/Sao_Paulo')::date then
    raise exception 'O prazo não pode ser uma data passada.' using errcode = '22023';
  end if;

  if (select count(*) from public.project_requests where created_at > window_start) >= 30 then
    return 'rate_limited';
  end if;

  if p_ip_hash is not null and (
    select count(*) from public.project_requests
    where ip_hash = p_ip_hash and created_at > window_start
  ) >= 3 then
    return 'rate_limited';
  end if;

  insert into public.project_requests (
    client_name, description, platform, email, phone, contact_preference, deadline, consent,
    ip_hash
  ) values (
    p_client_name, p_description, p_platform, p_email, nullif(p_phone, ''),
    p_contact_preference, p_deadline, p_consent, p_ip_hash
  );
  return 'ok';
end;
$$;

revoke all on function public.submit_project_request from public;
grant execute on function public.submit_project_request to anon, authenticated;
