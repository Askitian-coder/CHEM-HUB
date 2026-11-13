create table public.study_topic_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id text not null check (topic_id in (
    'measurement-matter',
    'atomic-structure-light',
    'moles-stoichiometry',
    'gas-laws',
    'solutions-colligative',
    'thermochemistry-thermodynamics',
    'kinetics-equilibrium',
    'acids-bases-buffers',
    'electrochemistry-nuclear'
  )),
  completed boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, topic_id),
  check (completed = (completed_at is not null))
);

create table public.study_activity (
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null default current_date,
  primary key (user_id, activity_date)
);

alter table public.study_topic_progress enable row level security;
alter table public.study_activity enable row level security;

create policy "Users can read their own topic progress"
  on public.study_topic_progress for select
  using ((select auth.uid()) = user_id);

create policy "Users can create their own topic progress"
  on public.study_topic_progress for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own topic progress"
  on public.study_topic_progress for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can read their own study activity"
  on public.study_activity for select
  using ((select auth.uid()) = user_id);

create policy "Users can create their own study activity"
  on public.study_activity for insert
  with check ((select auth.uid()) = user_id);

grant select, insert, update on public.study_topic_progress to authenticated;
grant select, insert on public.study_activity to authenticated;

create or replace function public.record_study_session()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Sign in is required to record study activity.';
  end if;

  insert into public.study_activity (user_id)
  values (current_user_id)
  on conflict (user_id, activity_date) do nothing;
end;
$$;

create or replace function public.save_study_topic(p_topic_id text, p_completed boolean)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  completion_time timestamptz;
begin
  if current_user_id is null then
    raise exception 'Sign in is required to save topic progress.';
  end if;

  if p_completed then
    completion_time := now();
  end if;

  insert into public.study_topic_progress (user_id, topic_id, completed, completed_at, updated_at)
  values (current_user_id, p_topic_id, p_completed, completion_time, now())
  on conflict (user_id, topic_id) do update
  set completed = excluded.completed,
      completed_at = excluded.completed_at,
      updated_at = now();

  if p_completed then
    perform public.record_study_session();
  end if;
end;
$$;

revoke all on function public.record_study_session() from public, anon, authenticated;
revoke all on function public.save_study_topic(text, boolean) from public, anon, authenticated;
grant execute on function public.record_study_session() to authenticated;
grant execute on function public.save_study_topic(text, boolean) to authenticated;
