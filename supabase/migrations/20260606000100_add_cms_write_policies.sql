-- ============================================================
-- CMS Write Policies — authenticated role only
-- Adds INSERT / UPDATE / DELETE on all 8 content tables
-- Run this after the base schema migration.
-- ============================================================

alter table public.regions add column if not exists gallery jsonb;
alter table public.countries add column if not exists gallery jsonb;
alter table public.accommodations add column if not exists gallery jsonb;
alter table public.restaurants add column if not exists gallery jsonb;

-- regions ---------------------------------------------------
drop policy if exists "Authenticated users can insert regions" on public.regions;
create policy "Authenticated users can insert regions"
on public.regions for insert to authenticated with check (true);

drop policy if exists "Authenticated users can update regions" on public.regions;
create policy "Authenticated users can update regions"
on public.regions for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can delete regions" on public.regions;
create policy "Authenticated users can delete regions"
on public.regions for delete to authenticated using (true);

-- countries -------------------------------------------------
drop policy if exists "Authenticated users can insert countries" on public.countries;
create policy "Authenticated users can insert countries"
on public.countries for insert to authenticated with check (true);

drop policy if exists "Authenticated users can update countries" on public.countries;
create policy "Authenticated users can update countries"
on public.countries for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can delete countries" on public.countries;
create policy "Authenticated users can delete countries"
on public.countries for delete to authenticated using (true);

-- attractions -----------------------------------------------
drop policy if exists "Authenticated users can insert attractions" on public.attractions;
create policy "Authenticated users can insert attractions"
on public.attractions for insert to authenticated with check (true);

drop policy if exists "Authenticated users can update attractions" on public.attractions;
create policy "Authenticated users can update attractions"
on public.attractions for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can delete attractions" on public.attractions;
create policy "Authenticated users can delete attractions"
on public.attractions for delete to authenticated using (true);

-- accommodations --------------------------------------------
drop policy if exists "Authenticated users can insert accommodations" on public.accommodations;
create policy "Authenticated users can insert accommodations"
on public.accommodations for insert to authenticated with check (true);

drop policy if exists "Authenticated users can update accommodations" on public.accommodations;
create policy "Authenticated users can update accommodations"
on public.accommodations for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can delete accommodations" on public.accommodations;
create policy "Authenticated users can delete accommodations"
on public.accommodations for delete to authenticated using (true);

-- restaurants -----------------------------------------------
drop policy if exists "Authenticated users can insert restaurants" on public.restaurants;
create policy "Authenticated users can insert restaurants"
on public.restaurants for insert to authenticated with check (true);

drop policy if exists "Authenticated users can update restaurants" on public.restaurants;
create policy "Authenticated users can update restaurants"
on public.restaurants for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can delete restaurants" on public.restaurants;
create policy "Authenticated users can delete restaurants"
on public.restaurants for delete to authenticated using (true);

-- tour_operators --------------------------------------------
drop policy if exists "Authenticated users can insert tour operators" on public.tour_operators;
create policy "Authenticated users can insert tour operators"
on public.tour_operators for insert to authenticated with check (true);

drop policy if exists "Authenticated users can update tour operators" on public.tour_operators;
create policy "Authenticated users can update tour operators"
on public.tour_operators for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can delete tour operators" on public.tour_operators;
create policy "Authenticated users can delete tour operators"
on public.tour_operators for delete to authenticated using (true);

-- page_sections ---------------------------------------------
drop policy if exists "Authenticated users can insert page sections" on public.page_sections;
create policy "Authenticated users can insert page sections"
on public.page_sections for insert to authenticated with check (true);

drop policy if exists "Authenticated users can update page sections" on public.page_sections;
create policy "Authenticated users can update page sections"
on public.page_sections for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can delete page sections" on public.page_sections;
create policy "Authenticated users can delete page sections"
on public.page_sections for delete to authenticated using (true);

-- site_settings ---------------------------------------------
drop policy if exists "Authenticated users can insert site settings" on public.site_settings;
create policy "Authenticated users can insert site settings"
on public.site_settings for insert to authenticated with check (true);

drop policy if exists "Authenticated users can update site settings" on public.site_settings;
create policy "Authenticated users can update site settings"
on public.site_settings for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can delete site settings" on public.site_settings;
create policy "Authenticated users can delete site settings"
on public.site_settings for delete to authenticated using (true);
