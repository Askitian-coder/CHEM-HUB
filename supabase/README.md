# ChemHub authentication and account summaries

ChemHub uses Supabase Auth for email/password sign-up and sign-in. Its scheduled email contains only the total account count and new accounts created in the previous 24 hours. It never emails user rows, email addresses, passwords, or other personal data.

Signed-in students can use the Study Progress page to track completion of nine chemistry topics and record study days. Row-level security keeps each student's progress private to their own account.

## Configure the app

1. Create a Supabase project and copy its project URL and publishable (or legacy `anon`) key.
2. Copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. These are browser-facing values; never put a service-role key in `VITE_*` variables.
3. In Supabase Authentication settings, set the site URL to `https://askitian-coder.github.io/CHEM-HUB/` and allow that URL plus your local development URL, such as `http://localhost:5173/`, as redirects.
4. Restart the Vite server after changing `.env.local`.
5. In the GitHub repository's **Settings → Secrets and variables → Actions → Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` so the Pages build can enable sign-in. These values are browser-facing; do not add a service-role key.
6. Apply the study-progress migration to the linked project so the dashboard tables and row-level security policies exist:

   ```powershell
   supabase db push
   ```

## Configure daily aggregate email

The report is scheduled for **12:00 UTC daily**. Supabase Cron invokes an Edge Function, which runs a restricted database function returning only aggregate counts, then sends those counts through Resend.

1. Install and authenticate the Supabase CLI, then link this folder to your project with `supabase link --project-ref <project-ref>`.
2. In Supabase Vault, create secrets named `chemhub_project_url` (the project URL) and `chemhub_cron_secret` (a long random value). Use the same `chemhub_cron_secret` value in the Edge Function configuration below.
3. Configure these Edge Function secrets without committing them:

   ```text
   CHEMHUB_CRON_SECRET=<same random value stored in Vault>
   RESEND_API_KEY=<Resend API key>
   REPORT_FROM=ChemHub Reports <reports@your-verified-domain>
   REPORT_TO=askitian@gmail.com
   ```

   Supabase provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions. Keep the service-role key server-side.
4. Deploy the Edge Function:

   ```powershell
   supabase functions deploy daily-auth-summary
   ```

5. Only after the Vault and Edge Function secrets above are in place, open the Supabase SQL Editor and run [`optional-migrations/20261113210000_daily_auth_summary.sql`](./optional-migrations/20261113210000_daily_auth_summary.sql) once. This optional schedule is intentionally outside `supabase/migrations`, so a routine `supabase db push` cannot start an unconfigured email job.
6. Add the configured Vite values to your hosting provider's environment settings and rebuild/redeploy the frontend.

The migration grants execution of `get_daily_auth_counts()` only to `service_role`. The Edge Function endpoint does not rely on a browser key; it checks the separate cron secret before doing any work. The sender address must belong to a domain verified with Resend.
