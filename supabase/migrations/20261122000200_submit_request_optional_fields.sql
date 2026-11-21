-- Telefone, prazo e hash do IP podem faltar: a função passa a aceitar texto vazio nesses campos,
-- porque a API não tem como mandar "sem valor" para parâmetros sem padrão.
drop function public.submit_project_request(
  text, text, public.request_platform, text, text, public.contact_preference, date, boolean, text
);

create function public.submit_project_request(
  p_client_name text,
  p_description text,
  p_platform public.request_platform,
  p_email text,
  p_phone text,
  p_contact_preference public.contact_preference,
  p_deadline text,
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
  if nullif(p_deadline, '') is not null
     and p_deadline::date < (now() at time zone 'America/Sao_Paulo')::date then
    raise exception 'O prazo não pode ser uma data passada.' using errcode = '22023';
  end if;

  if (select count(*) from public.project_requests where created_at > window_start) >= 30 then
    return 'rate_limited';
  end if;

  if nullif(p_ip_hash, '') is not null and (
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
    p_contact_preference, nullif(p_deadline, '')::date, p_consent, nullif(p_ip_hash, '')
  );
  return 'ok';
end;
$$;

revoke all on function public.submit_project_request from public;
grant execute on function public.submit_project_request to anon, authenticated;
