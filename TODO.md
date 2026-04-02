# QUADRA Fixes TODO

> Auto-managed by AI. Updated after every completed or failed task.

## In Progress

- [ ] 1. Add BLOB_READ_WRITE_TOKEN to .env.example
- [ ] 2. Verify live Resend sender configuration with `RESEND_FROM_EMAIL`

## Pending

- [ ] 3. Test file upload integration end to end with `BLOB_READ_WRITE_TOKEN`
- [ ] 4. Verify database schema and migrations in the live environment
- [ ] 5. Run comprehensive EDMS feature tests against production auth, onboarding, create, search, workflow, and transmittal flows

## Completed

- [x] Fix avatar 404 errors by restoring placeholder avatar assets
- [x] Fix project creation sheet padding
- [x] Create admin dashboard and admin users management pages
- [x] Replace the fragile modal-first auth entry with a stable `/auth` experience and improve email/password onboarding flow
- [x] Add password reset flow with Better Auth reset tokens and Resend email delivery
- [x] Align settings and dashboard theme navigation with Theme Studio and Theme Library
- [x] Fix stale production auth URL environment variables and redeploy the live app
- [x] Redirect legacy `/tweakcn` branding traffic back to the QUADRA home page
- [x] Rebuild and verify the application with `npx tsc --noEmit`, `npm run lint`, and `npm run build`

## Blocked / Failed
