create table if not exists public.owned_cards (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  card_id text not null,
  copies jsonb not null default '[]'::jsonb,
  notes text not null default '',
  photo text,
  updated_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

alter table public.owned_cards enable row level security;

drop policy if exists "owned_cards_select_own" on public.owned_cards;
create policy "owned_cards_select_own"
on public.owned_cards
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "owned_cards_insert_own" on public.owned_cards;
create policy "owned_cards_insert_own"
on public.owned_cards
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "owned_cards_update_own" on public.owned_cards;
create policy "owned_cards_update_own"
on public.owned_cards
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "owned_cards_delete_own" on public.owned_cards;
create policy "owned_cards_delete_own"
on public.owned_cards
for delete
to authenticated
using (user_id = auth.uid());

create index if not exists owned_cards_user_updated_idx
on public.owned_cards (user_id, updated_at desc);
