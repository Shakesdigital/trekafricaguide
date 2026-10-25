grant select on public.profiles to authenticated;
create policy "CMS users read own role" on public.profiles for select to authenticated using (id = (select auth.uid()));
