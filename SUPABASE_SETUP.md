SUPABASE SETUP — TAP-BY-TAP
==============================

1. Create a Supabase project.
2. Open SQL Editor → New query.
3. Paste all contents of supabase_schema.sql and Run.
4. Open Authentication → Users → Add user.
5. Create your private admin email/password.
6. Copy the new user's UUID.
7. In SQL Editor run:
   insert into public.profiles (id, is_admin)
   values ('PASTE_ADMIN_USER_UUID_HERE', true);

8. Open Project Settings → API.
9. Copy:
   - Project URL
   - Publishable key (or legacy anon key if your project displays that)
10. Open config.js.
11. Replace:
   YOUR_SUPABASE_PROJECT_URL
   YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY

12. Upload ALL files in this package to the root of your GitHub repository.
13. Keep GitHub Pages set to main → /(root).
14. Visit your website.
15. Test a booking request.
16. Open /admin.html and sign in with the admin account.

SECURITY
- Never paste a Supabase secret/service-role key into config.js.
- Customer inserts are allowed.
- Customer records are not publicly readable.
- Only an authenticated profile with is_admin=true can read/update dashboard data.

OPTIONAL NEXT STEP
After this is working, add real gallery photos to replace the visual placeholders.
