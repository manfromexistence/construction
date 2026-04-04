# Changelog

## 2026-04-04

- Added full admin user management actions in `actions/admin-users.ts`, including role updates, profile updates, activation/deactivation, deletion, activity summaries, and bulk admin operations.
- Added admin user edit sheet UI in `components/edms/admin-user-edit-sheet.tsx`.
- Upgraded `/dashboard/admin/users` with search, sorting, bulk actions, CSV export, pagination, and direct user detail links.
- Added admin user detail page at `/dashboard/admin/users/[userId]` with profile details, activity stats, memberships, uploaded documents, and recent audit activity.
- Added admin analytics dashboard at `/dashboard/admin/analytics` with charts for document uploads, workflow status, user growth, active users, and active projects.
- Upgraded `/dashboard/search` with advanced filters, comment/workflow-note search, result source badges, and browser-local saved searches/history.
- Added admin analytics navigation links to the dashboard sidebar and admin overview.
- Stabilized local production build by reducing static-generation pressure in `next.config.ts`.
- Added project-scoped visibility helpers so non-admin users only see accessible projects and related records across dashboard, documents, workflows, transmittals, search, and detail pages.
- Updated workflow comment decisions to notify the document originator and log the review-return event so contractor/client comment loops are visible in-app.
- Added `TODO.md` and `CHANGELOG.md` to track current EDMS status directly in the repo.
