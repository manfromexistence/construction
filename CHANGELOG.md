# Construction EDMS - Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Created TODO.md to track development progress
- Created CHANGELOG.md to track project history
- Initialized project transformation from theme manager to EDMS
- Added a protected EDMS dashboard shell at `/dashboard`
- Added dashboard routes for projects, documents, workflows, transmittals, and notifications
- Added project creation and project detail flows inside `/dashboard/projects`
- Added shared EDMS widgets for project watchlists, document control, workflow queues, transmittals, notifications, and audit activity
- Added server-side dashboard data loading with safe fallback sample data while migrations are pending
- Created comprehensive database schema for EDMS:
  - Projects table with client and member management
  - Documents table with version control and metadata
  - Document versions tracking
  - Document comments and reviews
  - Workflow management tables
  - Transmittals module tables
  - Notifications and activity log tables
- Extended user table with EDMS-specific fields (role, organization, job title, etc.)
- Created modular schema structure in `db/schema/`

### Changed
- Project name: `tweakcn-next` -> `construction-edms`
- Project description: Theme customization tool -> Electronic Document Management System
- Target users: Construction companies, PMC consultants, vendors, subcontractors
- Updated README.md with Construction EDMS information
- Updated package.json with new project details
- Replaced the legacy `/dashboard` redirect with the first Construction EDMS operations dashboard
- Turned the projects area into the first working core module with create/list/detail behavior and automatic creator assignment
- Restored a clean TypeScript baseline by fixing schema relation typing, Figma icon imports, and the stale Tiptap expectation comment

### Retained
- Authentication system (Google/GitHub OAuth + Better Auth)
- Database infrastructure (Neon PostgreSQL + Drizzle ORM)
- UI components (shadcn-ui)
- Theme system for UI customization
- Next.js 16.2.1 with Turbopack
- Biome for linting and formatting

---

## [0.1.0] - 2026-04-01

### Fixed
- All TypeScript errors resolved
- ColorPicker hydration mismatch fixed
- SearchParams null safety issues fixed
- Post-login action type safety issues fixed
- Debounce type compatibility across multiple files
- Tiptap mention suggestion types fixed
- AI provider v3 compatibility (switched to Groq)
- Build configuration with heap size increase
- Excluded integrations folder from TypeScript checks

### Added
- `POLAR_WEBHOOK_SECRET` environment variable
- Production build successful
- All changes committed and pushed to GitHub

### Technical Details
- Next.js: 16.2.1
- React: 19.0.0
- TypeScript: 5.x
- Database: PostgreSQL (Neon)
- ORM: Drizzle
- UI: shadcn-ui + Tailwind CSS
- Auth: Better Auth
- AI: Groq (Llama 3.3 70B)

---

## Project History (Pre-EDMS)

### Theme Manager Era
The project started as a theme customization tool for shadcn-ui components, featuring:
- Real-time theme preview
- AI-powered theme generation
- Community theme sharing
- Theme export functionality
- Color palette management
- Typography customization

This foundation provides:
- Robust authentication system
- Database infrastructure
- Modern UI component library
- Theme and styling system
- File management capabilities

---

**Note:** This changelog will be updated as we progress through the EDMS development phases.
