create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

create or replace function public.get_daily_auth_counts()
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'total_accounts', count(*),
    'new_accounts_last_24h', count(*) filter (
      where created_at >= now() - interval '24 hours'
    )
  )
  from auth.users;
$$;

revoke all on function public.get_daily_auth_counts() from public, anon, authenticated;
grant execute on function public.get_daily_auth_counts() to service_role;

select cron.schedule(
  'chemhub-daily-account-summary',
  '0 12 * * *',
  $job$
    select net.http_post(
      url := (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'chemhub_project_url'
      ) || '/functions/v1/daily-auth-summary',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-cron-secret', (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'chemhub_cron_secret'
        )
      ),
      body := '{}'::jsonb
    );
  $job$
);
