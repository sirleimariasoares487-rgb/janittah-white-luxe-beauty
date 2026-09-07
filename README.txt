JANITTAH WHITE LUXE BEAUTY — VERSION 2
==========================================

This package upgrades the existing GitHub Pages website into a secure-ready
static frontend + Supabase database/admin system.

PUBLIC WEBSITE
- Luxury black + champagne/copper design retained.
- No public phone number.
- No public WhatsApp number.
- No public social-contact links.
- No public business email shown.
- Appointment form collects the customer's name and email privately.
- Support form collects name, email, subject, service and message.

ADMIN
- admin.html is a private dashboard.
- Supabase Authentication protects login.
- profiles.is_admin controls authorization.
- Admin can view/update appointment status.
- Admin can view/update support message status.

FILES
- index.html
- style.css
- script.js
- config.js
- admin.html
- admin.css
- admin.js
- supabase_schema.sql
- SUPABASE_SETUP.md

IMPORTANT
Do not put a Supabase secret/service-role key in config.js.
Only use the project's publishable/anon browser key.

GitHub Pages hosts the frontend. Supabase stores the customer requests.
