-- Run this in the Supabase SQL Editor (supabase.com > your project > SQL Editor)

-- Lesson completion tracking
create table public.progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  track_slug text not null,
  module_slug text not null,
  lesson_slug text not null,
  completed_at timestamptz default now() not null,
  unique(user_id, module_slug, lesson_slug)
);

alter table public.progress enable row level security;
create policy "Users read own progress" on public.progress for select using (auth.uid() = user_id);
create policy "Users insert own progress" on public.progress for insert with check (auth.uid() = user_id);

-- Quiz results
create table public.quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  module_slug text not null,
  score integer not null,
  total_questions integer not null,
  passed boolean not null default false,
  completed_at timestamptz default now() not null
);

alter table public.quiz_results enable row level security;
create policy "Users read own quiz results" on public.quiz_results for select using (auth.uid() = user_id);
create policy "Users insert own quiz results" on public.quiz_results for insert with check (auth.uid() = user_id);

-- XP log
create table public.xp_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  amount integer not null,
  source text not null,
  source_id text not null,
  earned_at timestamptz default now() not null
);

alter table public.xp_log enable row level security;
create policy "Users read own xp" on public.xp_log for select using (auth.uid() = user_id);
create policy "Users insert own xp" on public.xp_log for insert with check (auth.uid() = user_id);

-- Achievements
create table public.achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  achievement_id text not null,
  unlocked_at timestamptz default now() not null,
  unique(user_id, achievement_id)
);

alter table public.achievements enable row level security;
create policy "Users read own achievements" on public.achievements for select using (auth.uid() = user_id);
create policy "Users insert own achievements" on public.achievements for insert with check (auth.uid() = user_id);

-- Streaks
create table public.streaks (
  user_id uuid references auth.users(id) on delete cascade primary key,
  current_streak integer default 0 not null,
  longest_streak integer default 0 not null,
  last_activity_date date
);

alter table public.streaks enable row level security;
create policy "Users read own streak" on public.streaks for select using (auth.uid() = user_id);
create policy "Users insert own streak" on public.streaks for insert with check (auth.uid() = user_id);
create policy "Users update own streak" on public.streaks for update using (auth.uid() = user_id);
