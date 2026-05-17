# Trek Africa Guide Supplier Platform

This supplier platform is Supabase-native. The backend lives in:

- `supabase/migrations/20260517000100_create_supplier_marketplace.sql`
- Supabase Auth for supplier/admin identity
- Supabase Storage buckets `supplier-media` and `supplier-documents`
- Supabase RLS policies for supplier-owned data and admin controls
- Supabase RPC functions for commission, booking completion, payout batching, and payout marking

## Launch Steps

1. Apply migrations to the Supabase project.
2. In Supabase Auth, set Trek Africa Guide admins with `app_metadata.role = "admin"` or `"super_admin"`.
3. Edit `public/suppliers/supabase-config.js` and set:
   - `url`
   - `anonKey`
4. Deploy the static site. The supplier portal is available at `/suppliers/` and commission terms at `/supplier-terms/`.

## Commission Model

The default commission is stored in `supplier_commission_settings` with key `default`. Admins can override commission on:

- `supplier_profiles.commission_rate`
- `supplier_products.commission_rate`

Commission precedence is product override, supplier override, then global default.

Each booking stores:

- `total_amount`
- `commission_rate`
- `commission_amount`
- `supplier_payout_amount`
- `audit`

The trigger `calculate_supplier_booking_commission_before_write` recalculates commission whenever booking amount, supplier, or product changes.

## Payout Flow

Completed paid bookings become payout-eligible. Admins call:

```sql
select public.create_supplier_monthly_payout('<supplier_id>', '2026-04-01', '2026-04-30');
```

After payment is sent by bank or mobile money:

```sql
select public.mark_supplier_payout_paid('<payout_id>', 'BANK-REFERENCE-123', 'https://receipt-url');
```

## Notifications

New direct bookings create:

- An in-dashboard supplier notification
- Email/SMS outbox rows in `supplier_notification_outbox`

Connect an Edge Function or external worker to send pending outbox rows through the chosen email/SMS provider.
